const express = require('express');
const userRouter = new express.Router();
const { SignUPBody, SignInBody, UpdateProfile } = require('../operation/zod');
const jwt = require('jsonwebtoken');

import { PrismaClient } from "@prisma/client";
import { middleware } from "./middleware";
import dotenv from "dotenv"
dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET

const prisma = new PrismaClient();



userRouter.get("/",middleware, async(req:any,res:any)=>{
     return res.status(200).json({message : "Authorized User"});
})

userRouter.post('/signup', async (req: any, res: any) => {
    const payLoad = req.body;
    const bodyParser = SignUPBody.safeParse(payLoad);
    if (!bodyParser.success) {
        return res.status(400).send(bodyParser.error);
    }
    try {
        const isinsert = await prisma.user.create({
            data: {
                email: bodyParser.data.email,
                firstName: bodyParser.data.firstName,
                lastName: bodyParser.data.lastName,
                password: bodyParser.data.password
            },
            select: {
                id : true,
                email: true,
                firstName: true,
                lastName: true
            }
        })
        if (!isinsert) {
            return res.status(409).send("User not created ")
        }
 
        const token = jwt.sign({id : isinsert.id},JWT_SECRET)
        return res.status(200).json({
            message: "User created successfully",
            token ,
            userInfo : {
                email : isinsert.email,
                firstName : isinsert.firstName,
                lastName : isinsert.lastName
            }
            
        })
    } catch (e) {
        return res.status(500).send("Email already exist")
    }
});

userRouter.post('/signin', async (req: any, res: any) => {
    const payLoad = req.body;
    const bodyParser = SignInBody.safeParse(payLoad);
    if (!bodyParser.success) {
        return res.status(400).send(bodyParser.error);
    }
    try {
        const isUserExist = await prisma.user.findFirst({
            where: {
                email: bodyParser.data.email,
                password: bodyParser.data.password
            }
        })
        if (!isUserExist) {
            return res.status(401).send("User not found")
        }
        const token = jwt.sign({ id: isUserExist.id }, JWT_SECRET);

        return res.status(200).json({
            message: "Logged in successfully",
            token: token,
            userInfo: {
                email: isUserExist.email,
                firstName: isUserExist.firstName,
                lastName: isUserExist.lastName
            }
        })
    } catch (e) {
        return res.status(500).send("Internal server error")
    }
}
);


userRouter.post("/update", middleware, async (req: any, res: any) => {
    const body = req.body
    const parser = UpdateProfile.safeParse(body);
    if (!parser) {
        return res(400).json({
            message: "Invalid Body"
        })
    }
    try {
        const update = await prisma.user.update({
            where: {
                id: req.id
            },
            data: {
                ...(parser.data.firstName && { firstName: parser.data.firstName }),
                ...(parser.data.lastName && { lastName: parser.data.lastName }),
                ...(parser.data.password && { password: parser.data.password })
            }, select: {
                email: true,
                firstName: true,
                lastName: true,
            }
        })
        return res.status(200).send(update);
    } catch (err) {
        return res.status(400).json({
            Error: err
        })
    }

})



export default userRouter;