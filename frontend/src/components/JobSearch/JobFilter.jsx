import React, { useMemo, useState, useEffect } from "react";
import { Navigation } from "lucide-react";
import TagInput from "./TagInput";
import "../../styles/JobFilter.css";

// ✅ canonical tags + normalization (from constants we set up earlier)
import { JOB_TAGS, resolveJobTag } from "../../constants/jobTags";

const JobFilter = ({ filters, onFilterChange, onClear }) => {
  const [locationInput, setLocationInput] = useState(filters.location || "");
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Build TagInput options from the canonical bank
  const tagOptions = useMemo(
    () => JOB_TAGS.map((t) => ({ id: t.id, label: t.label })),
    []
  );

  // Back-compat: derive canonical tagIds from either filters.tagIds OR legacy filters.searchTags
  const derivedTagIds = useMemo(() => {
    if (Array.isArray(filters.tagIds) && filters.tagIds.length) return filters.tagIds;
    const fromSearch = Array.isArray(filters.searchTags) ? filters.searchTags : [];
    const ids = [];
    for (const raw of fromSearch) {
      const id = resolveJobTag(raw);
      if (id && !ids.includes(id)) ids.push(id);
    }
    return ids;
  }, [filters.tagIds, filters.searchTags]);

  // Keep a single source of truth in parent: tagIds
  useEffect(() => {
    if (!Array.isArray(filters.tagIds) || filters.tagIds.join("|") !== derivedTagIds.join("|")) {
      onFilterChange({ ...filters, tagIds: derivedTagIds });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [derivedTagIds]);

  const handleTagIdsChange = (nextIds) => {
    onFilterChange({ ...filters, tagIds: Array.from(new Set(nextIds)) });
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported.");
      return;
    }
    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
          );
          const data = await res.json();
          const components = data.results[0]?.address_components || [];

          const city = components.find((c) => c.types.includes("locality"))?.long_name || "";
          const state =
            components.find((c) => c.types.includes("administrative_area_level_1"))?.short_name ||
            "";
          const location = [city, state].filter(Boolean).join(", ");

          setLocationInput(location);
          onFilterChange({ ...filters, location });
        } catch (error) {
          console.error("Location error:", error);
          alert("Failed to fetch location.");
        } finally {
          setLoadingLocation(false);
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Failed to retrieve location.");
        setLoadingLocation(false);
      }
    );
  };

  return (
    <div className="job-filter">
      {/* ✅ Canonical, bank-only TagInput (props are safe even if your TagInput ignores them) */}
      <TagInput
        // If you installed the upgraded TagInput: it expects value/onChange/options
        value={derivedTagIds}
        onChange={handleTagIdsChange}
        options={tagOptions}
        maxSelected={12}
        placeholder="Search approved tags…"
      />

      <div style={{ width: "100%", textAlign: "center", fontSize: "0.85rem", color: "#ccc" }}>
        Filter by tags like “Retina”, “Weekends”, or “Spanish”
      </div>

      <div className="location-input-wrapper">
        <input
          type="text"
          placeholder="City, State"
          value={locationInput}
          onChange={(e) => {
            setLocationInput(e.target.value);
            onFilterChange({ ...filters, location: e.target.value });
          }}
        />
        <button
          className="location-icon-button"
          onClick={handleUseMyLocation}
          disabled={loadingLocation}
          title="Use my location"
        >
          <Navigation size={16} />
        </button>
      </div>

      <select
        value={filters.role || ""}
        onChange={(e) => onFilterChange({ ...filters, role: e.target.value })}
      >
        <option value="">All Roles</option>
        <option value="optometrist">Optometrist</option>
        <option value="technician">Technician</option>
        <option value="assistant">Vision Assistant</option>
        <option value="front desk">Front Desk</option>
        <option value="ophthalmologist">Ophthalmologist</option>
      </select>

      <select
        value={filters.hours || ""}
        onChange={(e) => onFilterChange({ ...filters, hours: e.target.value })}
      >
        <option value="">All Hours</option>
        <option value="full-time">Full-Time</option>
        <option value="part-time">Part-Time</option>
        <option value="prn">PRN</option>
      </select>

      <button className="clear-filters" onClick={onClear}>
        Clear Filters
      </button>
    </div>
  );
};

export default JobFilter;
