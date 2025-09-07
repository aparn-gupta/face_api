import React from 'react'
import { Button, Card, CardContent } from '@mui/material'
import Avatar from '@mui/material/Avatar';
import {Popper, Box} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {

   let   userName = sessionStorage.getItem("currentUserName")   ?? ""
    const navigate = useNavigate()

    const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
      if (sessionStorage.getItem("token")) {
 
      setAnchorEl(anchorEl ? null : event.currentTarget);
      }
    };

  
    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;
  return (
    <div >
       {/* <Card 
       > */}
      <CardContent className=' shadow-md h-20 flex justify-between' >
     <div>
     <h1 className="text-xl w-24 text-transparent bg-clip-text bg-gradient-to-l  from-fuchsia-500 via-green-500 to-blue-500 ">InnerNote</h1>
     <h3 className='text-zinc-400 text-base comic-neue-regular'>Your Safe Space for Your Feelings</h3>
     </div>


      <div>
      {/* <button aria-describedby={id} type="button" onClick={handleClick}>
  Toggle Popper
</button> */}

      <Avatar src="./abc.jpg" alt={userName} aria-describedby={id}  onClick={handleClick} >
        {/* {userName && userName.split[0]} */}

      </Avatar>

      <Popper id={id} open={open} anchorEl={anchorEl}>
  <Button variant='contained' color='error'  onClick={() => {sessionStorage.clear() 
    window.location.reload()
  }} >Log out</Button>
</Popper>
      </div>
      </CardContent>
       {/* </Card> */}
      
    </div>
  )
}

export default Navbar
