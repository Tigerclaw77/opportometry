import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Star, Eye, CheckCircle } from "lucide-react";
import {
  fetchJobs,
  addJobToFavorites,
  toggleWatchlistJob,
  applyToJob,
} from "../utils/api";
import "../styles/JobCard.css";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [favorites, setFavorites] = useState(new Set());
  const [watchList, setWatchList] = useState(new Set());
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerCluster = useRef(null);
  const cardRefs = useRef({});

  const { _id, userRole } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error.message);
      }
    };

    loadJobs();
  }, []);

  useEffect(() => {
    if (!jobs.length) return;

    const existingScript = document.getElementById("googleMaps");

    const initMap = () => {
      if (!mapRef.current) return;

      mapInstance.current = new window.google.maps.Map(mapRef.current, {
        center: { lat: 30.1659, lng: -95.4613 },
        zoom: 9,
        mapTypeControl: false,
        streetViewControl: false,
      });

      addMarkers();
    };

    const addMarkers = () => {
      if (!mapInstance.current || !jobs.length) return;

      const bounds = new window.google.maps.LatLngBounds();
      const markers = [];

      jobs.forEach((job) => {
        if (job.latitude && job.longitude) {
          const position = { lat: job.latitude, lng: job.longitude };
          bounds.extend(position);

          const marker = new window.google.maps.Marker({
            position,
            map: mapInstance.current,
            title: job.title,
          });

          marker.addListener("click", () => {
            setSelectedJob(job);
            setIsModalOpen(true);
          });

          markers.push(marker);
        }
      });

      if (markers.length > 0) {
        mapInstance.current.fitBounds(bounds);
      }

      if (window.MarkerClusterer && markers.length > 0) {
        markerCluster.current = new window.MarkerClusterer(mapInstance.current, markers, {
          imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
        });
      }
    };

    if (!existingScript) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.id = "googleMaps";
      script.async = true;
      script.defer = true;
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }
  }, [jobs]);

  const handleFavorite = async (jobId) => {
    if (!_id) return;
    try {
      await addJobToFavorites(jobId);
      setFavorites((prev) =>
        new Set(prev.has(jobId) ? [...prev].filter((id) => id !== jobId) : [...prev, jobId])
      );
    } catch (error) {
      console.error("Error updating favorites:", error.message);
    }
  };

  const handleWatchlist = async (jobId) => {
    if (!_id) return;
    try {
      await toggleWatchlistJob(jobId);
      setWatchList((prev) =>
        new Set(prev.has(jobId) ? [...prev].filter((id) => id !== jobId) : [...prev, jobId])
      );
    } catch (error) {
      console.error("Error updating watchlist:", error.message);
    }
  };

  const handleApply = async (jobId) => {
    if (!_id) return;
    if (appliedJobs.has(jobId)) return;
    try {
      await applyToJob(jobId);
      setAppliedJobs((prev) => new Set(prev).add(jobId));
    } catch (error) {
      console.error("Error applying to job:", error.message);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <div className="job-list">
      <h2>Available Jobs</h2>

      <div
        ref={mapRef}
        style={{
          width: "100%",
          height: "300px",
          marginBottom: "20px",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      />

      {jobs.length > 0 ? (
        <div className="job-cards">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="job-card"
              onClick={() => {
                setSelectedJob(job);
                setIsModalOpen(true);
              }}
            >
              <div className="job-icon-container">
                <Star
                  size={18}
                  className={favorites.has(job._id) ? "job-icon favorite active" : "job-icon favorite"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFavorite(job._id);
                  }}
                />
                <Eye
                  size={18}
                  className={watchList.has(job._id) ? "job-icon watchlist active" : "job-icon watchlist"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleWatchlist(job._id);
                  }}
                />
                <CheckCircle
                  size={18}
                  className={appliedJobs.has(job._id) ? "job-icon applied active" : "job-icon applied"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(job._id);
                  }}
                />
              </div>

              <h3>{job.title}</h3>
              <p>{job.company}</p>
              <p>{job.location}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No jobs available</p>
      )}

      {isModalOpen && selectedJob && (
        <div className="modal-overlay active" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedJob.title}</h2>
            <p><strong>Company:</strong> {selectedJob.company}</p>
            <p><strong>Location:</strong> {selectedJob.location}</p>
            <p><strong>Description:</strong> {selectedJob.description}</p>
            {selectedJob.salary && <p><strong>Salary:</strong> ${selectedJob.salary}</p>}

            <div className="modal-icons">
              <Star
                size={18}
                className={favorites.has(selectedJob._id) ? "job-icon favorite active" : "job-icon favorite"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFavorite(selectedJob._id);
                }}
              />
              <Eye
                size={18}
                className={watchList.has(selectedJob._id) ? "job-icon watchlist active" : "job-icon watchlist"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleWatchlist(selectedJob._id);
                }}
              />
              <CheckCircle
                size={18}
                className={appliedJobs.has(selectedJob._id) ? "job-icon applied active" : "job-icon applied"}
                onClick={(e) => {
                  e.stopPropagation();
                  handleApply(selectedJob._id);
                }}
              />
            </div>
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobList;
