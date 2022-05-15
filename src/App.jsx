import React, { useEffect, useState, useRef } from "react";
import { Container, Button } from "react-bootstrap";
import Camera from "./components/Camera";
import "./css/App.css";

const App = () => {
  return (
    <Container>
      <Camera />
    </Container>
  );
};

export default App;
