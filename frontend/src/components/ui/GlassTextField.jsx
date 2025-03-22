import React from "react";
import TextField from "@mui/material/TextField";

// ✅ Forward the ref to inputRef
const GlassTextField = React.forwardRef(({ className = "", ...props }, ref) => {
  return (
    <TextField
      variant="outlined"
      fullWidth
      inputRef={ref} // ✅ Crucial: this connects react-hook-form to the TextField
      className={`glass-input single-line ${className}`}
      {...props}
    />
  );
});

export default GlassTextField;
