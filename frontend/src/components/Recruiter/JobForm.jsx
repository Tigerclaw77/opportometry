import React, { useMemo } from "react";
import {
  Typography,
  FormControlLabel,
  Checkbox,
  Box,
  MenuItem,
} from "@mui/material";
import GlassTextField from "../ui/GlassTextField";

// ✅ Uses the canonical tag system
import {
  JOB_TAG_CATEGORIES,
  displayTagsForOrg, // returns flat [{id,label,category}]
} from "../../constants/jobTags";

/**
 * Props expected (same as before) + optional orgId
 * - register, errors, watch, setValue: from react-hook-form
 * - suggestions, loadingSuggestions, handleLocationInputChange, handleSuggestionSelect
 * - orgId: string (optional). If not provided, we infer from chainAffiliation for convenience.
 */
const JobForm = ({
  register,
  errors,
  watch,
  setValue,
  suggestions,
  loadingSuggestions,
  handleLocationInputChange,
  handleSuggestionSelect,
  orgId: orgIdProp,
}) => {
  // Infer orgId from chainAffiliation if orgId wasn't passed explicitly.
  const chainAffiliation = watch("chainAffiliation") || "";
  const orgId =
    orgIdProp || (chainAffiliation ? `${chainAffiliation}_org` : undefined);

  // Build allowed canonical tags for this org, then group by category for display.
  const groupedAllowedTags = useMemo(() => {
    const allowed = displayTagsForOrg(orgId); // flat [{id,label,category}]
    // Group them under your original category order & labels
    const byCat = allowed.reduce((acc, t) => {
      acc[t.category] = acc[t.category] || [];
      acc[t.category].push(t);
      return acc;
    }, {});
    // Preserve your category order from JOB_TAG_CATEGORIES
    return JOB_TAG_CATEGORIES.map((cat) => ({
      categoryLabel: cat.label,
      items: (byCat[cat.label] || [])
        // Optional: only show items that exist in your original bank for that category
        .sort((a, b) => a.label.localeCompare(b.label)),
    }));
  }, [orgId]);

  return (
    <>
      <GlassTextField
        label="Job Title"
        {...register("jobTitle")}
        error={!!errors.jobTitle}
        helperText={errors.jobTitle?.message}
        fullWidth
      />

      <GlassTextField
        label="Salary"
        {...register("salary")}
        error={!!errors.salary}
        helperText={errors.salary?.message}
        fullWidth
      />

      {/* Location field with suggestions */}
      <Box sx={{ position: "relative", mb: 2 }}>
        <GlassTextField
          label="Location"
          value={watch("location")}
          onChange={handleLocationInputChange}
          error={!!errors.location}
          helperText={errors.location?.message}
          fullWidth
        />
        {loadingSuggestions && (
          <Typography variant="body2" sx={{ mt: 1 }}>
            Loading suggestions...
          </Typography>
        )}
        {suggestions?.length > 0 && (
          <Box
            sx={{
              position: "absolute",
              zIndex: 10,
              backgroundColor: "white",
              width: "100%",
              border: "1px solid #ccc",
              borderRadius: "4px",
              mt: 1,
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {suggestions.map((s, idx) => (
              <MenuItem key={idx} onClick={() => handleSuggestionSelect(s)}>
                {s.placePrediction?.text?.structuredFormat?.mainText?.text}
              </MenuItem>
            ))}
          </Box>
        )}
      </Box>

      {/* Hidden location fields */}
      <input type="hidden" {...register("latitude")} />
      <input type="hidden" {...register("longitude")} />
      <input type="hidden" {...register("state")} />

      <GlassTextField
        label="Job Description"
        multiline
        rows={4}
        {...register("description")}
        error={!!errors.description}
        helperText={errors.description?.message}
        fullWidth
      />

      <Box>
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

      <Box>
        <Typography variant="h6">Job Status</Typography>
        {["Full-time", "Part-time", "Per Diem / Contract"].map((status) => (
          <FormControlLabel
            key={status}
            control={<Checkbox {...register("jobStatus")} value={status} />}
            label={status}
          />
        ))}
      </Box>

      <Box>
        <Typography variant="h6">Job Type</Typography>
        {["Leaseholder", "Associate", "Partner", "Employee"].map((type) => (
          <FormControlLabel
            key={type}
            control={<Checkbox {...register("jobType")} value={type} />}
            label={type}
          />
        ))}
      </Box>

      <GlassTextField
        select
        label="Practice Setting"
        {...register("setting")}
        defaultValue=""
        fullWidth
      >
        {["private", "retail", "hospital", "mobile", "academic"].map((o) => (
          <MenuItem key={o} value={o}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </MenuItem>
        ))}
      </GlassTextField>

      <GlassTextField
        select
        label="Chain Affiliation"
        {...register("chainAffiliation")}
        defaultValue=""
        fullWidth
      >
        {["luxottica", "walmart", "visionworks", "other", "none"].map((o) => (
          <MenuItem key={o} value={o}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </MenuItem>
        ))}
      </GlassTextField>

      <GlassTextField
        select
        label="Ownership Track"
        {...register("ownershipTrack")}
        defaultValue=""
        fullWidth
      >
        {["none", "potential", "required"].map((o) => (
          <MenuItem key={o} value={o}>
            {o.charAt(0).toUpperCase() + o.slice(1)}
          </MenuItem>
        ))}
      </GlassTextField>

      {/* ✅ Canonical tags (IDs), grouped by category, filtered per org */}
      <Box sx={{ mt: 2 }}>
        <Typography variant="h6">Tags</Typography>

        {/* Store canonical IDs in form as "tagIds" */}
        <input type="hidden" {...register("tagIds")} />

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {groupedAllowedTags.map(({ categoryLabel, items }) => (
            <Box key={categoryLabel} sx={{ mb: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {categoryLabel}
              </Typography>
              <Box
                sx={{ display: "flex", flexWrap: "wrap", gap: "8px", ml: 1 }}
              >
                {items.length === 0 ? (
                  <Typography variant="body2" sx={{ opacity: 0.7, ml: 1 }}>
                    No tags available for this category.
                  </Typography>
                ) : (
                  items.map((t) => {
                    const current = Array.isArray(watch("tagIds"))
                      ? watch("tagIds")
                      : [];
                    const checked = current.includes(t.id);
                    return (
                      <FormControlLabel
                        key={t.id}
                        control={
                          <Checkbox
                            value={t.id}
                            onChange={(e) => {
                              const next = e.target.checked
                                ? [...current, t.id]
                                : current.filter((x) => x !== t.id);
                              // dedupe in case of double adds
                              setValue("tagIds", Array.from(new Set(next)), {
                                shouldValidate: true,
                                shouldDirty: true,
                              });
                            }}
                            checked={checked}
                          />
                        }
                        label={t.label}
                      />
                    );
                  })
                )}
              </Box>
            </Box>
          ))}
        </div>
      </Box>
    </>
  );
};

export default JobForm;
