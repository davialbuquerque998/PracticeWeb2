import { Db, MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { Customer } from "../types/customerType";
dotenv.config();

const MONGO_URI:string = `${process.env.MONGO_URI}`;

let singleton:any;


export async function connectMongo():Promise<Db> {
    if(singleton) return singleton;

    const client:MongoClient = new MongoClient(MONGO_URI);
   

    try {
        await client.connect();
        singleton = client.db("test");
        console.log("Connected!");
    } catch (error) {
        console.error(error);
        singleton = null;
    }

    return singleton;

}


export async function findCustomers() {
    const db = await connectMongo();
    
    const customers = db.collection("customers").find().toArray();

    return customers;
}

export async function findCustomer(id:string) {
    const objectId = ObjectId.createFromHexString(id);
    const db = await connectMongo();
    
    const customer = db.collection("customers").findOne({_id:objectId});

    return customer;
}



export async function insertCustomer(customer:Customer) {
    const db = await connectMongo();

    const result = await db.collection("customers").insertOne(customer);
    
    return result;
}


export async function updateCustomer(id:string, customer:Customer) {
    const objectId = ObjectId.createFromHexString(id);
    const db = await connectMongo();

    const result = await db.collection("customers").updateOne({_id:objectId}, {$set:customer});

    return result;
}


export async function deleteCustomer(id:string) {
    const objectId = ObjectId.createFromHexString(id);
    const db = await connectMongo();

    const result = await db.collection("customers").deleteOne({_id:objectId});

    return result;
}