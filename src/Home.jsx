import React from 'react'
import { Link } from 'react-router-dom'
import Button from '@mui/material/Button'
import { useTheme } from '@emotion/react'


const Home = () => {
  const theme  = useTheme()
  return (
    <div className='p-5'>

        <h1 className='text-3xl'>Welcome User!</h1>

      <div className='mt-5'>
     <Link to="/login"> <Button variant='contained'   >Login</Button></Link>
     <Link to="/signin">  <Button style={{background: theme.palette.secondary.main, color: theme.palette.secondary.contrastText}}>Register</Button> </Link>
      </div>





      
    </div>
  )
}

export default Home
