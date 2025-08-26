// REFACTORED JobList.jsx using modular components: JobCard, JobModal, JobMap, Pagination

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchJobs,
  addJobToFavorites,
  applyToJob,
  getUserJobInteractions,
} from "../../utils/api.supabase";
import JobFilter from "./JobFilter";
import JobCard from "./JobCard";
import JobModal from "./JobModal";
import JobMap from "./JobMap";
import Pagination from "./Pagination";
import "../../styles/JobCard.css";

// ✅ canonical tags + normalizer
import { resolveJobTag } from "../../constants/jobTags";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const PAGE_SIZE = 10;

const JobList = () => {
  const { _id } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    showFilters: false,
    tagIds: [],           // ✅ canonical tag IDs
    tagLogic: "and",      // "and" | "or"
    searchText: "",
    role: "",
    hours: "",
    location: "",
    type: "",
  });
  const [favorites, setFavorites] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMap, setShowMap] = useState(true);
  const [sort, setSort] = useState("newest");

  const [searchParams, setSearchParams] = useSearchParams();
  const page = parseInt(searchParams.get("page") || "1", 10);
  const debounceTimeout = useRef(null);

  // --- Helpers ---------------------------------------------------------------

  // Normalize any array of labels/ids -> canonical tag IDs (deduped)
  const toCanonicalIds = (arr = []) => {
    const out = [];
    for (const t of arr) {
      const id = resolveJobTag(t);
      if (id && !out.includes(id)) out.push(id);
    }
    return out;
  };

  // Derive canonical tag IDs stored on each job (back-compat with old data)
  const attachJobTagIds = (job) => {
    // Prefer server-provided canonical tag_ids
    if (Array.isArray(job.tag_ids) && job.tag_ids.length) {
      return { ...job, _tagIds: toCanonicalIds(job.tag_ids) };
    }
    // Fallback: old label-based `tags`
    if (Array.isArray(job.tags) && job.tags.length) {
      return { ...job, _tagIds: toCanonicalIds(job.tags) };
    }
    // Last resort: try to infer nothing (don’t extract from text here)
    return { ...job, _tagIds: [] };
  };

  // --- Default optometrist tag ----------------------------------------------
  // If user hasn’t applied custom filters and hasn’t stored override, add it once.
  useEffect(() => {
    const hasCustomFilters =
      (filters.tagIds && filters.tagIds.length > 0) ||
      filters.location ||
      filters.type ||
      filters.searchText ||
      filters.role ||
      filters.hours;

    const alreadyStored = localStorage.getItem("defaultRoleFilterV2");

    if (!hasCustomFilters && !alreadyStored) {
      localStorage.setItem("defaultRoleFilterV2", "optometrist");
      setFilters((prev) => ({
        ...prev,
        tagIds: Array.from(new Set([...(prev.tagIds || []), "optometrist"])),
      }));
    }
  }, [filters]);

  // --- Initialize filters from URL ------------------------------------------
  useEffect(() => {
    const initial = Object.fromEntries([...searchParams.entries()]);
    delete initial.page;
    delete initial.sort;

    // accept either new `tagIds` or old `searchTags` in URL (back-compat)
    const rawTagIds = (initial.tagIds || "").split(",").filter(Boolean);
    const rawSearchTags = (initial.searchTags || "").split(",").filter(Boolean);
    const canonical = toCanonicalIds(rawTagIds.length ? rawTagIds : rawSearchTags);

    setFilters({
      showFilters: false,
      tagIds: canonical,
      tagLogic: initial.tagLogic || "and",
      searchText: initial.searchText || "",
      role: initial.role || "",
      hours: initial.hours || "",
      location: initial.location || "",
      type: initial.type || "",
    });
    setSort(searchParams.get("sort") || "newest");
  }, [searchParams]);

  // --- Fetch jobs ------------------------------------------------------------
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs();
        // Attach canonical tag ids on client for filtering
        const withIds = (Array.isArray(data) ? data : []).map(attachJobTagIds);
        setJobs(withIds);
        setFilteredJobs(withIds);
      } catch (error) {
        console.error("Error fetching jobs:", error.message);
      }
    };
    loadJobs();
  }, []);

  // --- Load user interactions ------------------------------------------------
  useEffect(() => {
    const fetchInteractions = async () => {
      if (!_id) return;
      try {
        const { favorites, appliedJobs } = await getUserJobInteractions();
        setFavorites(new Set(favorites));
        setAppliedJobs(new Set(appliedJobs));
      } catch (error) {
        console.error("Error loading job interactions:", error.message);
      }
    };
    fetchInteractions();
  }, [_id]);

  // --- Filtering + URL sync (debounced) -------------------------------------
  useEffect(() => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      const {
        location = "",
        type = "",
        tagIds = [],
        tagLogic = "and",
        searchText = "",
        role = "",
        hours = "",
      } = filters;

      // Compute effective tag set (enforce default optometrist only if role not set)
      const effectiveTagIds =
        role || tagIds.includes("optometrist")
          ? tagIds
          : Array.from(new Set([...tagIds, "optometrist"]));

      let filtered = jobs.filter((job) => {
        const lowerTitle = (job.title || "").toLowerCase();
        const lowerCompany = (job.company || "").toLowerCase();
        const lowerDescription = (job.description || "").toLowerCase();

        const matchesSearchText =
          !searchText ||
          lowerTitle.includes(searchText.toLowerCase()) ||
          lowerCompany.includes(searchText.toLowerCase()) ||
          lowerDescription.includes(searchText.toLowerCase());

        // ✅ Tag matching on canonical IDs stored at job._tagIds
        const jobIds = Array.isArray(job._tagIds) ? job._tagIds : [];
        const matchesTags =
          !effectiveTagIds.length ||
          (tagLogic === "and"
            ? effectiveTagIds.every((id) => jobIds.includes(id))
            : effectiveTagIds.some((id) => jobIds.includes(id)));

        const matchesLocation =
          !location ||
          ((job.location || "").toLowerCase().includes(location.toLowerCase()) ||
            // optional: city/state fields if present
            (`${job.city || ""}, ${job.state || ""}`)
              .toLowerCase()
              .includes(location.toLowerCase()));

        const matchesType = !type || (job.type && job.type.toLowerCase() === type.toLowerCase());
        const matchesRole = !role || (job.role && job.role.toLowerCase() === role.toLowerCase());
        const matchesHours =
          !hours || (job.hours && job.hours.toLowerCase() === hours.toLowerCase());

        return (
          matchesSearchText &&
          matchesTags &&
          matchesLocation &&
          matchesType &&
          matchesRole &&
          matchesHours
        );
      });

      if (sort === "newest") {
        filtered = filtered.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      } else if (sort === "salary-high") {
        filtered = filtered.sort((a, b) => (b.salary || 0) - (a.salary || 0));
      } else if (sort === "salary-low") {
        filtered = filtered.sort((a, b) => (a.salary || 0) - (b.salary || 0));
      }

      setFilteredJobs(filtered);

      // ✅ URL sync with canonical tags
      setSearchParams({
        ...filters,
        tagIds: (filters.tagIds || []).join(","),
        // keep legacy param empty to avoid confusion
        searchTags: "",
        tagLogic,
        sort,
        page: "1",
      });
    }, 300);
  }, [filters, jobs, sort, setSearchParams]);

  // --- Pagination ------------------------------------------------------------
  const paginatedJobs = useMemo(
    () => filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [filteredJobs, page]
  );
  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE);

  // --- Actions ---------------------------------------------------------------
  const handleFavorite = async (jobId) => {
    if (!_id) return;
    try {
      await addJobToFavorites(jobId);
      setFavorites((prev) => {
        const updated = new Set(prev);
        updated.has(jobId) ? updated.delete(jobId) : updated.add(jobId);
        return updated;
      });
    } catch (error) {
      console.error("Error updating favorites:", error.message);
    }
  };

  const handleApply = async (jobId) => {
    if (!_id || appliedJobs.has(jobId)) return;
    try {
      await applyToJob(jobId);
      setAppliedJobs((prev) => new Set(prev).add(jobId));
    } catch (error) {
      console.error("Error applying to job:", error.message);
    }
  };

  // --- Render ----------------------------------------------------------------
  return (
    <div className="job-list">
      <h2>Available Jobs</h2>

      <JobFilter
        filters={filters}
        onFilterChange={setFilters}
        onClear={() =>
          setFilters({
            showFilters: false,
            tagIds: [],
            tagLogic: "and",
            searchText: "",
            role: "",
            hours: "",
            location: "",
            type: "",
          })
        }
      />

      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <button onClick={() => setShowMap((prev) => !prev)}>
          {showMap ? "Hide Map" : "Show Map"}
        </button>
      </div>

      <JobMap
        jobs={filteredJobs}
        showMap={showMap}
        apiKey={GOOGLE_MAPS_API_KEY}
        onMarkerClick={(job) => {
          setSelectedJob(job);
          setIsModalOpen(true);
        }}
      />

      <div className="job-cards">
        {paginatedJobs.map((job) => (
          <JobCard
            key={job._id}
            job={job}
            isFavorite={favorites.has(job._id)}
            isApplied={appliedJobs.has(job._id)}
            onFavoriteClick={handleFavorite}
            onClick={() => {
              setSelectedJob(job);
              setIsModalOpen(true);
            }}
          />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(newPage) => {
          setSearchParams({
            ...filters,
            tagIds: (filters.tagIds || []).join(","),
            searchTags: "",
            tagLogic: filters.tagLogic,
            sort,
            page: newPage.toString(),
          });
        }}
      />

      <JobModal
        job={selectedJob}
        isFavorite={selectedJob && favorites.has(selectedJob._id)}
        isApplied={selectedJob && appliedJobs.has(selectedJob._id)}
        onFavoriteClick={handleFavorite}
        onClose={() => {
          setSelectedJob(null);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
};

export default JobList;
