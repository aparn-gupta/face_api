import React, { useEffect, useState } from 'react'
import { useRef } from 'react'
import * as faceapi from "face-api.js"
import { useNavigate } from 'react-router-dom'
import {Input, Alert, InputLabel, Button, FormControl} from '@mui/material';






const NewLogIn = () => {

    const webcamEl = useRef(null)

    const canvasRef = useRef(null)

    const navigate = useNavigate()


  

    // const [currentUserId, setCurrentUserId] = useState("")
    // const [matchResult, setMatchResult] = useState()
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

     


        const findDescriptors = async () => {

            try {

                if (webcamEl.current && canvasRef.current) {

                    canvasRef.current.style.top = webcamEl.current.offsetTop + 'px'
                    canvasRef.current.style.left = webcamEl.current.offsetLeft + 'px'

                // webcamEl.current.onloadedmetadata(() => {
                    canvasRef.current.width = webcamEl.current.videoWidth
                    canvasRef.current.height = webcamEl.current.videoHeight

                // }) 
                // = () => {
                    
                // }

                  




                    const detections = await faceapi.detectAllFaces(webcamEl.current).withFaceLandmarks().withFaceDescriptors()

                    if (detections.length > 1) {
                        setMultiplefacesMessage("Multiple Faces detected. Please insert only one face in the cam")
                    } else if (detections.length === 0) {
                        setMultiplefacesMessage("No faces detected. Please insert face properly")

                    } else {
                        if (detections.length === 1) {
                            setMultiplefacesMessage("")


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
                    } else {
                        setDetectionScoreMessage("")
                    }



                    // console.log(detections)
                    console.log(detectionScore)


                      const ctx = canvasRef.current.getContext("2d")
                    ctx.clearRect(0, 0 , canvasRef.current.width, canvasRef.current.height)




                       const resizedDetections = faceapi.resizeResults(detections, {
                                  width: webcamEl.current.videoWidth,
                                  height: webcamEl.current.videoHeight
                                })

                                console.log(resizedDetections)
                                
 
                              
                    
                                // faceapi.draw.drawDetections(canvasRef.current, resizedDetections)

                                const options  = {
                                    label: "",
                                    lineWidth: 4,
                                    boxColor: 'blue'
                                }

                                // console.log(faceWithBestDetection.detection.box)

                                const drawBox = new faceapi.draw.DrawBox(faceWithBestDetection.detection.box, options)

                                drawBox.draw(canvasRef.current)





                    // console.log(detections[0].descriptor)
                    // console.log(detections[0].descriptor[0])
                    // const descriptorArrayResult = []

                    // for (let x = 0; x < 128; x++) {
                    //     descriptorArrayResult.push(faceWithBestDetection.descriptor[x])

                    // 

                    const descriptorArrayResult  = Array.from(faceWithBestDetection.descriptor)

                    console.log(descriptorArrayResult)

                    // console.log(JSON.stringify(descriptorArrayResult))
                    // console.log(detections[0].descriptor)


                    // setDescritorArr(detections[0].descriptor)
                    // setFormData(JSON.stringify(descriptorArrayResult))

                    // setFormData(descriptorArrayResult)
                    postfaceData(descriptorArrayResult)

                    // console.log("apple1")



                }

                // console.log("apple2")



            } catch (err) {
                console.log(err)
            }

        }


        const postfaceData = async (desArr) => {
            try {
                const response = await fetch("http://localhost:3608/loginface", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // body: JSON.stringify({descriptorArray: formdata})
                    body: JSON.stringify({ userFace: desArr })
    
                })
    
                const result = await response.json()

                // setMatchResult(result)
                setTimeout(() => {
                    // if (result.matchResult === true) navigate('/dashboard')
    
                }, 1500)
    
                // setRecognisedface(result.bestMatchFace, + "(" + result.indicator + ")") 
    
                console.log(result)
                sessionStorage.setItem("loggedUserData", JSON.stringify({userId: result.id, name: result.bestMatchFace, token: result.token}))
                if (result.success) {
                    navigate("/dashboard", {
                        state: {
                            username: result.bestMatchFace,
                            id: result.id
                        }
                    })
                }
    
            } catch (err) {
                console.log(err)
            }
        }
    
    
   


     let timeout =    setTimeout(() => {
            setInterval(() => {
                findDescriptors()
                // postfaceData()


            }, 2000)


        }, 3000)



        return () => {
            clearTimeout(timeout)

        }












    }, [])


 






    // console.log(descriptorArr)







    return (
        <div>

<Alert severity="success">This is a success Alert.</Alert>


            <h1 className='text-3xl'>Log In</h1>
            <h2 className='mb-5'> Look in the camera and click Log In </h2>

         <div className="comtainer" style={{position: "relative", display: "flex", justifyContent: "center" }}> 
         <video autoPlay width={600} height={500} ref={webcamEl} playsInline>


</video>

<canvas ref={canvasRef} style={{position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 10}}></canvas>
         </div>


            <div className='flex justify-center mt-3'>
               {/* <FormControl >
               <InputLabel htmlFor="login-id" >Enter Login Id </InputLabel>
               <Input id="login-id" onChange={(e) => setCurrentUserId(e.target.value)} />
               </FormControl> */}
            {/* <input className=' mt-5 border-2 ' onChange={(e) => setCurrentUserId(e.target.value)} /> */}
            {/* <Button  disabled={loginBtn} onClick={handleSubmit}> Login   </Button> */}

            </div>






            {/* <h1 className='text-3xl text-green-500 mt-5'>{recognisedFace}</h1> */}
            {/* <div className='text-3xl text-center mt-5'>{matchResult === true && <h1 className='text-green-500'>Face Matched!</h1> }</div> */}

            {/* <div className='text-3xl text-center mt-5'>{matchResult === false && <h1 className='text-red-500'>Face Did Not Match!</h1> }</div> */}



            <div className=' text-red-500text-center mt-5'> {multipleFacesMessage} </div>

            <div className=' text-red-500text-center mt-5'> {detectionScoreMessage} </div>



            



        </div>
    )
}

export default NewLogIn