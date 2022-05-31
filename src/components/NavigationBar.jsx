import React, { useState, useEffect, useMemo } from "react";
import { Nav, Navbar, Container, Toast, ToastContainer } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addAuthListener, logOut } from "../utils/firebaseUtil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const NavigationBar = () => {
  let [user, setUser] = useState(null);
  let [showToast, setShowToast] = useState(false);
  let username = useMemo(() => {
    return (user && user.uid) || "null";
  }, [user]);
  let navigate = useNavigate();

  useEffect(() => {
    addAuthListener((user) => {
      setShowToast(true);
      setUser(user);
    });
  }, []);

  const renderToast = () => {
    return (
      <ToastContainer position="top-end" className="mt-3 me-3">
        <Toast
          show={showToast}
          onClose={() => {
            setShowToast(false);
          }}
          autohide
          delay={3000}
        >
          <Toast.Header>
            <strong className="me-auto">Welcome!</strong>
          </Toast.Header>
        </Toast>
      </ToastContainer>
    );
  };

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>Receipt Scanner</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
          </Nav>
          <Nav>
            {user === null ? (
              <Nav.Link className="float-end" onClick={() => navigate("/login")}>
                <FontAwesomeIcon icon={faUserPlus} className="me-2" />
                Sign In
              </Nav.Link>
            ) : (
              <>
                <Nav.Link onClick={() => navigate(`/user/${username}`)}>Account</Nav.Link>
                <Nav.Link className="float-end" onClick={logOut}>
                  Sign out
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      {renderToast()}
    </Navbar>
  );
};

export default NavigationBar;
