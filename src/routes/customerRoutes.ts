import { Router, Request, Response } from "express";
import { findCustomers } from "../config/db";

const customerRouter = Router();


customerRouter.get("/", async (req:Request, res:Response) => {
    const customers = await findCustomers();

    res.render("index", {customers});
    return;
});

customerRouter.post("/", async (req:Request, res:Response) => {
    
})

export {
    customerRouter
}