import React from "react";
import { Box, Typography, IconButton, Button, CircularProgress } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";

const ParsedContent = ({
  parsedContent,
  currentPage,
  handlePreviousPage,
  handleNextPage,
  handleUpload,
  loading,
}) => {
  return (
    <Box sx={{ mt: 3, textAlign: "center" }}>
      <Typography variant="h2">Parsed Content</Typography>
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mb: 2 }}>
        <IconButton onClick={handlePreviousPage} disabled={currentPage === 0}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ mx: 2 }}>
          Page {parsedContent[currentPage].page}
        </Typography>
        <IconButton onClick={handleNextPage} disabled={currentPage === parsedContent.length - 1}>
          <ArrowForward />
        </IconButton>
      </Box>
      <Box sx={{ 
        border: "1px solid #ccc", 
        borderRadius: "8px", 
        padding: "16px", 
        backgroundColor: "#f9f9f9", 
        textAlign: "left",
        maxWidth: "800px",
        margin: "0 auto"
      }}>
        <Typography>
          {parsedContent[currentPage].text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              <br />
            </React.Fragment>
          ))}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Upload Document"}
        </Button>
      </Box>
    </Box>
  );
};

export default ParsedContent;
