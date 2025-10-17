import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import dbConnect from './config/dbConnect.js'
import { clerkMiddleware } from '@clerk/express'
import webHook from './controllers/clerckWebHooks.js'
import userRouter from './routes/userRoutes.js'
import hotelRouter  from './routes/hotelRoute.js'    

const PORT =process.env.PORT || 3000

const app= express()

app.use(cors())
configDotenv()

dbConnect()
// Use express.raw() for the webhook route ONLY
app.post('/api/clerk', express.raw({type: 'application/json'}), webHook) //API to listen to clerk webhooks

app.use(express.json()) // Use express.json() for all other routes
app.use(clerkMiddleware())
app.use('/api/user',userRouter)
app.use('/api/hotel',hotelRouter)


app.get('/',(req,res)=>{
    res.send('Hello World')

})



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)

})