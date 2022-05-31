import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Form, Toast, ToastContainer, ListGroup } from "react-bootstrap";
import { addDBListener, addAuthListener, writeToDatabase, pushToDatabaseList } from "../utils/firebaseUtil";
import { useNavigate } from "react-router";
import { v4 } from "uuid";

const Sessions = () => {
  let [user, setUser] = useState(null);
  let [sessions, setSessions] = useState([]);
  let [showModal, setShowModal] = useState(false);
  let [showToast, setShowToast] = useState(false);
  let [error, setError] = useState(null);
  let formRef = useRef();
  let navigate = useNavigate();

  useEffect(() => {
    addAuthListener((user) => {
      if (user === null) navigate("/login");
      setUser(user);
    });
  }, []);

  useEffect(() => {
    if (user === null) return;
    addDBListener(`/users/${user.uid}`, (data) => {
      setSessions((data && data.owned) || []);
    });
  }, [user]);

  const handleStartNewSession = async (event) => {
    event.preventDefault();

    let sessionData = new FormData(formRef.current);
    let session = {
      title: sessionData.get("sessionTitle") || `Session ${sessions.length + 1}`,
      createdAt: new Date().getTime(),
      users: {
        [user.uid]: {
          owner: true,
        },
      },
      inviteToken: v4(),
    };
    try {
      let sessionId = await pushToDatabaseList("sessions", session);
      await writeToDatabase(`users/${user.uid}/owned`, [
        ...sessions,
        { sessionId: sessionId, title: session.title, createdAt: session.createdAt },
      ]);
      //   navigate(`/sessions/${sessionId}`);
    } catch (err) {
      setError(err.code);
      setShowToast(true);
    }
  };

  const newSessionModal = (
    <Modal centered show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>Start new session</Modal.Header>
      <Modal.Body>
        <Form ref={formRef} onSubmit={handleStartNewSession}>
          <Form.Group className="mb-3" controlId="sessionTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder={`Session ${sessions.length + 1}`}
              maxLength={30}
              name="sessionTitle"
            />
            <Form.Text className="text-muted">You can give this session a title</Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit">
            Create
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );

  const errorToast = (
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
          <strong className="me-auto">Error!</strong>
        </Toast.Header>
        <Toast.Body>{error}</Toast.Body>
      </Toast>
    </ToastContainer>
  );

  const sessionsList = () => {
    return sessions.length === 0 ? (
      <div className="text-center p-3 mt-3">The list is empty, start a new session</div>
    ) : (
      <div className="w-75 m-auto mt-3">
        <ListGroup>
          {sessions.map((el, idx) => {
            return (
              <ListGroup.Item
                key={idx}
                className="p-2 ps-3"
                action
                onClick={() => navigate(`/sessions/${el.sessionId}`)}
              >
                <div className="mb-1" style={{ fontWeight: "bold" }}>
                  {el.title}
                </div>
                <div className="ms-3">Created at {new Date(el.createdAt).toLocaleDateString()}</div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </div>
    );
  };

  return (
    <div>
      <h1 className="text-center">Sessions</h1>
      <div className="d-flex justify-content-center">
        <Button
          onClick={() => {
            if (user === null) {
              navigate("/login");
              return;
            }
            setShowModal(true);
          }}
        >
          Start new session
        </Button>
      </div>
      {sessionsList()}
      {newSessionModal}
      {errorToast}
    </div>
  );
};

export default Sessions;
