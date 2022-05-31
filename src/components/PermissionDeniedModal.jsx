import React from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router";
import PropTypes from "prop-types";

const PermissionDeniedModal = ({ hasUser }) => {
  let navigate = useNavigate();
  return (
    <Modal show={true}>
      <Modal.Header>Error!</Modal.Header>
      <Modal.Body>
        <div>Oops! You do not have permission to view this page</div>
        <div className="mt-3 d-flex justify-content-center">
          <Button onClick={() => navigate(hasUser ? "/" : "/login")}>{hasUser ? "Back to Home" : "Login"}</Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

PermissionDeniedModal.propTypes = {
  hasUser: PropTypes.bool,
};

export default PermissionDeniedModal;
