import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField, TextareaAutosize} from '@mui/material';


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});






function Dashboard () {






    // const location  = useLocation()

    // const userData = location.state
    const navigate = useNavigate()
    useEffect(() => {
        if (!sessionStorage.getItem("token")) {
            navigate("/")
        }

    }, [])



    const user = sessionStorage.getItem("currentUserName")

    const serverAddress = import.meta.env.VITE_SERVER_ADDRESS

    // console.log(serverAddress)




  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const sessionToken  = sessionStorage.getItem("token")

  // console.log(sessionToken)

   





  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());
    // const email = formJson.email;
    console.log(formJson);
    try {
      const response =  await fetch(`${serverAddress}/info/newfeeling`, {
          method: 'POST',
          
          headers: {
              "Content-Type" : "application/json",
              "Authorization" : `Bearer ${sessionToken}`
          },
          body: JSON.stringify(formJson)

      })

      const result = await response.json()


      console.log(result)

  } catch (err) {
      console.log(err)

  }
    handleClose();
  };










    return (
        <div>
            <h1 className="text-4xl p-4 ">Dashboard</h1>
            <div className='h-screen  mt-4'>
               <h1> {user}</h1>

               <Button variant="outlined" onClick={handleClickOpen}>
        Slide in alert dialog
      </Button>
      <Dialog
        open={open}
        slots={{
          transition: Transition,
        }}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle></DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
           
          </DialogContentText>

          <form onSubmit={handleSubmit} id="subscription-form">
            <TextField
              autoFocus
              required
              margin="dense"
              id="title"
              name="title"
              label="Title"
              fullWidth
              variant="standard"
            />
             <TextField
              autoFocus
              required
              margin="dense"
              id="mood"
              name="mood"
              label="Mood"
              fullWidth
              variant="standard"
            />
            <TextField
              autoFocus
              required
              minRows={10}
              id="feelings"
              name="description"
              label="Feelings"
              fullWidth
              variant="standard"
            />

<Button type="submit">Add to My Journal</Button>



          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
        </DialogActions>
      </Dialog>

            </div>
        </div>
    )
}

export default Dashboard