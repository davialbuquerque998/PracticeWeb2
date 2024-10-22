import { Router, Request, Response } from "express";
import { deleteCustomer, findCustomers, insertCustomer, updateCustomer } from "../config/db";
import { Customer } from "../types/customerType";

const customerRouter = Router();


customerRouter.get("/", async (req:Request, res:Response) => {
    const customers = await findCustomers();

    console.log(customers);

    res.render("index", {customers});
    return;
});

customerRouter.post("/", async (req:Request, res:Response) => {
    const customer = req.body as Customer;

    await insertCustomer(customer);

    res.redirect(200, "/");
    return;
});


customerRouter.put("/:id", async (req:Request, res:Response) => {
    const customer = req.body as Customer;

    const id = req.params.id as string;

    await updateCustomer(id, customer);

    res.redirect(201, "/");
    return;
});


customerRouter.delete("/:id", async (req:Request, res:Response) => {
    

    const id = req.params.id as string;

    await deleteCustomer(id);

    res.redirect(201, "/");
    return;
});

export {
    customerRouter
}