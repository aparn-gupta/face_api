import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import * as faceapi from "face-api.js"
import { Link } from 'react-router-dom'
// import FormControl from '@mui/material/FormControl'
// import Button from '@mui/material/Button'
import {FormControl, Input, InputLabel, FormHelperText, Button } from "@mui/material"


const NewSignIn = () => {

    const webcamEl = useRef(null)


    const [formdata, setFormData] = useState([])
    const [username, setUsername] = useState("")

    const [signInBtn, setSignInBtn] = useState(false)

    const [success, setSuccess] = useState(false)

    const [message, setMessage] = useState("")

     const [multipleFacesMessage, setMultiplefacesMessage] = useState("")
        const [detectionScoreMessage, setDetectionScoreMessage] = useState("")




    useEffect(() => {

        const startWebCam = async () => {


            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: false,
                    video: true
                })

                if (webcamEl.current) {
                    webcamEl.current.srcObject = stream
                    webcamEl.current.play()


                }

            } catch (err) {
                console.log(err)
            }

        }


        startWebCam()

        const loadModels = async () => {
            try {
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
                    faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
                    faceapi.nets.faceRecognitionNet.loadFromUri('/models'),

                ])

                console.log("models loaded")

            } catch (err) {
                console.log(err)
            }
        }

        loadModels()


        const findDescriptors = async () => {

            try {

                if (webcamEl.current) {
                    const detections = await faceapi.detectAllFaces(webcamEl.current).withFaceLandmarks().withFaceDescriptors()

                    // const descriptorArrayResult = []

                    // for (let x = 0; x < 128; x++) {
                    //     descriptorArrayResult.push(detections[0].descriptor[x])

                    // }

                    
                                        if (detections.length > 1) {
                                            setMultiplefacesMessage("Multiple Faces detected. Please insert only one face in the cam")
                                            setSignInBtn(false)
                                        } else if (detections.length === 0) {
                                            setMultiplefacesMessage("No faces detected. Please insert face properly")
                                            setSignInBtn(false)

                    
                                        } else {
                                            if (detections.length === 1) {
                                                setMultiplefacesMessage("")
                                                setSignInBtn(true)

                    
                    
                                            }
                                        }
                    
                    
                                        let faceWithBestDetection = detections[0]
                    
                                        for (let each of detections) {
                                            if (each.detection.score > faceWithBestDetection) {
                                                faceWithBestDetection = each
                                            }
                                        }
                    
                                        let detectionScore = faceWithBestDetection.detection.score
                    
                    
                    
                                        if (detectionScore < 0.8) {
                                            setDetectionScoreMessage("Face not detected. Please insert your face properly")
                                            setSignInBtn(false)

                                        } else {
                                            setDetectionScoreMessage("")
                                            setSignInBtn(true)

                                        }
                    
                    

                    const descriptorArrayResult  = Array.from(detections[0].descriptor)

                    console.log(descriptorArrayResult)


                    // setDescritorArr(detections[0].descriptor)
                    setFormData(descriptorArrayResult)




                }




            } catch (err) {
                console.log(err)
            }

        }


        setInterval(() => {
            findDescriptors()

        }, 2000)












    }, [])




    const postfaceDataForSignIn = async () => {
        console.log(username)
        try {
            const response = await fetch("http://localhost:3608/sendfacedata", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ empName: username, descriptorArray: formdata })

            })

            const result = await response.json()

            if (result.success)  {
                setSuccess(true) 
            } else {
                setMessage(result.message)

            }


               


        } catch (err) {
            console.log(err)
        }
    }

    const handleSubmit = () => {
        console.log(formdata)

        postfaceDataForSignIn()

    }






    // console.log(descriptorArr)







    return (
<div>

<h1 className='text-3xl'>Register</h1>
<h2 className='mb-5'> Look in the camera and click Submit </h2>
<div className='flex justify-center'>


<div className=''>


<div className=' w-80 h-80 rounded-full flex justify-center animated-circle-border ' >
<div className='w-72 h-72 rounded-full my-auto'>
<video autoPlay width={2000} height={2000} ref={webcamEl} className='w-72 h-72 rounded-full object-cover' >


</video>
</div>
</div>

<FormControl>
  <InputLabel htmlFor="my-input">Enter Username</InputLabel>
  <Input id="my-input" aria-describedby="my-helper-text"  onChange={(e) => setUsername(e.target.value)}  />
  {/* <FormHelperText id="my-helper-text">We'll never share your email.</FormHelperText> */}
</FormControl>


{/* <label className=''> Enter Username</label>
<br/>

<input className='input mt-5 ' onChange={(e) => setUsername(e.target.value)} />
<br/> */}

<Button variant="contained" style={{display :  signInBtn ? "block" : "none" }} onClick={handleSubmit}> Submit Face Data   </Button>

<Button variant="contained" color='success' sx={{marginX: "1rem"}} > Sign in using password   </Button>


{
    success && <div>
    <h1 className='text-3xl text-green-500'> Face data registered</h1>
    <br/>
    <Link to="/login"><button className='btn btn-primary'>  Login </button></Link>
    
    </div>
}

{
    <div className='text-3xl text-red-500 mt-5'> {message} </div>
}


<div className=' text-red-500text-center mt-5'> {multipleFacesMessage} </div>

<div className=' text-red-500text-center mt-5'> {detectionScoreMessage} </div>
</div>






</div>
</div>
    )
}

export default NewSignIn
