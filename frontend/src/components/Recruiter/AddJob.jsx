import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Container,
  Paper,
  Typography,
  Grid2,
  FormControlLabel,
  Checkbox,
  Button,
  Box,
} from "@mui/material";
import GlassTextField from "../ui/GlassTextField";
import "../../styles/Forms.css"; // ✅ Ensure global styles are applied

// ✅ Validation Schema
const schema = yup.object().shape({
  jobTitle: yup.string().required("Job title is required"),
  description: yup.string().required("Job description is required"),
  salary: yup.string().matches(/^[0-9,.\-\sA-Za-z]+$/, "Invalid salary format").required("Salary is required"),
  jobStatus: yup.array().min(1, "Select at least one job status"),
  jobType: yup.array().min(1, "Select at least one job type"),
  location: yup.string().required("Location is required unless remote"),
  templateName: yup.string(),
});

const AddJob = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
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
      saveTemplate: false,
      templateName: "",
    },
  });

  const [saveTemplate, setSaveTemplate] = useState(false);

  const onSubmit = (data) => {
    console.log("Job Data Submitted:", {
      ...data,
      saveTemplate,
    });
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={5} className="glass-form">
        <Typography variant="h4" align="center" gutterBottom>
          Post a Job
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid2 container spacing={3} direction="column"> {/* ✅ Force full-width stacking */}

            {/* Job Title */}
            <Grid2 item xs={12}>
              <GlassTextField 
                label="Job Title" 
                fullWidth 
                {...register("jobTitle")} 
                error={!!errors.jobTitle} 
                helperText={errors.jobTitle?.message} 
                className="glass-input half-width single-line" 
                variant="outlined" 
              />
            </Grid2>

            {/* Salary */}
            <Grid2 item xs={12}>
              <GlassTextField 
                label="Salary" 
                fullWidth 
                {...register("salary")} 
                error={!!errors.salary} 
                helperText={errors.salary?.message} 
                className="glass-input half-width single-line" 
                variant="outlined" 
              />
            </Grid2>

            {/* Location */}
            <Grid2 item xs={12}>
              <GlassTextField 
                label="Location" 
                placeholder="City, State or ZIP code"
                fullWidth 
                {...register("location")} 
                error={!!errors.location} 
                helperText={errors.location?.message} 
                className="glass-input half-width single-line" 
                variant="outlined" 
              />
            </Grid2>

            {/* ✅ Job Description (Directly Below Location, Full Width) */}
            <Grid2 item xs={12}>
              <GlassTextField 
                label="Job Description" 
                multiline 
                rows={4} 
                fullWidth 
                {...register("description")} 
                error={!!errors.description} 
                helperText={errors.description?.message} 
                className="glass-input textarea" 
                variant="outlined" 
              />
            </Grid2>

            {/* ✅ Job Position Checkboxes (New Section) */}
            <Grid2 item xs={12}>
              <Typography variant="h6">Job Position</Typography>
              <Box className="checkbox-group">
                {[
                  "Optometrist", "Ophthalmologist", "Optician",
                  "Office Manager", "Optometric Tech", "Ophthalmic Tech", "Surgical Tech", "Scribe",
                  "Front Desk/Reception", "Insurance/Billing"
                ].map((role) => (
                  <FormControlLabel 
                    key={role} 
                    control={<Checkbox {...register("jobRoles")} value={role} />} 
                    label={role} 
                  />
                ))}
              </Box>
            </Grid2>

            {/* ✅ Job Status Checkboxes */}
            <Grid2 item xs={12}>
              <Typography variant="h6">Job Status</Typography>
              <Box className="checkbox-group">
                {["Full-time", "Part-time", "Per Diem / Contract"].map((status) => (
                  <FormControlLabel 
                    key={status} 
                    control={<Checkbox {...register("jobStatus")} value={status} />} 
                    label={status} 
                  />
                ))}
              </Box>
            </Grid2>

            {/* ✅ Job Type Checkboxes */}
            <Grid2 item xs={12}>
              <Typography variant="h6">Job Type</Typography>
              <Box className="checkbox-group">
                {["Leaseholder", "Associate", "Partner", "Employee"].map((type) => (
                  <FormControlLabel 
                    key={type} 
                    control={<Checkbox {...register("jobType")} value={type} />} 
                    label={type} 
                  />
                ))}
              </Box>
            </Grid2>

            {/* ✅ Submit Button & Save Template */}
            {/* <Grid2 item xs={12} className="form-actions">
              <Button type="submit" variant="contained" className="glass-button">
                Submit Job
              </Button>

              <Box className="template-save">
                <FormControlLabel 
                  control={<Checkbox checked={saveTemplate} onChange={(e) => setSaveTemplate(e.target.checked)} />} 
                  label="Save as Template" 
                />
                {saveTemplate && (
                  <GlassTextField 
                    label="Template Name" 
                    fullWidth 
                    {...register("templateName")} 
                    variant="outlined" 
                  />
                )}
              </Box>
            </Grid2> */}

<Grid2 item xs={12} className="form-actions">
  <Box className="submit-save-container">
    <Button type="submit" variant="contained" className="glass-button submit-job-button">
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
          variant="outlined"
          className="template-name-input"
        />
      )}
    </Box>
  </Box>
</Grid2>


          </Grid2>
        </form>
      </Paper>
    </Container>
  );
};

export default AddJob;
