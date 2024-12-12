import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Header from "../layouts/Header";
import PageNotFound from "../layouts/PageNotFound";
import { Login } from "../pages/Login";
import Employee from "../pages/Employee";
import ItemType from "../pages/ItemType";
import MenuItem from "../pages/MenuItem";
import ProtectedRoute from "../components/Protectedroute/ProtectedRoute";
import Order from "../pages/Order";
import Shift from "../pages/Shift";

export default function MainRoutes() {
  return (
    <BrowserRouter>
      <ProtectedRoute><Header /></ProtectedRoute>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/employee" element={<ProtectedRoute><Employee /></ProtectedRoute>} />
        <Route path="/item-type" element={<ProtectedRoute><ItemType /></ProtectedRoute>} />
        <Route path="/menu-item" element={<ProtectedRoute><MenuItem /></ProtectedRoute>} />
        <Route path="/order" element={<ProtectedRoute><Order /></ProtectedRoute>} />
        <Route path="/shift" element={<ProtectedRoute><Shift /></ProtectedRoute>} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
