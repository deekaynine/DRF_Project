import { useState, useEffect } from "react"
import { Routes, Route, BrowserRouter } from "react-router-dom"
import { CartProvider } from "./contexts/CartContext.jsx"
import "./App.css"

import Login from "./views/auth/Login"
import Register from "./views/auth/Register"
import Logout from "./views/auth/Logout"
import ForgotPassword from "./views/auth/ForgotPassword"
import CreatePassword from "./views/auth/CreatePassword"
import StoreHeader from "./views/base/StoreHeader"
import StoreFooter from "./views/base/StoreFooter"
import Search from "./views/store/Search"
import Products from "./views/store/Products"
import ProductDetail from "./views/store/ProductDetail"
import Cart from "./views/store/Cart"
import Checkout from "./views/store/Checkout"
import PaymentSuccess from "./views/store/PaymentSuccess"
import Account from "./views/customer/Account.jsx"
import Orders from "./views/customer/Orders.jsx"
import OrderDetails from "./views/customer/OrderDetails.jsx"
import Wishlist from "./views/customer/Wishlist.jsx"
import Notifications from "./views/customer/Notifications.jsx"
import Invoices from "./views/customer/Invoice.jsx"
import PrivateRoute from "./layout/PrivateRoute.jsx"
import MainWrapper from "./layout/MainWrapper.jsx"
import Settings from "./views/customer/Settings.jsx"

import Dashboard from "./views/vendor/Dashboard"
import VendorProducts from "./views/vendor/VendorProducts.jsx"
import VendorOrders from "./views/vendor/VendorOrders.jsx"
import VendorOrderDetail from "./views/vendor/VendorOrderDetail.jsx"
import Earning from "./views/vendor/Earnings.jsx"
import VendorReviews from "./views/vendor/VendorReviews.jsx"
import VendorReviewDetail from "./views/vendor/VendorReviewDetail.jsx"
import VendorCoupon from "./views/vendor/VendorCoupon.jsx"
import VendorEditCoupon from "./views/vendor/VendorEditCoupon.jsx"
import VendorNotifications from "./views/vendor/VendorNotifications.jsx"
import VendorSettings from "./views/vendor/VendorSettings.jsx"
import VendorShop from "./views/vendor/VendorShop.jsx"
import VendorAddProduct from "./views/vendor/VendorAddProduct.jsx"

function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <StoreHeader />
        <MainWrapper>
          <Routes>
            {/* Auth Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/create-new-password" element={<CreatePassword />} />
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Store Routes */}
            <Route path="/" element={<Products />} />
            <Route path="/?page=:page>" element={<Products />} />
            <Route path="/detail/:slug/" element={<ProductDetail />} />
            <Route path="/cart/" element={<Cart />} />
            <Route path="/checkout/:order_oid/" element={<Checkout />} />
            <Route
              path="/payment-success/:order_oid/"
              element={<PaymentSuccess />}
            />
            <Route path="/search/" element={<Search />}></Route>

            {/* Customer Routes */}
            <Route
              path="/customer/account/"
              element={
                <PrivateRoute>
                  <Account />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/customer/orders/"
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/orders/:order_oid/"
              element={
                <PrivateRoute>
                  <OrderDetails />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/wishlist/"
              element={
                <PrivateRoute>
                  <Wishlist />
                </PrivateRoute>
              }
            />
            <Route
              path="/customer/notifications/"
              element={
                <PrivateRoute>
                  <Notifications />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/customer/settings/"
              element={
                <PrivateRoute>
                  <Settings />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/customer/invoices/:order_oid"
              element={
                <PrivateRoute>
                  <Invoices />
                </PrivateRoute>
              }
            ></Route>

            {/* Vendor Routes */}
            <Route
              path="/vendor/dashboard/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/vendor/products/"
              element={
                <PrivateRoute>
                  <VendorProducts />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/vendor/orders/"
              element={
                <PrivateRoute>
                  <VendorOrders />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/vendor/orders/:order_oid"
              element={
                <PrivateRoute>
                  <VendorOrderDetail />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/vendor/earning/"
              element={
                <PrivateRoute>
                  <Earning />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/vendor/reviews/"
              element={
                <PrivateRoute>
                  <VendorReviews />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/vendor/reviews/:review_id"
              element={
                <PrivateRoute>
                  <VendorReviewDetail />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/vendor/coupon/"
              element={
                <PrivateRoute>
                  <VendorCoupon />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/vendor/coupon/:coupon_id"
              element={
                <PrivateRoute>
                  <VendorEditCoupon />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/vendor/notifications/"
              element={
                <PrivateRoute>
                  <VendorNotifications />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/vendor/settings/"
              element={
                <PrivateRoute>
                  <VendorSettings />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/vendor/:vendor_slug/"
              element={
                <PrivateRoute>
                  <VendorShop />
                </PrivateRoute>
              }
            ></Route>
            <Route
              path="/vendor/product/new/"
              element={
                <PrivateRoute>
                  <VendorAddProduct />
                </PrivateRoute>
              }
            />
          </Routes>
        </MainWrapper>
        <StoreFooter />
      </BrowserRouter>
    </CartProvider>
  )
}

export default App
