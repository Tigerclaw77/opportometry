// REFACTORED JobList.jsx using modular components: JobCard, JobModal, JobMap, Pagination

import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";

// ✅ Candidate-facing jobs now use Supabase
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

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const PAGE_SIZE = 10;

const JobList = () => {
  const { _id } = useSelector((state) => state.auth);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [filters, setFilters] = useState({
    showFilters: false,
    searchTags: [],
    tagLogic: "and",
    searchText: "",
    role: "",
    hours: "",
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

  // ✅ Ensure default filter for "optometrist"
  useEffect(() => {
    const hasCustomFilters =
      filters.searchTags.length > 0 ||
      filters.location ||
      filters.type ||
      filters.searchText ||
      filters.role ||
      filters.hours;

    const alreadyStored = localStorage.getItem("defaultRoleFilter");

    if (!hasCustomFilters && !alreadyStored) {
      const defaultTag = "optometrist";
      localStorage.setItem("defaultRoleFilter", defaultTag);
      setFilters((prev) => ({
        ...prev,
        searchTags: [...(prev.searchTags || []), defaultTag],
      }));
    }
  }, [filters]);

  // ✅ Parse filters from URL params
  useEffect(() => {
    const initial = Object.fromEntries([...searchParams.entries()]);
    delete initial.page;
    delete initial.sort;
    setFilters({
      showFilters: false,
      ...initial,
      searchTags: initial.searchTags ? initial.searchTags.split(",") : [],
      tagLogic: initial.tagLogic || "and",
      searchText: initial.searchText || "",
      role: initial.role || "",
      hours: initial.hours || "",
    });
    setSort(searchParams.get("sort") || "newest");
  }, [searchParams]);

  // ✅ Load jobs from Supabase
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const { results } = await fetchJobs();
        setJobs(results);
        setFilteredJobs(results);
      } catch (error) {
        console.error("Error fetching jobs:", error.message);
      }
    };
    loadJobs();
  }, []);

  // ✅ Load interactions (favorites + applied)
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

  // ✅ Apply filters (debounced)
  useEffect(() => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      const {
        location = "",
        type = "",
        searchTags = [],
        tagLogic = "and",
        searchText = "",
        role = "",
        hours = "",
      } = filters;

      let filtered = jobs.filter((job) => {
        const lowerTitle = job.title.toLowerCase();
        const lowerCompany = job.company?.toLowerCase() || "";
        const lowerDescription = job.description?.toLowerCase() || "";

        const matchesSearchText =
          !searchText ||
          lowerTitle.includes(searchText.toLowerCase()) ||
          lowerCompany.includes(searchText.toLowerCase()) ||
          lowerDescription.includes(searchText.toLowerCase());

        const matchesTags =
          !searchTags.length ||
          (tagLogic === "and"
            ? searchTags.every(
                (tag) =>
                  lowerTitle.includes(tag.toLowerCase()) ||
                  lowerCompany.includes(tag.toLowerCase())
              )
            : searchTags.some(
                (tag) =>
                  lowerTitle.includes(tag.toLowerCase()) ||
                  lowerCompany.includes(tag.toLowerCase())
              ));

        const matchesLocation = !location || job.location?.toLowerCase().includes(location.toLowerCase());
        const matchesType = !type || (job.type && job.type.toLowerCase() === type.toLowerCase());
        const matchesRole = !role || (job.role && job.role.toLowerCase() === role.toLowerCase());
        const matchesHours = !hours || (job.hours && job.hours.toLowerCase() === hours.toLowerCase());

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
        filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else if (sort === "salary-high") {
        filtered = filtered.sort((a, b) => (b.salary || 0) - (a.salary || 0));
      } else if (sort === "salary-low") {
        filtered = filtered.sort((a, b) => (a.salary || 0) - (b.salary || 0));
      }

      setFilteredJobs(filtered);
      setSearchParams({
        ...filters,
        searchTags: searchTags.join(","),
        tagLogic,
        sort,
        page: "1",
      });
    }, 400);
  }, [filters, jobs, sort, setSearchParams]);

  const paginatedJobs = filteredJobs.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE);

  // ✅ Handle interactions
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

  return (
    <div className="job-list">
      <h2>Available Jobs</h2>

      <JobFilter
        filters={filters}
        onFilterChange={setFilters}
        onClear={() =>
          setFilters({
            showFilters: false,
            searchTags: [],
            tagLogic: "and",
            searchText: "",
            role: "",
            hours: "",
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
            searchTags: filters.searchTags.join(","),
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
