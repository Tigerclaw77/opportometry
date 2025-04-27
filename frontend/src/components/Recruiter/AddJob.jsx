import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import {
  Container,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  TextField,
  MenuItem,
} from "@mui/material";

import GlassTextField from "../ui/GlassTextField";
import "../../styles/Forms.css";

import { createJob } from "../../utils/api";
import useDebounce from "../../hooks/useDebounce"; // ✅ Custom debounce hook (create this if not done yet)

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const schema = yup.object().shape({
  jobTitle: yup.string().required("Job title is required"),
  description: yup.string().required("Job description is required"),
  salary: yup
    .string()
    .matches(/^[0-9,.\-\sA-Za-z]+$/, "Invalid salary format")
    .required("Salary is required"),
  jobStatus: yup.array().min(1, "Select at least one job status"),
  jobType: yup.array().min(1, "Select at least one job type"),
  location: yup.string().required("Location is required unless remote"),
  templateName: yup.string(),
});

const AddJob = () => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      jobTitle: "",
      description: "",
      salary: "",
      jobStatus: [],
      jobType: [],
      remote: false,
      inOffice: false,
      location: "",
      state: "",
      latitude: "",
      longitude: "",
      saveTemplate: false,
      templateName: "",
    },
  });

  const [saveTemplate, setSaveTemplate] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  const debouncedSearch = useDebounce(async (input) => {
    if (!input) return setSuggestions([]);

    setLoadingSuggestions(true);
    try {
      const response = await fetch(
        `https://places.googleapis.com/v1/places:autocomplete?input=${encodeURIComponent(input)}&key=${GOOGLE_MAPS_API_KEY}&languageCode=en`
      );
      const data = await response.json();
      const predictions = data?.suggestions || [];

      setSuggestions(predictions);
    } catch (error) {
      console.error("Error fetching places:", error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  }, 500); // Debounce delay in ms

  const handleLocationInputChange = (e) => {
    const inputValue = e.target.value;
    setValue("location", inputValue);
    debouncedSearch(inputValue);
  };

  const handleSuggestionSelect = async (suggestion) => {
    try {
      const placeId = suggestion.placePrediction.placeId;

      const detailsResponse = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}?fields=formattedAddress,location,regionCode&key=${GOOGLE_MAPS_API_KEY}`
      );
      const details = await detailsResponse.json();

      const formattedAddress = details.formattedAddress || "";
      const lat = details.location?.latitude || "";
      const lng = details.location?.longitude || "";
      const state = details.regionCode || "";

      setValue("location", formattedAddress);
      setValue("latitude", lat);
      setValue("longitude", lng);
      setValue("state", state);

      setSuggestions([]);
      console.log("📍 Location selected:", { formattedAddress, lat, lng, state });
    } catch (error) {
      console.error("Error getting place details:", error);
    }
  };

  const onSubmit = async (data) => {
    console.log("✅ Submitting Job Data:", data);

    try {
      const result = await createJob({
        ...data,
        saveTemplate,
      });

      console.log("✅ Job created:", result);
      alert("Job posted successfully!");
    } catch (error) {
      console.error("❌ Error creating job:", error.message);
      alert(error.message);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={5} className="glass-form">
        <Typography variant="h4" align="center" gutterBottom>
          Post a Job
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-container">

            {/* ✅ Job Title */}
            <GlassTextField
              label="Job Title"
              {...register("jobTitle")}
              error={!!errors.jobTitle}
              helperText={errors.jobTitle?.message}
              className="glass-input half-width single-line"
              fullWidth
            />

            {/* ✅ Salary */}
            <GlassTextField
              label="Salary"
              {...register("salary")}
              error={!!errors.salary}
              helperText={errors.salary?.message}
              className="glass-input half-width single-line"
              fullWidth
            />

            {/* ✅ Location Autocomplete (Debounced) */}
            <Box className="glass-input half-width single-line" sx={{ position: "relative" }}>
              <TextField
                label="Location"
                placeholder="City, State or ZIP code"
                value={watch("location")}
                onChange={handleLocationInputChange}
                error={!!errors.location}
                helperText={errors.location?.message}
                fullWidth
              />

              {loadingSuggestions && <Typography variant="body2">Loading...</Typography>}

              {suggestions.length > 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    zIndex: 10,
                    backgroundColor: "white",
                    width: "100%",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    mt: 1,
                  }}
                >
                  {suggestions.map((suggestion, idx) => (
                    <MenuItem
                      key={idx}
                      onClick={() => handleSuggestionSelect(suggestion)}
                    >
                      {suggestion.placePrediction?.text?.structuredFormat?.mainText?.text}
                    </MenuItem>
                  ))}
                </Box>
              )}
            </Box>

            {/* ✅ Hidden Fields for Lat/Lng/State */}
            <input type="hidden" {...register("latitude")} />
            <input type="hidden" {...register("longitude")} />
            <input type="hidden" {...register("state")} />

            {/* ✅ Job Description */}
            <GlassTextField
              label="Job Description"
              multiline
              rows={4}
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              className="glass-input textarea"
              fullWidth
            />

            {/* ✅ Job Position Checkboxes */}
            <Box className="checkbox-group">
              <Typography variant="h6">Job Position</Typography>
              {[
                "Optometrist",
                "Ophthalmologist",
                "Optician",
                "Office Manager",
                "Optometric Tech",
                "Ophthalmic Tech",
                "Surgical Tech",
                "Scribe",
                "Front Desk/Reception",
                "Insurance/Billing",
              ].map((role) => (
                <FormControlLabel
                  key={role}
                  control={<Checkbox {...register("jobRoles")} value={role} />}
                  label={role}
                />
              ))}
            </Box>

            {/* ✅ Job Status Checkboxes */}
            <Box className="checkbox-group">
              <Typography variant="h6">Job Status</Typography>
              {["Full-time", "Part-time", "Per Diem / Contract"].map((status) => (
                <FormControlLabel
                  key={status}
                  control={<Checkbox {...register("jobStatus")} value={status} />}
                  label={status}
                />
              ))}
            </Box>

            {/* ✅ Job Type Checkboxes */}
            <Box className="checkbox-group">
              <Typography variant="h6">Job Type</Typography>
              {["Leaseholder", "Associate", "Partner", "Employee"].map((type) => (
                <FormControlLabel
                  key={type}
                  control={<Checkbox {...register("jobType")} value={type} />}
                  label={type}
                />
              ))}
            </Box>

            {/* ✅ Submit and Template Save */}
            <Box className="submit-save-container">
              <Button
                type="submit"
                variant="contained"
                className="glass-button submit-job-button"
              >
                Submit Job
              </Button>

              <Box className="template-save">
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={saveTemplate}
                      onChange={(e) => setSaveTemplate(e.target.checked)}
                    />
                  }
                  label="Save as Template"
                />

                {saveTemplate && (
                  <GlassTextField
                    label="Template Name"
                    {...register("templateName")}
                    className="template-name-input"
                    fullWidth
                  />
                )}
              </Box>
            </Box>

          </div>
        </form>
      </Paper>
    </Container>
  );
};

export default AddJob;
