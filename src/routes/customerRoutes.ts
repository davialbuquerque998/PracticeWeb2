import { Router, Request, Response } from "express";
import {
  deleteCustomer,
  findCustomers,
  insertCustomer,
  updateCustomer,
  findCustomer,
} from "../config/db";

const customerRouter = Router();

const canadianProvinces: string[] = [
  "AB", "BC", "MB", "NB", "NL", "NS", "ON", 
  "PE", "QC", "SK", "NT", "NU", "YT"
];

customerRouter.get("/", async (req: Request, res: Response) => {
  try {
    const customers = await findCustomers();
    res.render("index", { customers, title: "All customers" });
    return;
  } catch (error) {
    res.render("error", {
      error: {
        title: "Error Loading Customers",
        message: "Unable to retrieve the customer list. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      }
    });
    return;
  }
});

customerRouter.get("/new", async (req: Request, res: Response) => {
  try {
    res.render("customer", { title: "Add New Customer", customer: {} });
    return;
  } catch (error) {
    res.render("error", {
      error: {
        title: "Error Loading Form",
        message: "Unable to load the new customer form. Please try again later.",
        details: error instanceof Error ? error.message : "Unknown error occurred",
      }
    });
    return;
  }
});

customerRouter.get("/edit/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const customer = await findCustomer(id);
    
    if (!customer) {
      throw new Error(`Customer with ID ${id} not found`);
    }
    
    res.render("customer", { title: "Edit Customer", customer });
    return;
  } catch (error) {
    res.render("error", {
      error: {
        title: "Error Loading Customer",
        message: "Unable to load the customer information. The customer might not exist or there was a server error.",
        details: error instanceof Error ? error.message : "Unknown error occurred",
        redirectUrl: "/customers",
        buttonText: "Back to Customer List"
      }
    });
    return;
  }
});

customerRouter.post("/", async (req: Request, res: Response) => {
  const customer = req.body;
  const { name, age, province, email, id } = customer;
  try { 

    // Validation
    const errors = [];
    if (!name) errors.push("Name is required");
    if (age <= 0) errors.push("Age must be positive");
    if (!canadianProvinces.includes(province)) errors.push("Invalid Province");
    if (!email) errors.push("Email is required");

    if (errors.length > 0) {
      throw new Error(errors.join(", "));
    }

    if (!id) {
      await insertCustomer(customer);
    } else {
      await updateCustomer(id, customer);
    }

    res.redirect("/customers");
    return;
  } catch (error) {
    res.render("error", {
      error: {
        title: "Error Saving Customer",
        message: "Unable to save the customer information. Please check the form and try again.",
        details: error instanceof Error ? error.message : "Unknown error occurred",
        redirectUrl: id ? `/customers/edit/${id}` : "/customers/new",
        buttonText: "Back to Form"
      }
    });
    return;
  }
});

customerRouter.get("/delete/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await deleteCustomer(id);
    res.redirect("/customers");
    return;
  } catch (error) {
    res.render("error", {
      error: {
        title: "Error Deleting Customer",
        message: "Unable to delete the customer. The customer might not exist or there was a server error.",
        details: error instanceof Error ? error.message : "Unknown error occurred",
        redirectUrl: "/customers",
        buttonText: "Back to Customer List"
      }
    });
    return;
  }
});

export { customerRouter };