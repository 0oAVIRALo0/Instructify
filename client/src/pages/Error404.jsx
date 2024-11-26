import React from "react";
import { useNavigate } from "react-router-dom";

import { Box, Button, Container, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Error404() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/explore");
  };

  return (
    <Box
      component="main"
      className="flex items-center justify-center min-h-screen h-full"
      style={{ height: "100vh" }}
    >
      <Container maxWidth="md">
        <Box className="text-center">
          <Box className="mb-3 text-center">
            <img
              alt="Under development"
              src="/images/error-404.png"
              className="mx-auto mb-6 max-w-full"
              style={{ width: "400px" }}
            />
          </Box>

          <Typography align="center" sx={{ mb: 3 }} variant="h3">
            404: The page you are looking for isn’t here
          </Typography>

          <Typography align="center" color="text.secondary" variant="body1">
            You either tried some shady route or you came here by mistake.
            Whichever it is, try using the navigation
          </Typography>

          <Button
            onClick={handleNavigate}
            startIcon={<ArrowBackIcon />}
            sx={{ mt: 3 }}
            variant="contained"
          >
            Go back to dashboard
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default Error404;
