import React, { useState, useEffect } from "react";
import { Container } from "@mui/material";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import ProductTable from "./components/ProductTable";
import api from "./utils/api";

function App() {
  const [productsData, setProductsData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProductsData();
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  const fetchProductsData = async () => {
    try {
      const response = await api.get("/get-all");
      const products = response.data;
      const filteredProducts = products.filter((product) => {
        const name = product.product_name.toLowerCase();
        const category = product.product_category.toLowerCase();
        const query = searchQuery.toLowerCase();
        return name.includes(query) || category.includes(query);
      });
      filteredProducts.sort((a, b) => {
        const dateA = new Date(a.last_updated);
        const dateB = new Date(b.last_updated);
        return dateB - dateA;
      });
      setProductsData(filteredProducts);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setIsLoading(false);
    }
  };

  const reloadTable = () => {
    setIsLoading(true);
    fetchProductsData();
  };

  const addProduct = async (product) => {
    const parsedProduct = {
      product_name: product.product_name,
      product_category: product.product_category,
      price: parseFloat(product.price),
      stock_in_warehouse: parseInt(product.stock_in_warehouse),
      stock_in_shop: parseInt(product?.stock_in_shop) || 0,
    };
    try {
      await api.post("/create-product", parsedProduct);
      reloadTable();
    } catch (error) {
      console.log("Error adding product: ", error);
    }
  };

  const handleTransferSW = async ({ productId, stocksToTransfer }) => {
    try {
      await api.put(`/movestock-s-w/${productId}/${stocksToTransfer}`);
      reloadTable();
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const handleTransferWS = async ({ productId, stocksToTransfer }) => {
    try {
      await api.put(`/movestock-w-s/${productId}/${stocksToTransfer}`);
      reloadTable();
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      await api.delete(`/delete-particular/${productId}`);
      reloadTable();
    } catch (error) {
      console.log("Error deleting product: ", error);
    }
  };

  return (
    <div className='App'>
      <Container maxWidth='lg'>
        <Header />
        <SearchBar
          addProduct={addProduct}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <ProductTable
          data={productsData}
          loading={isLoading}
          handleDelete={(productId) => deleteProduct(productId)}
          transferWS={(productId, stocksToTransfer) =>
            handleTransferWS({ productId, stocksToTransfer })
          }
          transferSW={(productId, stocksToTransfer) =>
            handleTransferSW({ productId, stocksToTransfer })
          }
        />
      </Container>
    </div>
  );
}

export default App;
