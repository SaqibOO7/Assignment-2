import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import expenseRoutes from "./routes/expense.routes.js"

import connectToMongoDB from './db/connectToMongoDb.js'


const app = express();

const PORT = process.env.PORT || 5000;

dotenv.config()

app.use(express.json());        //middle ware
app.use(cookieParser())


//FOR AUTHENTICATION
app.use('/api/auth', authRoutes)

//For user
app.use('/api/user', userRoutes)

//FOR Expenses
app.use('/api/expense', expenseRoutes)



app.listen(PORT, ()=>{
    connectToMongoDB();
    console.log(`Server is connected on port ${PORT}`);
})