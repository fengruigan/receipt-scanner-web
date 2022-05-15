import React, { useEffect, useState, useRef } from "react";
import { Container, Button } from "react-bootstrap";
import "../css/Camera.css";

let camWidth = 600;
let aspectRatio = 1.77778;
let camHeight = camWidth / aspectRatio;

const Camera = () => {
  let [videoTrack, setVideoTrack] = useState(null);
  let [imageSrc, setImageSrc] = useState(null);
  let videoRef = useRef();
  let imageRef = useRef();
  let placeholderImageRef = useRef();
  let svgRef = useRef();

  const resize = () => {
    camWidth = window.outerWidth / 3;
    camHeight = window.outerHeight / 3;
    aspectRatio = camWidth / camHeight;
    videoRef.current.style.width = `${camWidth}px`;
    videoRef.current.style.height = `${camHeight}px`;

    if (imageRef.current) {
      imageRef.current.style.width = `${camWidth}px`;
      imageRef.current.style.height = `${camHeight}px`;
    }

    if (placeholderImageRef.current) {
      placeholderImageRef.current.style.width = `${camWidth}px`;
      placeholderImageRef.current.style.height = `${camHeight}px`;
    }

    if (svgRef.current) {
      svgRef.current.style.width = `${Math.round(camWidth / 2)}px`;
      svgRef.current.style.height = `${Math.round(camHeight / 2)}px`;
    }
  };

  useEffect(() => {
    window.addEventListener("load", resize);
    window.addEventListener("resize", resize);
  }, []);

  const startCam = async () => {
    const constraints = {
      audio: false,
      video: {
        width: camWidth,
        height: camHeight,
        facingMode: "user",
      },
    };
    let stream = await navigator.mediaDevices.getUserMedia(constraints);
    let video = document.querySelector("#video");
    video.srcObject = stream;
    video.play();
    setVideoTrack(stream.getVideoTracks()[0]);
  };

  const takePhoto = async () => {
    if (!videoTrack) return;

    let image = new ImageCapture(videoTrack);
    let photo = await image.takePhoto();
    let url = URL.createObjectURL(photo);
    setImageSrc(url);
    return photo;
  };

  const stopCam = async () => {
    if (!videoTrack) return;
    videoTrack.stop();
    setVideoTrack(null);
  };

  return (
    <Container className="Camera">
      <h1 className="text-center">Receipt Scanner</h1>
      <div style={{ zIndex: 999 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div className="media-frame">
            <video id="video" ref={videoRef} />
          </div>
          <div className="media-frame">
            {imageSrc ? (
              <img
                src={imageSrc}
                ref={imageRef}
                style={{
                  objectFit: "cover",
                }}
                alt="screenshot"
              />
            ) : (
              <div
                ref={placeholderImageRef}
                style={{
                  backgroundColor: "rgba(0,0,0,0.2)",
                  color: "red",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <svg
                  ref={svgRef}
                  style={{
                    fill: "rgba(0,0,0,0.5)",
                  }}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 576 512"
                >
                  <path d="M528 32H144c-26.51 0-48 21.49-48 48v256c0 26.51 21.49 48 48 48H528c26.51 0 48-21.49 48-48v-256C576 53.49 554.5 32 528 32zM223.1 96c17.68 0 32 14.33 32 32S241.7 160 223.1 160c-17.67 0-32-14.33-32-32S206.3 96 223.1 96zM494.1 311.6C491.3 316.8 485.9 320 480 320H192c-6.023 0-11.53-3.379-14.26-8.75c-2.73-5.367-2.215-11.81 1.332-16.68l70-96C252.1 194.4 256.9 192 262 192c5.111 0 9.916 2.441 12.93 6.574l22.35 30.66l62.74-94.11C362.1 130.7 367.1 128 373.3 128c5.348 0 10.34 2.672 13.31 7.125l106.7 160C496.6 300 496.9 306.3 494.1 311.6zM456 432H120c-39.7 0-72-32.3-72-72v-240C48 106.8 37.25 96 24 96S0 106.8 0 120v240C0 426.2 53.83 480 120 480h336c13.25 0 24-10.75 24-24S469.3 432 456 432z" />
                </svg>
              </div>
            )}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={startCam}>start</Button>
          <Button onClick={takePhoto}>capture</Button>
          <Button onClick={stopCam}>stop</Button>
        </div>
      </div>
    </Container>
  );
};

export default Camera;
