import React, { useEffect, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import { FiPlus } from "react-icons/fi";
import { Link } from "react-router-dom";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://aksion.vpsolutions.et/api/v1/accounts",
          {
            headers: {
              Accept: "application/json",
              Authorization:
                "Bearer 85|iFvyuUIeJvvGNMNerwOgcJUKfw2d7QzSy7gubmqO1ccfbd1c",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();
        setProducts(data.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const fields = [
    { id: "id", label: "ID" },
    { id: "account_no", label: "Account Number" },
    { id: "entity_name", label: "Entity Name" },
    { id: "account_holder_name", label: "Account Holder Name" },
  ];

  return (
    <Box sx={{ pt: "80px", pb: "20px" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Typography variant="h6">Products</Typography>
        <Link to="/products/add" style={{ textDecoration: "none" }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FiPlus />}
            sx={{ borderRadius: "20px" }}
          >
            Add Product
          </Button>
        </Link>
      </Box>
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#f2f2f2",
              borderBottom: "1px solid #ddd",
              textAlign: "left",
            }}
          >
            {fields.map((field) => (
              <th
                key={field.id}
                style={{
                  padding: "12px",
                }}
              >
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr
              key={product.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "inherit",
                borderBottom: "1px solid #ddd",
              }}
            >
              {fields.map((field) => (
                <td
                  key={field.id}
                  style={{
                    padding: "12px",
                  }}
                >
                  {product[field.id]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default Products;
