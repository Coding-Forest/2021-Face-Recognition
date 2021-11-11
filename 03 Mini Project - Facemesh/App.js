import React, {useRef} from 'react';
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import './App.css';
import {drawMesh} from "./utility";

function App() {

  // Setup references
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  // Load facemesh
  const runFacemesh = async () => {
    const net = await facemesh.load({
      inputResolution:{width:800, height:600}, 
      scale:0.8,
    });
    setInterval(() => { 
      detect(net)}, 100);
  };

  // Detect function
  const detect = async (net) => {
    if (typeof webcamRef.current !== "undefined" &&
        webcamRef.current !== null &&
        webcamRef.current.video.readyState === 4) {
          // Get video properties
          const video = webcamRef.current.video;
          const videoWidth = webcamRef.current.video.videoWidth;
          const videoHeight = webcamRef.current.video.videoHeight;

          // Set vidieo width
          webcamRef.current.video.width = videoWidth;
          webcamRef.current.video.height = videoHeight;
          
          // Set canvas width
          canvasRef.current.width = videoWidth;
          canvasRef.current.height = videoHeight;

          // Make detections
          const face = await net.estimateFaces(video);
          console.log(face);
          
          // Get canvas context for drawing
          const ctx = canvasRef.current.getContext("2d");
          drawMesh(face, ctx);
        }
  }

  runFacemesh();

  // Set up webcam and canvas
  return (
    <div className='App'>  
      <header className='App-header'>
        <Webcam 
          ref={webcamRef}
          style={{
            position:"absolute",
            marginLeft:'auto',
            marginRight:'auto',
            left:0,
            right:0,
            textAlign:'center',
            zIndex:9,
            width:800,
            height:600
          }}/>

        <canvas
          ref={canvasRef}
          style={{
            position:"absolute",
            marginLeft:'auto',
            marginRight:'auto',
            left:0,
            right:0,
            textAlign:'center',
            zIndex:9,
            width:800,
            height:600
        }}/>
      </header>
    </div>
  );
}

export default App;