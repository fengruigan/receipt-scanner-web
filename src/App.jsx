import React from "react";
import { Container } from "react-bootstrap";
import Home from "./pages/Home";
import "./css/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { firebaseInit } from "./utils/firebaseUtil";
import ReceiptPage from "./pages/ReceiptPage";

const App = () => {
  firebaseInit();
  return (
    <Container>
      <Router>
        <Routes>
          <Route path="/receipts" element={<ReceiptPage />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </Container>
  );
};

export default App;
