import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../components/Home";
import Service from "../components/Service";
import Contact from "../components/Contact";
import Footer from "../Layouts/Footer";
import Header from "../Layouts/Header";
import Register from "../Auth/Register";
import AddPoliceStation from "../components/AddStation";
import Login from "../Auth/Login";

function Routing() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/addstation" element={<AddPoliceStation />} />
        <Route path="/service" element={<Service />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default Routing;