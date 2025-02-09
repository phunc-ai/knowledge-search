import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  Box,
  Typography,
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000";

import Header from "../../components/Header";

const categories = [
  "Large Language Model",
  "Computer Vision",
  "Machine Learning",
];
const subcategories = {
  "Large Language Model": ["GPT-3", "BERT", "T5", "Llama"],
  "Computer Vision": [
    "Image Classification",
    "Object Detection",
    "Segmentation",
  ],
  "Machine Learning": [
    "Supervised Learning",
    "Unsupervised Learning",
    "Reinforcement Learning",
  ],
};

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const [parsedContent, setParsedContent] = useState("");

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("tags", tags.join(","));

    try {
      const response = await axios.post("/api/upload", formData);
      setParsedContent(response.data.data);  // Display parsed content
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Header
        title="Upload Files"
        subtitle="Upload Files into Knowledge Base"
      />
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Box sx={{ display: "flex", gap: 2, mt: 2, mb: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            margin="normal"
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Subcategory</InputLabel>
          <Select
            label="Subcategory"
            value={subcategory}
            onChange={(e) => setSubcategory(e.target.value)}
            margin="normal"
            disabled={!category}
          >
            {category &&
              subcategories[category].map((sub) => (
                <MenuItem key={sub} value={sub}>
                  {sub}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </Box>
      <TextField
        label="Tags"
        value={tags.join(", ")}
        onChange={(e) =>
          setTags(e.target.value.split(",").map((tag) => tag.trim()))
        }
        fullWidth
        margin="normal"
        helperText="Enter tags separated by commas"
      />
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
      <Button variant="contained" color="primary" onClick={handleUpload}>
        Upload
      </Button>
      {parsedContent && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h5">Parsed Content</Typography>
          <Typography>{parsedContent}</Typography>
        </Box>
      )}
    </Box>
  );
};

export default UploadPage;
