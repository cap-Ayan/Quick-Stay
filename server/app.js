import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import { configDotenv } from 'dotenv'
import dbConnect from './config/dbConnect.js'
import { clerkMiddleware } from '@clerk/express'
import webHook from './controllers/clerckWebHooks.js'

const PORT =process.env.PORT || 3000

const app= express()

app.use(express.json())
app.use(clerkMiddleware())
app.use(cors())
configDotenv()

dbConnect()
app.use('/api/clerk' ,webHook) //API to listen to clerk webhooks

app.get('/',(req,res)=>{
    res.send('Hello World')

})



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)

})