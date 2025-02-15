import React, { useState, useEffect } from "react";

import {
  Box,
  Typography,
  useTheme,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { tokens } from "../../theme";
import Header from "../../components/Header";

const MetadataManagement = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [metadata, setMetadata] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    subcategory: "",
  });

  const fetchMetadata = async () => {
    try {
      const response = await axios.get("/api/metadata/fetch");
      setMetadata(response.data);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  useEffect(() => {
    fetchMetadata();
  }, []);

  const handleCreate = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const data = {
        ...formData,
        createdUser: "admin", // Replace with actual user
        createdTime: new Date().toISOString(),
      };
      await axios.post("/api/metadata/create", data);
      fetchMetadata();
      handleClose();
    } catch (error) {
      console.error("Error creating category or subcategory:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/metadata/delete/${id}`);
      fetchMetadata();
    } catch (error) {
      console.error("Error deleting metadata:", error);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5, headerAlign: "center" },
    {
      field: "category",
      headerName: "Category",
      flex: 1,
      headerAlign: "left",
    },
    {
      field: "subcategory",
      headerName: "Subcategory",
      flex: 1,
      headerAlign: "left",
    },
    {
      field: "createdUser",
      headerName: "Created User",
      flex: 1,
      headerAlign: "left",
    },
    {
      field: "createdTime",
      headerName: "Created Time",
      flex: 1,
      headerAlign: "left",
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      headerAlign: "left",
      renderCell: (params) => (
        <>
          <Button onClick={() => handleDelete(params.row.id)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Box width="100%">
        <Header
          title="METADATA MANAGEMENT"
          subtitle="Manage Categories and Subcategories"
        />
      </Box>
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
            textAlign: "center",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
        }}
      >
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            onClick={handleCreate}
            variant="contained"
            color="primary"
            sx={{ backgroundColor: colors.greenAccent[500] }}
          >
            Create Metadata
          </Button>
        </Box>
        <DataGrid rows={metadata} columns={columns} pageSize={5} />
      </Box>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create New Category/Subcategory</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="category"
            label="Category"
            type="text"
            fullWidth
            required
            value={formData.category}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            name="subcategory"
            label="Subcategory"
            type="text"
            fullWidth
            required
            value={formData.subcategory}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Create</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MetadataManagement;
