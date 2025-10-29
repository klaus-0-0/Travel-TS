import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./page/Login";

import { useState } from "react";
import HandleBooking from "./admin/HandleBooking";
import Signup from "./page/Signup";
import AdminDashboard from "./admin/AdminDashboard";
import AdminUploadItems from "./admin/AdminUploadItems";
import Dashboard from "./page/Dashboard";
import Destination from "./page/Destination";

interface TravelItem {
  id: string;
  name: string;
  country: string;
  description: string;
  price: number;
  imageUrl: string;
  isAvailable?: boolean;
  createdAt: string;
}

export default function App() {
  const [data, setData] = useState<TravelItem | null>(null);

  return (
    <Router>
      <Routes>
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/AdminUploadItems" element={<AdminUploadItems />} />
        <Route path="/HandleBooking" element={<HandleBooking />} />

        <Route path="/" element={<Signup />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard setData={setData} />} />
        {/* <Route path="/cart" element={<Cart />} /> */}
        <Route path="/Destination" element={<Destination data={data} />} />
      </Routes>
    </Router>
  )
}