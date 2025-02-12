import React from "react";
import { Box, Typography } from "@mui/material";
import { useDropzone } from "react-dropzone";

const FileUpload = ({ file, setFile }) => {
  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed grey",
        padding: 2,
        textAlign: "center",
        cursor: "pointer",
        mb: 2,
      }}
    >
      <input {...getInputProps()} />
      {file ? (
        <Typography>{file.name}</Typography>
      ) : (
        <Typography>
          Drag & drop a file here, or click to select one
        </Typography>
      )}
    </Box>
  );
};

export default FileUpload;
