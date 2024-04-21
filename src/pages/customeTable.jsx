import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Tooltip } from "@mui/material";
import { FiEdit, FiTrash } from "react-icons/fi";

const CustomTable = ({ rows, columns, onDelete, onEdit }) => {
  const [selectionModel, setSelectionModel] = useState([]);

  const handleDelete = () => {
    onDelete(selectionModel);
    setSelectionModel([]);
  };

  const handleEdit = (id) => {
    onEdit(id);
  };

  const renderEditButton = (id) => (
    <Tooltip arrow title="Edit">
      <IconButton onClick={() => handleEdit(id)}>
        <FiEdit />
      </IconButton>
    </Tooltip>
  );

  const renderDeleteButton = () => (
    <Tooltip arrow title="Delete">
      <IconButton onClick={handleDelete}>
        <FiTrash />
      </IconButton>
    </Tooltip>
  );

  const columnsWithButtons = [
    ...columns,
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      renderCell: (params) => (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          {renderEditButton(params.id)}
          {renderDeleteButton(params.id)}
        </div>
      ),
    },
  ];

  return (
    <div style={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={rows}
        columns={columnsWithButtons}
        pageSize={5}
        checkboxSelection
        selectionModel={selectionModel}
        onSelectionModelChange={(newSelection) => {
          setSelectionModel(newSelection.selectionModel);
        }}
      />
    </div>
  );
};

export default CustomTable;
