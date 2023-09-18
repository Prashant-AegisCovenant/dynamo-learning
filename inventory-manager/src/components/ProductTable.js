import React, { useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Skeleton,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Button,
  Pagination
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import CloseIcon from "@mui/icons-material/Close";
import usePagination from "../utils/pagination";

const StockTransferModal = ({
  open,
  onClose,
  product,
  transferSW,
  transferWS,
}) => {
  const [stocksToTransfer, setStocksToTransfer] = useState("");

  const handleInputChange = (event) => {
    const { value } = event.target;
    setStocksToTransfer(value || "");
  };

  const handleTransferSW = ({ productId }) => {
    transferSW(productId, stocksToTransfer);
    handleClose()
  };

  const handleTransferWS = ({ productId }) => {
    transferWS(productId, stocksToTransfer);
    handleClose()
  };

  const handleClose = () => {
    onClose();
    setStocksToTransfer("")
  }

  return (
    <Dialog onClose={onClose} open={open} sx={{ p: 2 }} fullWidth>
      <DialogTitle>
        <Typography fontSize='1.25rem' fontWeight='bold'>
          Transfer Stocks between Warehouse and Shop
        </Typography>
        <IconButton
          edge='end'
          color='inherit'
          onClick={onClose}
          aria-label='close'
          sx={{ position: "absolute", right: 0, top: 0, mx: 4, my: 1 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          label='Stock in Warehouse'
          name='stock_in_warehouse'
          value={product.stock_in_warehouse}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
          label='Stock in Shop'
          name='stock_in_shop'
          value={product.stock_in_shop}
          fullWidth
          margin='normal'
          disabled
        />
        <TextField
          label='Stocks to transfer'
          name='stocks_to_transfer'
          value={stocksToTransfer}
          onChange={handleInputChange}
          fullWidth
          required
          margin='normal'
        />
      </DialogContent>
      <DialogActions sx={{ display: "flex", flexDirection: "column" }}>
        <Button
          onClick={() => handleTransferWS({ productId: product.id })}
          color='primary'
          variant='outlined'
          sx={{ p: 1, mb: 1, fontSize: "1.125rem" }}
          fullWidth
        >
          Transfer from Warehouse to Shop
        </Button>
        <Button
          onClick={() => handleTransferSW({ productId: product.id })}
          color='primary'
          variant='outlined'
          sx={{ p: 1, fontSize: "1.125rem" }}
          fullWidth
        >
          Transfer from Shop to Warehouse
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const ProductTable = ({
  data,
  loading,
  handleDelete,
  transferWS,
  transferSW,
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState({});
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const pageCount = Math.ceil(data.length / PER_PAGE);
  const DATA = usePagination(data, PER_PAGE)

  const handlePageChange = (event, page) => {
    setPage(page)
    DATA.jump(page)
  }

  const handleStockExchangeClick = (product) => {
    setModalOpen(true);
    setActiveProduct(product);
  };

  const handleClose = () => {
    setModalOpen(false);
    setActiveProduct({});
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Warehouse Stock</TableCell>
              <TableCell>Shop Stock</TableCell>
              <TableCell>Last Updated</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton animation='wave' />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation='wave' />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation='wave' />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation='wave' />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation='wave' />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation='wave' />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation='wave' />
                    </TableCell>
                    <TableCell>
                      <Skeleton animation='wave' />
                    </TableCell>
                  </TableRow>
                ))
              : DATA.currentData().map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.id}</TableCell>
                    <TableCell>{product.product_name}</TableCell>
                    <TableCell>{product.product_category}</TableCell>
                    <TableCell>{product.price}</TableCell>
                    <TableCell>{product.stock_in_warehouse}</TableCell>
                    <TableCell>{product.stock_in_shop}</TableCell>
                    <TableCell>
                      {new Date(product.last_updated).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => handleStockExchangeClick(product)}
                        color='success'
                        size="small"
                      >
                        <SwapHorizIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(product.id)}
                        color='error'
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </TableContainer>
      <StockTransferModal
        open={modalOpen}
        onClose={handleClose}
        product={activeProduct}
        transferSW={transferSW}
        transferWS={transferWS}
      />
      <Box sx={{display: 'flex', justifyContent: 'space-around' }}>
      <Pagination
          count={pageCount}
          size='small'
          page={page}
          onChange={handlePageChange}
          sx={{mt:2}}
          showFirstButton
          showLastButton
          />
        </Box>
    </div>
  );
};

export default ProductTable;
