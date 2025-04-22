import  express from 'express';
// import  router from './routes/Posts-routes.js';
import authroutes from './routes/Auth-routes.js'
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',  // Your frontend URL
    credentials: true,  // This allows cookies to be sent and received
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Make sure your methods are allowed
    allowedHeaders: ['Content-Type', 'Authorization']  // Ensure these headers are allowed
}));
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/api/v1/Post",router);
app.use("/api/v1/auth",authroutes)
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected successfully");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});
app.listen(process.env.PORT,()=>{
console.log(`Server running on http://localhost:${process.env.PORT}`);
})


