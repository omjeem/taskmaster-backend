import todoRouter from "./todo";
import userRouter from "./user";


const express = require('express');

const mainRouter = new express.Router();
 
mainRouter.use("/todo",todoRouter);
mainRouter.use('/user', userRouter);

export default mainRouter;