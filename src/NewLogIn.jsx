import React, { useEffect, useState } from "react";
import { useRef } from "react";
import * as faceapi from "face-api.js";
import { Link, useNavigate } from "react-router-dom";
// import FormControl from '@mui/material/FormControl'
// import Button from '@mui/material/Button'
import {
  FormControl,
  Input,
  InputLabel,
  FormHelperText,
  Button,
  TextField,
  Box,
  Typography,
} from "@mui/material";
import { animate, motion } from "framer-motion";
import Navbar from "./Navbar";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";

const NewLogIn = () => {
  const webcamEl = useRef(null);

  const canvasRef = useRef(null);

  const navigate = useNavigate();

  const serverAddress = import.meta.env.VITE_SERVER_ADDRESS;

  
   const [errorMessage, setErrorMessage] = useState("");

 
   const [successAlertOpen, setSuccessAlertOpen] = useState(false);
   const [errorAlertOpen, setErrorAlertOpen] = useState(false);

  const [isExpanded, setIsExpanded] = useState(false);

  const [manualUsername, setManualUsername] = useState("");
    const [loginBtn, setLogInBtn] = useState(false);
    const [desArr, setDesArr] = useState()
  

  const [password, setPassword] = useState("");

  useEffect(() => {
    const startWebCam = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });

        if (webcamEl.current) {
          webcamEl.current.srcObject = stream;
          webcamEl.current.play();
        }
      } catch (err) {
        console.log(err);
      }
    };

    startWebCam();

    const findDescriptors = async () => {
      try {
        if (webcamEl.current && canvasRef.current) {
          canvasRef.current.style.top = webcamEl.current.offsetTop + "px";
          canvasRef.current.style.left = webcamEl.current.offsetLeft + "px";

          // webcamEl.current.onloadedmetadata(() => {
          canvasRef.current.width = webcamEl.current.videoWidth;
          canvasRef.current.height = webcamEl.current.videoHeight;

          // })
          // = () => {

          // }

          const detections = await faceapi
            .detectAllFaces(webcamEl.current)
            .withFaceLandmarks()
            .withFaceDescriptors();

            if (detections.length > 1) {
                setErrorAlertOpen(true)
                setErrorMessage(
                  "Multiple faces detected. Please focus only one face in the view"
                );
                setLogInBtn(false);
              } else if (detections.length === 0) {
                setErrorAlertOpen(true)
    
                setErrorMessage(
                  "No face detected. Please remove caps, masks, sunglassses that can hinder with face recognition"
                );
                setLogInBtn(false);
              } else {
                if (detections.length === 1) {
                    setErrorAlertOpen(false)
    
                  setLogInBtn(true);
                }
              }

              console.log(detections)

          let faceWithBestDetection = detections[0];

          for (let each of detections) {
            if (each.detection.score > faceWithBestDetection) {
              faceWithBestDetection = each;
            }
          }

          let detectionScore = faceWithBestDetection.detection.score;

          if (detectionScore < 0.8) {
            setErrorAlertOpen(true)
    
            setErrorMessage(
              "No face detected. Please remove caps, masks, sunglassses that can hinder with face recognition"
            );
          } 

          // console.log(detections)
          console.log(detectionScore);

        //   const ctx = canvasRef.current.getContext("2d");
        //   ctx.clearRect(
        //     0,
        //     0,
        //     canvasRef.current.width,
        //     canvasRef.current.height
        //   );

        //   const resizedDetections = faceapi.resizeResults(detections, {
        //     width: webcamEl.current.videoWidth,
        //     height: webcamEl.current.videoHeight,
        //   });

        //   console.log(resizedDetections);

        //   faceapi.draw.drawDetections(canvasRef.current, resizedDetections)

        //   const options = {
        //     label: "",
        //     lineWidth: 4,
        //     boxColor: "blue",
        //   };

        //   // console.log(faceWithBestDetection.detection.box)

        //   const drawBox = new faceapi.draw.DrawBox(
        //     faceWithBestDetection.detection.box,
        //     options
        //   );

        //   drawBox.draw(canvasRef.current);


          const descriptorArrayResult = Array.from(
            faceWithBestDetection.descriptor
          );

          console.log(descriptorArrayResult);
          setDesArr(descriptorArrayResult)

       
        //   postfaceData(descriptorArrayResult);

        }

      } catch (err) {
        console.log(err);
      }
    };


    let timeout = setTimeout(() => {
        setInterval(() => {
          findDescriptors();
        }, 2000);
      }, 3000);
  
      return () => {
        clearTimeout(timeout);
      };



  }, []);

  const postfaceData = async () => {
    console.log(desArr)
    try {
      const response = await fetch(`${serverAddress}/auth/loginface`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userFace: desArr }),
      });

      const result = await response.json();

   
      if (result.success) {
        console.log(result)
          setSuccessAlertOpen(true);

          sessionStorage.setItem("token", result.loginToken);
          sessionStorage.setItem("currentUserId", result.id);
          sessionStorage.setItem("currentUserName", result.bestMatchFace);
          navigate("/dashboard", {
            state: {
              username: result.bestMatchFace,
              id: result.id,
            },
          });
        } 
    
   

      console.log(result);

    } catch (err) {
      console.log(err);
        setErrorAlertOpen(true)
        setErrorMessage(`Error logging in: ${err}`)
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    console.log({ manualUsername, password });

    try {
      const response = await fetch(`${serverAddress}/auth/loginwithpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ manualUsername, password }),
      });

      const result = await response.json();

      if (result.success) {
        sessionStorage.setItem("token", result.token);
        sessionStorage.setItem("currentUserId", result.userId);
        sessionStorage.setItem("currentUserName", result.userName);

        navigate("/dashboard");
      }

      console.log(result);
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(descriptorArr)

  return (
    <div className="">
      <Navbar />
       <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={successAlertOpen}
              autoHideDuration={3000}
              onClose={() => setSuccessAlertOpen(false)}
            >
              <Alert variant="filled" severity="success" className="">
                Logged in successfully!
              </Alert>
            </Snackbar>
      
            <Snackbar
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
              open={errorAlertOpen}
              autoHideDuration={4000}
              onClose={() => setErrorAlertOpen(false)}
            >
                 <Alert variant="filled" severity="error">
                  {errorMessage}
      </Alert>
            </Snackbar>
            <h1 className="text-3xl mt-5">Log In to Your InnerNote Account</h1>

      <div className=" flex justify-center">
       
<div>

<div
          className="w-72 h-72 rounded-full my-auto flex justify-center  mt-10"
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <video
            autoPlay
            width={2000}
            height={2000}
            ref={webcamEl}
            playsInline
            className="w-72 h-72 rounded-full object-cover"
          ></video>

          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              pointerEvents: "none",
              zIndex: 10,
            }}
          ></canvas>
        </div>
        


   
     <h2 className="my-5 text-center"> Look in the camera and click Submit </h2>
     <div className=" flex justify-center">

<Button
              size=""
              variant="contained"
              onClick={postfaceData}
              // style={{ display: loginBtn ? "block" : "none" }}
            >
              {" "}
              Submit{" "}
            </Button>
     </div>

      
</div>



      </div>


    <div className="flex justify-center mt-10">
    <Button
          variant="text"
          color="success"
          sx={{ marginX: "1rem" }}
          onClick={() => {
            setIsExpanded((prev) => !prev);
          }}
        >
          {" "}
          Log In in using password{" "}
        </Button>
    </div>

      <motion.div
        className="shadow-2xl rounded-md h-[800px] absolute right-0 top-0 bg-white"
        variants={{ thin: { width: "0.5rem" }, broad: { width: "75vw" } }}
        initial="thin"
        animate={isExpanded ? "broad" : "thin"}
        transition={{ type: "tween", duration: 0.4, stiffness: 100 }}
      >
          <div className="p-5 mt-5 w-full flex justify-between">
          <Typography variant="h5" component="h5">
            Log In In with Password
          </Typography>

          <Button onClick={() => setIsExpanded(false)}>
            <CloseIcon />
          </Button>
        </div>
        <FormControl>
          <Box margin={10}>
            <div>
              <TextField
                id="username-manual"
                label="Username"
                variant="standard"
                onChange={(e) => setManualUsername(e.target.value)}
                className="w-80"
              />
            </div>

            <div className="mt-5">
              <TextField
                id="username-manual"
                type="password"
                label="Password"
                variant="standard"
                onChange={(e) => setPassword(e.target.value)}
                className="w-80"
              />
            </div>

            <div className="mt-10">
              <Button
                variant="contained"
                color="secondary"
                onClick={handlePasswordSubmit}
              >
                {" "}
                Submit{" "}
              </Button>
            </div>
          </Box>
        </FormControl>
      </motion.div>
    </div>
  );
};

export default NewLogIn;
