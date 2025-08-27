import React, { useState, useEffect } from "react";
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
} from "@mui/material";

import GlassTextField from "../ui/GlassTextField";
import "../../styles/forms.css";

import { createJob, updateJob } from "../../utils/api";
import useDebounce from "../../hooks/useDebounce";
import JobForm from "./JobForm";

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
  tags: yup.array().of(yup.string()).max(10),
});

const AddJob = ({ jobToEdit }) => {
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
      setting: "",
      chainAffiliation: "",
      ownershipTrack: "",
      jobRoles: [],
      tagIds: [],
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
        `https://places.googleapis.com/v1/places:autocomplete?input=${encodeURIComponent(
          input
        )}&key=${GOOGLE_MAPS_API_KEY}&languageCode=en`
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
  }, 500);

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
      setValue("location", details.formattedAddress || "");
      setValue("latitude", details.location?.latitude || "");
      setValue("longitude", details.location?.longitude || "");
      setValue("state", details.regionCode || "");
      setSuggestions([]);
    } catch (error) {
      console.error("Error getting place details:", error);
    }
  };

  const onSubmit = async (data) => {
    try {
      const result = jobToEdit
        ? await updateJob(jobToEdit._id, { ...data, saveTemplate })
        : await createJob({ ...data, saveTemplate });

      alert(jobToEdit ? "Job updated successfully!" : "Job posted successfully!");
      console.log("✅ Job result:", result);
    } catch (error) {
      console.error("❌ Error submitting job:", error.message);
      alert(error.message);
    }
  };

  useEffect(() => {
    if (jobToEdit) {
      const keys = Object.keys(jobToEdit);
      keys.forEach((key) => {
        if (jobToEdit[key] !== undefined) {
          setValue(key, jobToEdit[key]);
        }
      });
    }
  }, [jobToEdit, setValue]);

  return (
    <Container maxWidth="md">
      <Paper elevation={5} className="glass-form">
        <Typography variant="h4" align="center" gutterBottom>
          {jobToEdit ? "Edit Job" : "Post a Job"}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-container">
            <JobForm
              register={register}
              errors={errors}
              watch={watch}
              setValue={setValue}
              suggestions={suggestions}
              loadingSuggestions={loadingSuggestions}
              handleLocationInputChange={handleLocationInputChange}
              handleSuggestionSelect={handleSuggestionSelect}
            />

            <Box sx={{ marginTop: "20px" }}>
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
                  fullWidth
                />
              )}
            </Box>

            <Button
              type="submit"
              variant="contained"
              className="glass-button"
              sx={{ marginTop: 2 }}
            >
              {jobToEdit ? "Update Job" : "Submit Job"}
            </Button>
          </div>
        </form>
      </Paper>
    </Container>
  );
};

export default AddJob;
