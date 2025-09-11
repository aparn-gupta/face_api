import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField,
  TextareaAutosize,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Card, CardContent, Typography, Box, Alert, Snackbar } from "@mui/material";
import DescriptionIcon from '@mui/icons-material/Description';
import type Feelings from "./types";
import Navbar from "./Navbar";

// const Transition = React.forwardRef(function Transition(props, ref) {
//   return <Slide direction="up" ref={ref} {...props} />;
// });

function Dashboard() {
  const moodsList = [
    {
      mood: "Happy",
      bgColor: "#FFE6A7", // pastel yellow
      fontColor: "#B38600", // darker golden yellow
    },
    {
      mood: "Calm",
      bgColor: "#A7D8FF", // pastel sky blue
      fontColor: "#004C80", // deep blue
    },
    {
      mood: "Sad",
      bgColor: "#C7CEEA", // lavender
      fontColor: "#4B4D80", // muted indigo
    },
    {
      mood: "Anxious",
      bgColor: "#FFD6D6", // blush pink
      fontColor: "#802020", // deep rose
    },
    {
      mood: "Excited",
      bgColor: "#FFD4A3", // peach pastel
      fontColor: "#994C00", // warm burnt orange
    },
    {
      mood: "Optimistic",
      bgColor: "#E0BBE4", // lilac pastel
      fontColor: "#663366", // deep plum
    },
    {
      mood: "Grateful",
      bgColor: "#B5EAD7", // mint pastel
      fontColor: "#206050", // dark teal green
    },
    {
      mood: "Tired",
      bgColor: "#F1E6FF", // soft lavender-white
      fontColor: "#5A3D7A", // rich violet
    },
  ];

  const findMoodColour = (moodName: string) => {
    return moodsList.find(
      (item) => item.mood.toLocaleLowerCase() == moodName.toLocaleLowerCase()
    )?.bgColor;
  };

  const findMoodFontColour = (moodName: string) => {
    return moodsList.find(
      (item) => item.mood.toLocaleLowerCase() == moodName.toLocaleLowerCase()
    )?.fontColor;
  };

  // const location  = useLocation()

  // const userData = location.state
  const navigate = useNavigate();
  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/");
    }

    fetchFeelings();
  }, []);

  const user = sessionStorage.getItem("currentUserName");
  const userId = sessionStorage.getItem("currentUserId");


  const serverAddress = import.meta.env.VITE_SERVER_ADDRESS;

  // console.log(serverAddress)

  const [open, setOpen] = React.useState(false);
  const [allFeelingData, setAllFeelingData] = useState<Feelings[]>([]);
     const [errorMessage, setErrorMessage] = useState("");
  
   
     const [successAlertOpen, setSuccessAlertOpen] = useState(false);
     const [errorAlertOpen, setErrorAlertOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const sessionToken = sessionStorage.getItem("token");

  // console.log(sessionToken)

  const fetchFeelings = async () => {
    try {
      const feelingUrl = `${serverAddress}/info/allfeelings`;
      const response = await fetch(feelingUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setAllFeelingData(result.allFeelings);

        console.log(result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (event: { preventDefault: () => void; currentTarget: HTMLFormElement | undefined; }) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    // const email = formJson.email;
    console.log(formJson);
    try {
      const response = await fetch(`${serverAddress}/info/newfeeling/${userId}`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(formJson),
      });

      const result = await response.json();

      if (result.sucess) {
        setSuccessAlertOpen(true);


      } else {
        setErrorAlertOpen(true)
      setErrorMessage(`Error logging in: ${result.message}`)

      }
  

      console.log(result);
    } catch (err) {
      console.log(err);
    }
    handleClose();
  };

  return (
    <div>

            <Snackbar
                    anchorOrigin={{ vertical: "top", horizontal: "center" }}
                    open={successAlertOpen}
                    autoHideDuration={3000}
                    onClose={() => setSuccessAlertOpen(false)}
                  >
                    <Alert variant="filled" severity="success" className="">
                      Journal record added!
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
      <div className="px-8">
        {/* <Navbar /> */}
        <div className="mt-5 flex justify-between">
          <h1 className="text-3xl font-bold capitalize "> Welcome  <span className="text-transparent bg-clip-text bg-gradient-to-l  from-fuchsia-500 via-green-500 to-blue-500 ">{user} </span> !</h1>

          <div>
            <Button
              variant="contained"
              onClick={handleClickOpen}
              sx={{ textTransform: "capitalize" }}
            >
              <DescriptionIcon />
            <span className="ml-2"> New Journal Page</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap w-[90%] mx-auto space-y-4 mt-8 ">
        {allFeelingData.map((item, i) => {
          return (
            <Card
              key={i}
              className="mx-2"
              sx={{ width: "32%", background: findMoodColour(item.mood) }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography
                    gutterBottom
                    sx={{ color: findMoodFontColour(item.mood), fontSize: 14 }}
                  >
                    {item.mood}
                  </Typography>

                  <Typography
                    gutterBottom
                    sx={{ color: "text.secondary", fontSize: 14 }}
                  >
                    {item.post_time && (
                      <span>
                        {" "}
                        {new Date(item.post_time)
                          .toLocaleTimeString()
                          .slice(0, 5)}
                        , {new Date(item.post_time).toLocaleDateString()}
                      </span>
                    )}
                  </Typography>
                </Box>

                <Typography gutterBottom variant="h5" component="div">
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  // className="inter-comicneu"
                  sx={{ color: "text.secondary", height: "13rem" }}
                >
                <div className="comic-neue-regular">  {item.feeling_notes}</div>
                </Typography>
              </CardContent>
            </Card>
          );
        })}

        <Dialog
          open={open}
          // slots={{
          //   transition: Transition,
          // }}
          keepMounted
          onClose={handleClose}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <h3> How are you feeling today?</h3>
            </DialogContentText>

            <form onSubmit={handleSubmit} id="subscription-form" className="comic-neue-regular ">
              <TextField
                autoFocus
                margin="dense"
                id="title"
                name="title"
                label="Title"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="mood"
                name="mood"
                label="Mood"
                fullWidth
                variant="standard"
              />
              <TextField
                autoFocus
                multiline
                minRows={10}
                id="feelings"
                name="description"
                label="Feelings"
                fullWidth
                variant="standard"
                inputProps={{ maxlength: 795 }}
                className="handlee-regular"
              />

              <div className="mt-5">
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  sx={{ textTransform: "capitalize" }}
                >
                  <AddIcon />   Add to My Journal
                </Button>
              </div>
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}> Cancel</Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
}

export default Dashboard;
