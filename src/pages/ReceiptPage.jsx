import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import isMobile from "../utils/isMobile";
import "../css/ImageList.css";
import { addAuthListener, addDBListener, getUrl, uploadToStorage, writeToDatabase } from "../utils/firebaseUtil";
import ImageModal from "../components/ImageModal";
import { useParams } from "react-router";
import PermissionDeniedModal from "../components/PermissionDeniedModal";

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

  const handleImageChange = async (event) => {
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

  return (
    <div>
      <h1 className="text-center">{title}</h1>
      <h2 style={{ fontSize: "1.5em" }} className="text-center">
        {new Date(createdAt).toLocaleDateString()}
      </h2>
      <input
        onChange={handleImageChange}
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept="image/*"
        multiple
      />
      <div className="mt-3 mb-3" style={{ display: "flex", justifyContent: "center" }}>
        {renderScanButton()}
      </div>

      {images.length !== 0 && (
        //   TODO: refactor this into ImageList component
        <div
          className="ImageList"
          style={{ overflowX: "scroll", whiteSpace: "nowrap", backgroundColor: "rgba(0, 0, 0, 0.1)" }}
        >
          {renderImages()}
        </div>
      )}

      <ImageModal
        show={showModal}
        setShow={setShowModal}
        shownImageIdx={shownImageIdx}
        setShownImageIdx={setShownImageIdx}
        images={images}
      />
      {error && <PermissionDeniedModal hasUser={user !== null} />}
    </div>
  );
};

export default ReceiptPage;
