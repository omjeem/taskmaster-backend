import express from 'express';
import cors from 'cors';
import mainRouter from './routes';
import dotenv from "dotenv"
import moment = require('moment-timezone');
moment.tz.setDefault('Asia/Kolkata');


dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api",mainRouter)

app.get("/",function(req,res){
    res.status(200).json("Request Recieved");
})

const port = process.env.PORT

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});