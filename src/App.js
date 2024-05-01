// App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Box from "@mui/material/Box";
import Sidebar from "./components/common/Sidebar";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/common/Navbar";
import { Provider } from 'react-redux'; // Import Provider
import store from './redux/store';
import {
  AddProduct,
  Brands,
  Customers,
  Inbox,
  Orders,

  ProductCategories,
  Products,
  ProductSales,
  Reviews,
   Settings,
  SingleCustomer,
  SingleOrder,
  SingleProduct,
  Suppliers,
  Transactions,
  Login,
  Stocks,
  CompanyList,
  News,
  Deposits,
  StockOrder,
  User,
  Withdraw,

} from "./pages";
import Footer from "./components/common/Footer";
import { useDispatch, useSelector } from 'react-redux';
const sideBarWidth = 250;
function App() {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Provider store={store}>
      <Router>
        <Box sx={{ display: "flex" }}>
          <Navbar
            sideBarWidth={sideBarWidth}
            handleDrawerToggle={handleDrawerToggle}
          />
          <Sidebar
            sideBarWidth={sideBarWidth}
            mobileOpen={mobileOpen}
            handleDrawerToggle={handleDrawerToggle}
          />
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              px: { xs: 1, md: 2 },
              width: { xs: "100%", md: `calc(100% - ${sideBarWidth}px)` },
            }}
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/products/add" element={<AddProduct />} />
              <Route path="/stocks" element={<Stocks />} />
              <Route path="/companies" element={<CompanyList />} />
              <Route path="/news" element={<News />} />
              <Route path="/deposits" element={<Deposits/>} />
              <Route path="/orders" element={<StockOrder/>} />
              <Route path="/users" element={<User/>} />
              <Route path="withdraws" element={<Withdraw/>} />

              <Route path="/products/:id" element={<SingleProduct />} />
              <Route path="/products/categories" element={<ProductCategories />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:id" element={<SingleCustomer />} />
              <Route path="/sales" element={<ProductSales />} />
              <Route path="/orders/:id" element={<SingleOrder />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/brands" element={<Brands />} />
              <Route path="/reviews" element={<Reviews />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/inbox" element={<Inbox />} />
            </Routes>
            <Footer />
          </Box>
        </Box>
      </Router>
    </Provider>
  );
}
export default App;