import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { addDBListener, addAuthListener } from "../utils/firebaseUtil";

const Sessions = () => {
  let [user, setUser] = useState(null);

  useEffect(() => {
    addAuthListener((user) => {
      setUser(user);
    });
  }, []);

  let [sessions, setSessions] = useState([]);

  useEffect(() => {
    if (user === null) return;
    addDBListener(user.uid, (data) => {
      setSessions((data && data.sessions) || []);
    });
  }, [user]);

  return (
    <div>
      <h1 className="text-center">Sessions</h1>
      <div className="d-flex justify-content-center">
        <Button>Start new session</Button>
      </div>
    </div>
  );
};

export default Sessions;
