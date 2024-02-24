import { PrismaClient } from "@prisma/client";
import { middleware } from "./middleware";

const { AddTodoBody, UpdateTodoBody } = require('../operation/zod');
const express = require('express');
const todoRouter = new express.Router();

const prisma = new PrismaClient();

todoRouter.get("/", middleware, async (req: any, res: any) => {


    const startDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date();
    endDate.setHours(23, 59, 59, 999);

    startDate.setMinutes(startDate.getMinutes() - 330);
    endDate.setMinutes(endDate.getMinutes() - 330);


    const todo = await prisma.todo.findMany({
        where: {
            userId: req.id,
            date: {
                gte: startDate,
                lte: endDate
            }

        }
    });
    const userInfo = await prisma.user.findFirst({
        where: {
            id: req.id
        }
    });
    res.status(200).json({
        todo,
        userInfo
    });
});

todoRouter.post("/add", middleware, async (req: any, res: any) => {

    const payLoad = req.body;
    try {
        const bodyParser = AddTodoBody.safeParse(payLoad);
        if (!bodyParser.success) {
            return res.status(400).send(bodyParser.error);
        }
        const isinsert = await prisma.todo.create({
            data: {
                title: bodyParser.data.title,
                userId: req.id,
                date: new Date(),
                tag: bodyParser.data.tag,
                priority: bodyParser.data.priority,
                ...(bodyParser.data.progress && { progress: bodyParser.data.progress }),
            } as any
        })
        if (!isinsert) {
            return res.status(500).send("Todo not created");
        }
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        startDate.setMinutes(startDate.getMinutes() - 330);
        endDate.setMinutes(endDate.getMinutes() - 330);

        const todos = await prisma.todo.findMany({
            select: {
                id: true,
                title: true,
                tag: true,
                priority: true,
                progress: true
            },
            where: {
                userId: req.id,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })
        return res.status(200).send(todos);
    } catch (err) {
        console.log(err)
        return res.status(500).send("Internal server error");
    }

})

todoRouter.post("/update", middleware, async (req: any, res: any) => {
    const payLoad = req.body;

    try {
        const bodyParser = UpdateTodoBody.safeParse(payLoad);
        if (!bodyParser.success) {
            return res.status(400).send(bodyParser.error);
        }
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);


        startDate.setMinutes(startDate.getMinutes() - 330);
        endDate.setMinutes(endDate.getMinutes() - 330);


        const isinsert = await prisma.todo.update({
            where: {
                id: payLoad.id,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            data: {
                ...(bodyParser.data.title && { title: bodyParser.data.title }),
                ...(bodyParser.data.tag && { tag: bodyParser.data.tag }),
                ...(bodyParser.data.priority && { priority: bodyParser.data.priority }),
                ...(bodyParser.data.progress && { progress: bodyParser.data.progress }),
            }
        })
        if (!isinsert) {
            return res.status(500).send("Todo not updated");
        }
        const todos = await prisma.todo.findMany({
            select: {
                id: true,
                title: true,
                tag: true,
                priority: true,
                progress: true
            },
            where: {
                userId: req.id,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })
        return res.status(200).send(todos);

    } catch (err) {
        return res.status(500).send("Internal server error / Record Not Present");
    }
});

todoRouter.post("/delete", middleware, async (req: any, res: any) => {
    try {
        const id = req.body.id;
        const startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date();
        endDate.setHours(23, 59, 59, 999);

        startDate.setMinutes(startDate.getMinutes() - 330);
        endDate.setMinutes(endDate.getMinutes() - 330);


        const isDelete = await prisma.todo.delete({
            where: {
                id: id,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            }
        })
        if (!isDelete) {
            return res.status(500).send("Todo not deleted");
        }
        const todo = await prisma.todo.findMany({
            where: {
                userId: req.id,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
            select: {
                id: true,
                title: true,
                tag: true,
                progress: true,
                priority: true
            }
        });
        return res.status(200).send(todo);
    } catch (err) {
        return res.status(500).send("Internal server error");
    }
});



todoRouter.post("/date", middleware, async (req: any, res: any) => {
    try {
        const specificDate = req.body.specificDate.startDate;


        const startDate = new Date(specificDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(specificDate);
        endDate.setHours(23, 59, 59, 999);


        startDate.setMinutes(startDate.getMinutes() - 330);
        endDate.setMinutes(endDate.getMinutes() - 330);

        const todos = await prisma.todo.findMany({
            where: {
                userId: req.id,
                date: {
                    gte: startDate,
                    lte: endDate
                }
            },
        });
        if (todos.length === 0) return res.status(404).send("No Todos found");
        return res.status(200).send(todos);
    } catch (err) {
        return res.status(500).send("Internal server error");
    }
});


export default todoRouter;