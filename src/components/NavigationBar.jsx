import React, { useState, useEffect } from "react";
import { Nav, Navbar, Container, Toast, ToastContainer, NavDropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { addAuthListener, logOut } from "../utils/firebaseUtil";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

const NavigationBar = () => {
  let [user, setUser] = useState(null);
  let [showToast, setShowToast] = useState(false);
  let navigate = useNavigate();

  useEffect(() => {
    addAuthListener((user) => {
      setShowToast(true);
      setUser(user);
    });
  }, []);

  const toast = (
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
                <NavDropdown title={user.isAnonymous ? `guest-${user.uid}` : `${user.email}`}>
                  <Nav.Link onClick={() => navigate("/sessions")}>Account</Nav.Link>
                  <Nav.Link onClick={logOut}>Sign out</Nav.Link>
                </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
      {toast}
    </Navbar>
  );
};

export default NavigationBar;
