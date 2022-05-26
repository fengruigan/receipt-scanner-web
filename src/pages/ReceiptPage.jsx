import React, { useEffect, useRef, useState } from "react";
import { Button } from "react-bootstrap";
import isMobile from "../utils/isMobile";
import "../css/ImageList.css";
import { addDBListener, getUrl, uploadToStorage, writeToDatabase } from "../utils/firebaseUtil";
import ImageModal from "../components/ImageModal";

const ReceiptPage = () => {
  let [images, setImages] = useState([]);
  let [showModal, setShowModal] = useState(false);
  let [shownImageIdx, setShownImageIdx] = useState(-1);
  let inputRef = useRef(null);

  useEffect(() => {
    addDBListener("/", (data) => {
      setImages((data && data.images) || []);
    });
  }, []);

  const handleImageChange = async (event) => {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      let result = await uploadToStorage("/", files[i]);
      if (!images) images = [];
      images.push({ url: await getUrl(result.metadata.fullPath), path: result.metadata.fullPath });
    }
    writeToDatabase("/", { images: images });
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
      <h1 className="text-center">Scan your receipts here</h1>
      <input
        onChange={handleImageChange}
        ref={inputRef}
        className="visually-hidden"
        type="file"
        accept="image/*"
        multiple
      />
      <div style={{ display: "flex", justifyContent: "center" }}>{renderScanButton()}</div>

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
    </div>
  );
};

export default ReceiptPage;
