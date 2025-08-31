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

const NewSignIn = () => {
  const serverAddress = import.meta.env.VITE_SERVER_ADDRESS;

  const webcamEl = useRef(null);

  const [formdata, setFormData] = useState([]);
  const [username, setUsername] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const [manualUsername, setManualUsername] = useState("");

  const [password, setPassword] = useState("");

  const [signInBtn, setSignInBtn] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);

  const navigate = useNavigate();

  const postfaceDataForSignIn = async () => {
    console.log(username);
    try {
      const response = await fetch(`${serverAddress}/auth/sendfacedata`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ empName: username, descriptorArray: formdata }),
      });

      const result = await response.json();

      if (result.success) {
        setSuccess(true);
      } 
    } catch (err) {
      console.log(err);
      setErrorAlertOpen(true);
      setErrorMessage(`Error signing in: ${result.message}`);
    }
  };

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
        if (webcamEl.current) {
          const detections = await faceapi
            .detectAllFaces(webcamEl.current)
            .withFaceLandmarks()
            .withFaceDescriptors();

          if (detections.length > 1) {
            setErrorAlertOpen(true);
            setErrorMessage(
              "Multiple faces detected. Please focus only one face in the view"
            );
            setSignInBtn(false);
          } else if (detections.length === 0) {
            setErrorAlertOpen(true);

            setErrorMessage(
              "No face detected. Please remove caps, masks, sunglassses that can hinder with face recognition"
            );
            setSignInBtn(false);
          } else {
            if (detections.length === 1) {
              setErrorAlertOpen(false);

              setSignInBtn(true);
            }
          }

          let faceWithBestDetection = detections[0];

          for (let each of detections) {
            if (each.detection.score > faceWithBestDetection) {
              faceWithBestDetection = each;
            }
          }

          let detectionScore = faceWithBestDetection.detection.score;

          if (detectionScore < 0.8) {
            setErrorMessage(
              "No face detected. Please remove caps, masks, sunglassses that can hinder with face recognition"
            );

            setErrorAlertOpen(true);

            setSignInBtn(false);
          } else {
            setDetectionScoreMessage("");
            setErrorAlertOpen(false);

            setSignInBtn(true);
          }

          const descriptorArrayResult = Array.from(detections[0].descriptor);

          setFormData(descriptorArrayResult);
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

  const handleSubmit = () => {
    console.log(formdata);

    postfaceDataForSignIn();
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    console.log({ manualUsername, password });

    try {
      const response = await fetch(`${serverAddress}/auth/signinwithpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ manualUsername, password }),
      });

      const result = await response.json();
      if (response.ok) {
        setSuccessAlertOpen(true);
      }
      setTimeout(() => {
        navigate("/login");
      }, 2000);

      console.log(result);
    } catch (err) {
      console.log(err);
      setErrorAlertOpen(true);
      setErrorMessage(`Error signing in: ${result.message}`);
    }
  };

  // console.log(descriptorArr)

  return (
    <div className="">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={successAlertOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessAlertOpen(false)}
      >
        <Alert variant="filled" severity="success" className="">
          Signed in successfully!
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

      <Navbar />

      <div>
        <h1 className="text-3xl mt-6">Create Your InnerNote Account</h1>
        <div className="flex justify-center">
          <div className="">
            <div className=" w-80 h-80 rounded-full flex justify-center animated-circle-border ">
              <div className="w-72 h-72 rounded-full my-auto">
                <video
                  autoPlay
                  width={2000}
                  height={2000}
                  ref={webcamEl}
                  className="w-72 h-72 rounded-full object-cover"
                ></video>
              </div>
            </div>

            <div>
              {" "}
              <h2 className="mb-5 text-center">
                {" "}
                Look in the camera and click Submit{" "}
              </h2>
            </div>

            <div className="flex gap-x-5 mt-10 mx-auto justify-center">
              <FormControl>
                <InputLabel htmlFor="my-input">Enter Username</InputLabel>
                <Input
                  id="my-input"
                  aria-describedby="my-helper-text"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>

              <Button
                size=""
                variant="contained"
                onClick={handleSubmit}
                style={{ display: signInBtn ? "block" : "none" }}
              >
                {" "}
                Submit{" "}
              </Button>
            </div>

            <div className="mt-10">
              <Button
                variant="text"
                color="success"
                sx={{ marginX: "1rem", textTransform: "" }}
                onClick={() => {
                  setIsExpanded((prev) => !prev);
                }}
              >
                {" "}
                Sign in using password{" "}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        className="shadow-2xl rounded-md h-[800px] absolute right-0 top-0 bg-white z-1000"
        variants={{ thin: { width: "0.5rem" }, broad: { width: "75vw" } }}
        initial="thin"
        animate={isExpanded ? "broad" : "thin"}
        transition={{ type: "tween", duration: 0.4, stiffness: 100 }}
      >
        <div className="p-5 mt-5 w-full flex justify-between">
          <Typography variant="h5" component="h5">
            Sign In with Password
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

export default NewSignIn;
