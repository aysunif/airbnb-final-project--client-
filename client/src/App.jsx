import { Routes, Route } from "react-router-dom";
import './App.css'
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import CreateListing from "./pages/CreateListing";
import ListingDetails from "./pages/ListingDetails";

function App() {

  return (
    <>
      <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route path="/properties/:listingId" element={<ListingDetails />} />

        </Route>
          <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
