import  express from 'express';
import authroutes from './routes/Auth-routes.js'
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser';
import postroutes from './routes/Posts-routes.js';
const app = express();
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE','PATCH'],  
    allowedHeaders: ['Content-Type', 'Authorization']  
}));
dotenv.config();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1/Post",postroutes);
app.use("/api/v1/auth",authroutes)
mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log("MongoDB connected successfully");
}).catch((error) => {
    console.error("MongoDB connection error:", error);
});
app.get('/', (req, res) => {
    res.send('Hello World!');
    console.log(req);
}
);
app.listen(process.env.PORT,()=>{
console.log(`Server running on http://localhost:${process.env.PORT}`);
})


