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
// import Navbar from "./Navbar";
import Alert from "@mui/material/Alert";
import CheckIcon from "@mui/icons-material/Check";
import Snackbar from "@mui/material/Snackbar";
import CloseIcon from "@mui/icons-material/Close";
import loaderGif from './assets/pink-loader.gif'


const NewSignIn = () => {
  const serverAddress = import.meta.env.VITE_SERVER_ADDRESS;

  const webcamEl = useRef<HTMLVideoElement>(null);

  const [formdata, setFormData] = useState<any[]>([]);
  const [username, setUsername] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const [manualUsername, setManualUsername] = useState("");

  const [password, setPassword] = useState("");

  const [signInBtn, setSignInBtn] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successAlertOpen, setSuccessAlertOpen] = useState(false);
  const [errorAlertOpen, setErrorAlertOpen] = useState(false);

  const navigate = useNavigate();

  const streamRef = useRef<MediaStream>(null)

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
    }

    if (webcamEl.current) {
      webcamEl.current.srcObject = null
  }

  streamRef.current = null

}



  useEffect(() => {
    const startWebCam = async () => {
      try {
        streamRef.current = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: true,
        });

        if (webcamEl.current) {
          webcamEl.current.srcObject = streamRef.current;
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
          const detections: any[] = await faceapi
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
            return
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
            setErrorAlertOpen(false);

            setSignInBtn(true);
          }

          const descriptorArrayResult = Array.from(detections[0].descriptor);

          setFormData(descriptorArrayResult);
        }
      } catch (err) {
       
          setErrorAlertOpen(true)
        setErrorMessage(`Error reading face: ${err}`)

       
        
      }
    };

      setInterval(() => {
        findDescriptors();
      }, 3000);
  

  
  }, []);


  const postfaceDataForSignIn = async () => {
    console.log(username);
    try {
      const response = await fetch(`${serverAddress}/auth/registerface`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ empName: username, descriptorArray: formdata }),
      });

      const result: {success: boolean, message: string} = await response.json();
      console.log(result)

      if (result.success) {
        stopStream()
        setSuccessAlertOpen(true);
       setTimeout(() => {
        navigate("/login", {
          replace: true
        })
       }, 2500)
      }  else {
        setErrorAlertOpen(true);
        setErrorMessage(`Error signing in: ${result.message}`);

      }
    } catch (err) {
      console.log(err);
      setErrorAlertOpen(true);
      setErrorMessage(`Error signing in: ${err}`);
    }
  };


  const handleSubmit = () => {
    console.log(formdata);

    postfaceDataForSignIn();
  };

  const handlePasswordSubmit = async (e: { preventDefault: () => void; }) => {
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
      if (result.success) {
        stopStream()
        setSuccessAlertOpen(true);
        setTimeout(() => {
          navigate("/login", {
            replace: true
          });
        }, 2000);
      } else {
        setErrorAlertOpen(true)
      setErrorMessage(`Error signing in: ${result.message}`)

      }
    

      console.log(result);
    } catch (err) {
      console.log(err);
      setErrorAlertOpen(true);
      setErrorMessage(`Error signing in: ${err}`);
    }
  };

  // console.log(descriptorArr)

  return (
    <div className="px-8 comic-neue-regular">
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={successAlertOpen}
        autoHideDuration={3000}
        onClose={() => setSuccessAlertOpen(false)}
      >
        <Alert variant="filled" severity="success" className="">
          Signed in successfully! Please login now
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

      {/* <Navbar /> */}

      <div>
        <h1 className={`text-3xl mt-6 ${isExpanded && "w-44"}` }>Create Your InnerNote Account</h1>

        <div className="w-full flex justify-center">
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

        <div className="flex justify-center">

            <div>
            <div>
              {" "}
              <h2 className="mb-5 mt-8 text-center text-slate-600">
                {" "}
                Look in the web cam, type a username and hit Register Face when it appears{" "}
              </h2>
            </div>

            <div className="flex gap-x-5 mt-10 mx-auto justify-center">
              <FormControl>
                <InputLabel htmlFor="my-input">Enter Username</InputLabel>
                <Input
                  id="my-input"
                  aria-describedby="my-helper-text"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>

              <div  > <img src={loaderGif}  className={`${signInBtn ? 'hidden' : 'block'} w-12 h-12 mx-auto`} /> </div>

              <Button
                variant="contained"
                sx={{textTransform: "capitalize"}}
                onClick={handleSubmit}
                style={{ display: signInBtn ? "block" : "none" }}
              >
                {" "}
                Register Face{" "}
              </Button>
            </div>

            <div className="mt-16">
              <Button
                variant="text"
                style={{textTransform: "capitalize"}}
                color="info"
                sx={{ marginX: "1rem", textTransform: "" }}
                onClick={() => {
                  setIsExpanded((prev) => !prev);
                }}
              >
                {" "}
                Sign in using password{" "}
              </Button>

              <Button
                variant="text"
                style={{textTransform: "capitalize"}}
                color="secondary"
                sx={{ marginX: "1rem", textTransform: "" }}
                onClick={() => {
                 navigate("/login")
                }}
              >
                {" "}
               Already have an account? Log in
              </Button>
            </div>
            </div>
           

          
          </div>
      </div>

      <motion.div
        className="shadow-2xl rounded-md h-[800px] absolute right-0 top-0 bg-white z-1000"
        variants={{ thin: { width: "0.5rem" }, broad: { width: "70vw" } }}
        initial="thin"
        animate={isExpanded ? "broad" : "thin"}
        transition={{ type: "tween", duration: 0.4, stiffness: 100 }}
      >
        <div className="p-5 mt-5 w-full flex justify-between">
          <Typography variant="h5" component="h5">
          <div className="comic-neue-regular">
            Sign In with Password


            </div>
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
                required
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
                required
              />
            </div>

            <div className="mt-10">
              <Button
               style={{textTransform: "capitalize"}}
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
