import { Router, Request, Response } from "express";
import { deleteCustomer, findCustomers, insertCustomer, updateCustomer, findCustomer } from "../config/db";
import { Customer } from "../types/customerType";

const customerRouter = Router();

const canadianProvinces: string[] = [
    "AB", // Alberta
    "BC", // British Columbia
    "MB", // Manitoba
    "NB", // New Brunswick
    "NL", // Newfoundland and Labrador
    "NS", // Nova Scotia
    "ON", // Ontario
    "PE", // Prince Edward Island
    "QC", // Quebec
    "SK", // Saskatchewan
    "NT", // Northwest Territories
    "NU", // Nunavut
    "YT"  // Yukon
];
  


customerRouter.get("/", async (req:Request, res:Response) => {
    const customers = await findCustomers();

    console.log(customers);

    res.render("index", {customers, title:"All customers"});
    return;
});

customerRouter.get("/new", async (req:Request, res:Response) => {
    res.render("customer", {title:"Add New Customer", customer:{}});
    return
});

customerRouter.get("/edit/:id", async (req:Request, res:Response) => {
    const id = req.params.id as string;

    const customer = await findCustomer(id);

    console.log(customer,id);

    res.render("customer", {title:"Edit Customer", customer});
})

customerRouter.post("/", async (req:Request, res:Response) => {
    const customer = req.body as Customer;

    const {name, age, province, email} = customer;

    if(!name){
        res.redirect("/new?error=Your must type your name!");
        return;
    }

    if(age <= 0){
        res.redirect("/new?error=Age must be positive");
        return;
    }

    if(!canadianProvinces.includes(province)){
        res.redirect("/new?error=Invalid Province");
        return;
    }
    console.log(customer);
    await insertCustomer(customer);

    res.redirect("/customers");
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