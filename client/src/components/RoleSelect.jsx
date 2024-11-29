import React from "react";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const RoleSelect = ({ roleType, setRoleType }) => {
  const handleChange = (event) => {
    setRoleType(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="user-type-select">User Type</InputLabel>
        <Select
          id="user-type-select"
          label="user-type-select"
          value={roleType}
          onChange={handleChange}
        >
          <MenuItem value="student">Student</MenuItem>
          <MenuItem value="instructor">Faculty</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default RoleSelect;
