import React from "react";
import { Container } from "react-bootstrap";
import Home from "./pages/Home";
import "./css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { firebaseInit } from "./utils/firebaseUtil";
import ReceiptPage from "./pages/ReceiptPage";
import Sessions from "./pages/Sessions";
import NavigationBar from "./components/NavigationBar";
import Login from "./pages/Login";

const App = () => {
  firebaseInit();
  return (
    <Router>
      <NavigationBar />
      <Container>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/receipts" element={<ReceiptPage />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Container>
    </Router>
  );
};

export default App;
