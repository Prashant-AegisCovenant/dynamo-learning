import React, { useState } from "react";
import {
  Button,
  Box,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";

const AddNewProduct = (props) => {
  const { onClose, open, addProduct } = props;

  const [product, setProduct] = useState({
    product_name: "",
    product_category: "",
    price: "",
    stock_in_warehouse: "",
    stock_in_shop: "",
  });

  const handleClose = () => {
    onClose();
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setProduct({ ...product, [name]: value });
  };

  const handleClearForm = () => {
    setProduct({
      product_name: "",
      product_category: "",
      price: "",
      stock_in_warehouse: "",
      stock_in_shop: "",
    });
  };

  const handleAddProduct = async () => {
    try {
      addProduct(product);
      handleClearForm();
      handleClose();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog onClose={handleClose} open={open} sx={{ p: 2 }}>
      <DialogTitle>
        <Typography fontSize='1.5rem' fontWeight='bold'>
          Add New Product
        </Typography>
        <IconButton
          edge='end'
          color='inherit'
          onClick={handleClose}
          aria-label='close'
          sx={{ position: "absolute", right: 0, top: 0, mx: 4, my: 1 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          label='Product Name'
          name='product_name'
          value={product.product_name}
          onChange={handleInputChange}
          fullWidth
          required
          margin='normal'
        />
        <TextField
          label='Product Category'
          name='product_category'
          value={product.product_category}
          onChange={handleInputChange}
          fullWidth
          required
          margin='normal'
        />
        <TextField
          label='Price'
          name='price'
          value={product.price}
          onChange={handleInputChange}
          fullWidth
          required
          margin='normal'
        />
        <TextField
          label='Stock in Warehouse'
          name='stock_in_warehouse'
          value={product.stock_in_warehouse}
          onChange={handleInputChange}
          fullWidth
          required
          margin='normal'
        />
        <TextField
          label='Stock in Store'
          name='stock_in_shop'
          value={product.stock_in_shop}
          onChange={handleInputChange}
          fullWidth
          margin='normal'
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-around" }}>
        <Button
          onClick={handleClearForm}
          color='primary'
          variant='outlined'
          sx={{ p: 1, fontSize: "1.125rem" }}
          fullWidth
        >
          Clear Form
        </Button>
        <Button
          onClick={handleAddProduct}
          color='primary'
          variant='contained'
          sx={{ p: 1, fontSize: "1.125rem" }}
          startIcon={<AddIcon />}
          fullWidth
        >
          Add Product
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const SearchBar = ({ addProduct, searchQuery, setSearchQuery }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleAddNewClick = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <Container
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between",
        mx: 0,
        my: 2,
      }}
    >
      <TextField
        type='search'
        id='search'
        label='Search'
        sx={{ width: 500, mb: 1 }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Box>
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={handleAddNewClick}
          sx={{ px: 2, py: 1, fontSize: "1.125rem" }}
        >
          Add New
        </Button>
      </Box>
      <AddNewProduct
        open={modalOpen}
        onClose={handleClose}
        addProduct={addProduct}
      />
    </Container>
  );
};

export default SearchBar;
