import React, { useState, useEffect } from "react";
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
  CircularProgress,
  IconButton,
} from "@mui/material";
import axios from "axios";
import Header from "../../components/Header";
import FileUpload from "./FileUpload";
import ParsedContent from "./ParsedContent";

axios.defaults.baseURL = "http://localhost:5000";

const UploadPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [tags, setTags] = useState([]);
  const [file, setFile] = useState(null);
  const [parsedContent, setParsedContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState({});

  useEffect(() => {
    const fetchCategoriesSubcategories = async () => {
      try {
        const response = await axios.get(
          "/api/metadata/get"
        );
        setCategories(Object.keys(response.data));
        setSubcategories(response.data);
      } catch (error) {
        console.error("Error fetching categories and subcategories:", error);
      }
    };

    fetchCategoriesSubcategories();
  }, []);

  const handleParse = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/api/parse", formData);
      console.log("Upload response:", response.data);
      setParsedContent(
        Array.isArray(response.data.parsed_content)
          ? response.data.parsed_content
          : []
      ); // Ensure parsedContent is an array
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file); // Ensure file is correctly appended
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("subcategory", subcategory);
    formData.append("tags", tags.join(","));
    formData.append("parsed_content", JSON.stringify(parsedContent));

    try {
      const response = await axios.post("/api/upload", formData);
      alert("Document submitted successfully!");
      // Hide parsed content after successful submission
      setParsedContent([]);
    } catch (error) {
      console.error("Error submitting document:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < parsedContent.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
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
      <FileUpload file={file} setFile={setFile} />
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleParse}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Parse Document"}
        </Button>
      </Box>
      {parsedContent.length > 0 && (
        <ParsedContent
          parsedContent={parsedContent}
          currentPage={currentPage}
          handlePreviousPage={handlePreviousPage}
          handleNextPage={handleNextPage}
          handleUpload={handleUpload}
          loading={loading}
        />
      )}
    </Box>
  );
};

export default UploadPage;
