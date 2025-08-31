import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import { useTheme } from '@emotion/react'
import { Typography } from '@mui/material'


const Home = () => {
  const theme  = useTheme()
  return (
    <div className=''>

      <div className='relative w-screen h-screen'>

      
        {/* <img src='https://animesher.com/orig/1/140/1400/14003/animesher.com_kawaii-headers-header-1400342.gif' className='absolute top-0 left-0 w-full h-full object-cover' /> */}

        

        <img src='https://i.pinimg.com/originals/0e/80/3f/0e803ff6dbf0f871b957238c6e3df18b.gif' className='absolute top-0 left-0 w-full h-full object-cover' />


        {/* <img src='https://giffiles.alphacoders.com/758/75803.gif' className='absolute top-0 left-0 w-full h-full object-cover' /> */}

        <div className='w-full h-full absolute top-0 left-0 flex justify-center'>
          <div className='w-[60%] mx-auto h-[80%]  absolute bg-cloudy p-8 my-8 '>
          <Typography component='h5' variant='h5' >
<div className='comic-neue-regular'>
InnerNote is your personal safe space to capture thoughts, feelings, and reflections. Write with ease, organize your moments, and return whenever you need clarity. Simple, private, and made just for you — secured with face login so only you can unlock your space.
</div>

</Typography>


<div className='mt-20 flex justify-center'>
   <div className='flex-col w-52 gap-y-6'>
   <Link to="/login"> <Button variant='contained' size='large' sx={{textTransform: "capitalize", width: "100%", marginBottom: "1rem"}} >Login</Button></Link>
   <Link to="/signin">  <Button size='large' sx={{textTransform: "capitalize", width: "100%"}} style={{background: theme.palette.secondary.main, color: theme.palette.secondary.contrastText}}>Register</Button> </Link>
   </div>
      </div>

             </div>

        </div>
      </div>





     




      
    </div>
  )
}

export default Home
