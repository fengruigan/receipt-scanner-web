import React, { useEffect, useState, useRef } from "react";
import { Button, Form, Modal, Toast, ToastContainer } from "react-bootstrap";
import { addAuthListener, anonymousSignIn, emailCreateUser, emailSignIn } from "../utils/firebaseUtil";
import { useNavigate } from "react-router";
import "../css/Login.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

const Login = () => {
  let [error, setError] = useState(null);
  let [showModal, setShowModal] = useState(false);
  let [showToast, setShowToast] = useState(false);
  let [newEmail, setNewEmail] = useState(true);
  let navigate = useNavigate();
  let formRef = useRef();

  useEffect(() => {
    addAuthListener((user) => {
      if (user !== null) navigate("/");
    });
  });

  const handleSignInAsGuest = async () => {
    try {
      await anonymousSignIn();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEmailSignInFormSubmit = async (event) => {
    event.preventDefault();
    let data = new FormData(formRef.current);
    let method = newEmail ? emailCreateUser : emailSignIn;
    try {
      await method(data.get("email"), data.get("password"));
    } catch (err) {
      setShowToast(true);
      setError(err.code);
    }
  };

  const renderEmailSignInModal = () => {
    return (
      <Modal
        centered
        show={showModal}
        onHide={() => {
          setShowModal(false);
        }}
      >
        <Modal.Header closeButton>{newEmail ? "Create new account" : "Sign in with email"}</Modal.Header>
        <Modal.Body>
          <Form ref={formRef} onSubmit={handleEmailSignInFormSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control required type="email" placeholder="Enter email" name="email" />
              {newEmail && (
                <Form.Text className="text-muted">We will never share your email with anyone else.</Form.Text>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control required type="password" placeholder="Password" name="password" />
            </Form.Group>
            <div className="mb-2">
              {newEmail ? "Already have an account?" : "New to our site?"}
              <span
                className="ms-1"
                style={{ color: "blue" }}
                onClick={() => {
                  setNewEmail(!newEmail);
                }}
              >
                {newEmail ? "Sign in here" : "Create a new account"}
              </span>
            </div>
            <Button variant="primary" type="submit">
              {newEmail ? "Create account" : "Sign in"}
            </Button>
          </Form>
        </Modal.Body>
        {error && <Modal.Footer style={{ color: "red" }}>{error}</Modal.Footer>}
      </Modal>
    );
  };

  const handleSignInWithEmail = async () => {
    setShowModal(true);
    setError(null);
  };

  const renderToast = () => {
    return (
      <ToastContainer position="top-end" className="mt-3 me-3">
        <Toast
          show={showToast}
          onClose={() => {
            setShowToast(false);
          }}
          autohide
          delay={5000}
        >
          <Toast.Header>
            <strong className="me-auto">Hi!</strong>
          </Toast.Header>
          <Toast.Body>{error}</Toast.Body>
        </Toast>
      </ToastContainer>
    );
  };

  return (
    <div className="Login">
      <h1 className="text-center">Login page</h1>
      <div className="mt-5">
        <div className="d-flex justify-content-center mb-3">
          <Button className="login-options" id="guestLoginButton" onClick={handleSignInAsGuest}>
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Continue as guest
          </Button>
        </div>
        <div className="d-flex justify-content-center mb-3">
          <Button className="login-options" id="emailLoginButton" onClick={handleSignInWithEmail}>
            <FontAwesomeIcon icon={faEnvelope} className="me-2" />
            Sign in with Email
          </Button>
        </div>
        <div className="d-flex justify-content-center mb-3">
          <Button className="login-options" id="googleLoginButton" disabled>
            <FontAwesomeIcon icon={faGoogle} className="me-2" />
            Sign in with Google
          </Button>
        </div>
      </div>
      {renderEmailSignInModal()}
      {renderToast()}
    </div>
  );
};

export default Login;
