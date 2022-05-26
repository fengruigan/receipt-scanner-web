import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, OverlayTrigger, Popover } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { deleteFromStorage, writeToDatabase } from "../utils/firebaseUtil";
import PropTypes from "prop-types";

const ImageModal = ({ images, show, setShow, shownImageIdx, setShownImageIdx }) => {
  let [showPopover, setShowPopover] = useState(false);

  useEffect(() => {
    if (shownImageIdx >= images.length) {
      setShownImageIdx(images.length - 1);
    }
    if (images.length === 0) {
      setShow(false);
    }
  }, [images, shownImageIdx]);

  const handleImageDelete = async () => {
    let imgs = [...images];
    let toDelete = imgs.splice(shownImageIdx, 1);
    writeToDatabase("/", { images: imgs });
    deleteFromStorage(toDelete[0].path);
    setShowPopover(false);
  };

  const renderPopover = () => {
    return (
      <Popover>
        <Popover.Header>This cannot be undone!</Popover.Header>
        <Popover.Body className="d-flex justify-content-center">
          <Button className="me-2" variant="danger" onClick={handleImageDelete}>
            Confirm
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setShowPopover(false);
            }}
          >
            Cancel
          </Button>
        </Popover.Body>
      </Popover>
    );
  };

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        setShowPopover(false);
      }}
      centered
    >
      <Modal.Header closeButton>Receipt# {shownImageIdx}</Modal.Header>
      <img
        src={shownImageIdx === -1 || !images[shownImageIdx] ? "#" : images[shownImageIdx].url}
        alt="enlarged image"
        style={{ maxHeight: "70%", maxWidth: "100%" }}
      />
      <Modal.Footer style={{ display: "block" }}>
        <Row>
          <Col>
            <Button
              onClick={() => {
                setShownImageIdx((shownImageIdx - 1 + images.length) % images.length);
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} className="me-1" />
              prev
            </Button>
          </Col>
          <Col className="d-flex justify-content-center">
            <OverlayTrigger
              show={showPopover}
              trigger="click"
              onToggle={() => {
                setShowPopover(!showPopover);
              }}
              placement="top"
              overlay={renderPopover()}
            >
              <Button variant="danger">
                <FontAwesomeIcon icon={faXmark} className="me-1" />
                Delete
              </Button>
            </OverlayTrigger>
          </Col>
          <Col>
            <Button
              className="float-end"
              onClick={() => {
                setShownImageIdx((shownImageIdx + 1) % images.length);
              }}
            >
              next
              <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
            </Button>
          </Col>
        </Row>
      </Modal.Footer>
    </Modal>
  );
};

ImageModal.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string,
      url: PropTypes.string,
    })
  ),
  show: PropTypes.bool,
  setShow: PropTypes.func,
  shownImageIdx: PropTypes.number,
  setShownImageIdx: PropTypes.func,
};

export default ImageModal;
