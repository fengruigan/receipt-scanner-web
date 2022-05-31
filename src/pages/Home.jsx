import React from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router";

const Home = () => {
  let navigate = useNavigate();

  return (
    <div>
      <div style={{ marginTop: "10em" }}>
        <div className="text-center">
          <h1>Receipt Scanner</h1>
          <h2>Split your bills easily by scanning your receipts!</h2>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={() => navigate("/sessions")}>Start</Button>
        </div>
      </div>
    </div>
  );
};

export default Home;
