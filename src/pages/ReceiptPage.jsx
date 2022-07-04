import React, { useEffect, useRef, useState } from "react";
import { Button, ListGroup, ListGroupItem, Form, Modal, Row, Col } from "react-bootstrap";
import isMobile from "../utils/isMobile";
import "../css/ImageList.css";
import "../css/ReceiptPage.css";
import { addAuthListener, addDBListener, getUrl, uploadToStorage, writeToDatabase } from "../utils/firebaseUtil";
import ImageModal from "../components/ImageModal";
import { useParams } from "react-router";
import PermissionDeniedModal from "../components/PermissionDeniedModal";
// import { data } from "../sampleData";

const ReceiptPage = () => {
  let sessionId = useParams().sessionId;
  let [images, setImages] = useState([]);
  let [title, setTitle] = useState("title");
  let [createdAt, setCreatedAt] = useState(null);
  let [showModal, setShowModal] = useState(false);
  let [shownImageIdx, setShownImageIdx] = useState(-1);
  let [error, setError] = useState(null);
  let [user, setUser] = useState(null);
  let inputRef = useRef(null);
  let formRef = useRef(null);

  let [ocrResult, setOcrResult] = useState(null);
  // let ocrResult = data.receipts[0].items;
  let [sections, setSections] = useState({});
  let [showSectionModal, setShowSectionModal] = useState(false);

  useEffect(() => {
    addAuthListener((user) => {
      setUser(user);
    });
    addDBListener(
      `/sessions/${sessionId}`,
      (data) => {
        if (data === null) {
          setTitle("null");
        } else {
          setTitle(data.title);
          setCreatedAt(data.createdAt);
          setImages(data.images || []);
        }
      },
      (err) => {
        setError(err.code);
      }
    );
  }, []);

  const handleImageUpload = async (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let result = await uploadToStorage(`${sessionId}`, files[i]);
      if (!images) images = [];
      images.push({ url: await getUrl(result.metadata.fullPath), path: result.metadata.fullPath });
    }
    writeToDatabase(`sessions/${sessionId}/images`, images);
    // reset file input so uploading same file works
    inputRef.current.value = "";
  };

  const renderImages = () => {
    if (!images) return;
    return images.map((el, idx) => {
      return (
        <img
          className="m-2"
          onClick={() => {
            setShowModal(true);
            setShownImageIdx(idx);
          }}
          key={idx}
          src={el.url}
          alt={`image-${idx}`}
          style={{ borderRadius: "3%" }}
        />
      );
    });
  };

  const renderScanButton = () => {
    return isMobile() ? (
      <Button
        onClick={() => {
          inputRef.current.click();
        }}
      >
        Scan or Upload Receipts
      </Button>
    ) : (
      <Button
        onClick={() => {
          inputRef.current.click();
        }}
      >
        Upload Receipts
      </Button>
    );
  };

  const renderReceiptItem = (item, idx) => {
    return (
      <ListGroupItem key={idx} className="receipt-list-item">
        <div>{item.description}</div>
        <div className="float-end">${item.amount}</div>
      </ListGroupItem>
    );
  };

  const renderReceiptItems = (dataList) => {
    return (
      <ListGroup>
        {dataList.map((el, idx) => {
          return renderReceiptItem(el, idx);
        })}
      </ListGroup>
    );
  };

  const handleAddSection = (event) => {
    event.preventDefault();
    let formData = new FormData(formRef.current);
    let name = formData.get("sectionName") || `Section ${Object.keys(sections).length + 1}`;
    // sections[name] = { name: name, items: [] };
    sections[name] = { name: name, items: ocrResult }; // for testing purpose
    setSections({ ...sections });
    setShowSectionModal(false);
  };

  const renderSections = () => {
    return Object.keys(sections).map((el, idx) => {
      return (
        <Col lg={4} key={idx}>
          <div>{sections[el].name}</div>
          {renderReceiptItems(sections[el].items)}
        </Col>
      );
    });
  };

  const newSectionModal = (
    <Modal centered show={showSectionModal} onHide={() => setShowSectionModal(false)}>
      <Modal.Header closeButton>Add new section</Modal.Header>
      <Modal.Body>
        <Form ref={formRef} onSubmit={handleAddSection}>
          <Form.Group className="mb-3" controlId="sectionName">
            <Form.Label>Section name</Form.Label>
            <Form.Control
              type="text"
              placeholder={`Section ${Object.keys(sections).length + 1}`}
              maxLength={30}
              name="sectionName"
            />
            <Form.Text className="text-muted">You can give new section a name</Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit">
            Add section
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );

  // TODO: marking the return section, refactor this page!!!!!
  return (
    <div className="ReceiptPage">
      <h1 className="text-center">{title}</h1>
      <h2 style={{ fontSize: "1.5em" }} className="text-center">
        {new Date(createdAt).toLocaleDateString()}
      </h2>
      <input
        onChange={handleImageUpload}
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept="image/*"
        multiple
      />
      <div className="mt-3 mb-3" style={{ display: "flex", justifyContent: "center" }}>
        {renderScanButton()}
      </div>

      {images.length !== 0 ? (
        //   TODO: refactor this into ImageList component
        <div
          className="ImageList"
          style={{ overflowX: "scroll", whiteSpace: "nowrap", backgroundColor: "rgba(0, 0, 0, 0.1)" }}
        >
          {renderImages()}
        </div>
      ) : (
        <div className="text-center">No receipts uploaded yet. Upload a receipt to start</div>
      )}

      <ImageModal
        show={showModal}
        setShow={setShowModal}
        shownImageIdx={shownImageIdx}
        setShownImageIdx={setShownImageIdx}
        images={images}
      />

      <div className="d-flex justify-content-center">
        {ocrResult ? <div>{renderReceiptItems(ocrResult)}</div> : <div>This list is empty</div>}
      </div>

      <div className="d-flex justify-content-center">
        <Button onClick={() => setShowSectionModal(true)}>Add section</Button>
      </div>

      <Row style={{ whiteSpace: "nowrap" }} className="p-3">
        {renderSections()}
      </Row>

      {newSectionModal}

      {error && <PermissionDeniedModal hasUser={user !== null} />}

      <div style={{ height: "30em" }}></div>
    </div>
  );
};

export default ReceiptPage;
