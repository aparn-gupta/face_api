import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Slide, TextField, TextareaAutosize} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import {Card, CardContent, Typography, Box} from "@mui/material"


const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});






function Dashboard () {


  const moodsList = [
    { 
      mood: "Happy", 
      bgColor: "#FFE6A7",   // pastel yellow
      fontColor: "#B38600"  // darker golden yellow
    },
    { 
      mood: "Calm", 
      bgColor: "#A7D8FF",   // pastel sky blue
      fontColor: "#004C80"  // deep blue
    },
    { 
      mood: "Sad", 
      bgColor: "#C7CEEA",   // lavender
      fontColor: "#4B4D80"  // muted indigo
    },
    { 
      mood: "Anxious", 
      bgColor: "#FFD6D6",   // blush pink
      fontColor: "#802020"  // deep rose
    },
    { 
      mood: "Excited", 
      bgColor: "#FFD4A3",   // peach pastel
      fontColor: "#994C00"  // warm burnt orange
    },
    { 
      mood: "Optimistic", 
      bgColor: "#E0BBE4",   // lilac pastel
      fontColor: "#663366"  // deep plum
    },
    { 
      mood: "Grateful", 
      bgColor: "#B5EAD7",   // mint pastel
      fontColor: "#206050"  // dark teal green
    },
    { 
      mood: "Tired", 
      bgColor: "#F1E6FF",   // soft lavender-white
      fontColor: "#5A3D7A"  // rich violet
    }
  ];

  const findMoodColour = (moodName) => {
    return moodsList.find(item  => item.mood.toLocaleLowerCase() == moodName.toLocaleLowerCase())?.bgColor

  }

  const findMoodFontColour = (moodName) => {
    return moodsList.find(item  => item.mood.toLocaleLowerCase() == moodName.toLocaleLowerCase())?.fontColor

  }







    // const location  = useLocation()

    // const userData = location.state
    const navigate = useNavigate()
    useEffect(() => {
        if (!sessionStorage.getItem("token")) {
            navigate("/")
        }

        fetchFeelings()

    }, [])



    const user = sessionStorage.getItem("currentUserName")

    const serverAddress = import.meta.env.VITE_SERVER_ADDRESS

    // console.log(serverAddress)




  const [open, setOpen] = React.useState(false);
  const [allFeelingData, setAllFeelingData] =  useState([])

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  const sessionToken  = sessionStorage.getItem("token")

  // console.log(sessionToken)



  const fetchFeelings  = async () => {
    try {
      const feelingUrl  = `${serverAddress}/info/allfeelings`
      const response  = await fetch(feelingUrl, {
        method: 'GET',
        headers: {
          "Authorization" : `Bearer ${sessionToken}`
        }
      })

      const result  = await response.json()

      if (result.success) {
        setAllFeelingData(result.allFeelings)

        console.log(result)


      }



    } catch (err) {
      console.log(err)
    }
  }

   





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
           <h1 className="text-4xl  ">InnerNote</h1>
           <h3 className='text-zinc-400 text-xl'>Your Safe Space for Your Feelings</h3>
          <div className='flex justify-between'>
            <div className='mt-5'>
            <h1 className="text-3xl font-bold capitalize ">  Welcome {user} !</h1>
           
              

           

            </div>

            <div>
            <Button variant="contained" onClick={handleClickOpen} sx={{textTransform: 'capitalize'}}>
            <AddIcon />   <span className='ml-2'> New Journal Page</span>
      </Button>
           

           </div>

          </div>
            
            <div className='flex flex-wrap w-[90%] mx-auto justify-between space-y-6 mt-8'>
             {
              allFeelingData.map((item, i) => {
                return (
                  <Card key={i} sx={{width: "32%", background: findMoodColour(item.mood)}}>

                   





                  <CardContent>

        <Box sx={{display: "flex", justifyContent: "space-between"}}>
        <Typography gutterBottom sx={{ color: findMoodFontColour(item.mood), fontSize: 14 }}>
        {item.mood}
      </Typography>

      <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
        {item.post_time && <span> {new Date(item.post_time).toLocaleTimeString().slice(0, 5)},   {  new Date(item.post_time).toLocaleDateString()}</span>}
      </Typography>
        </Box>

  
                     <Typography gutterBottom variant="h5" component="div">
                     {item.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', height: "13rem" }} >
          {item.feeling_notes}
          </Typography>
                  </CardContent>
  
                </Card>
                )
              })
             }
              




              

               
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
          <h3> How are you feeling today?</h3>
           
          </DialogContentText>

          <form onSubmit={handleSubmit} id="subscription-form">
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
             slotProps={{maxlength: 795}}
            />

<div className='mt-5'>
<Button type="submit"  variant='contained' color='success' sx={{textTransform: 'capitalize'}}>Add to My Journal</Button>

</div>


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