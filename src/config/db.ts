import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI:string = `${process.env.MONGO_URI}`;

let singleton:Db;


export async function connectMongo():Promise<Db> {
    if(singleton) return singleton;

    const client:MongoClient = new MongoClient(MONGO_URI);
    await client.connect();

    

    singleton = client.db("test");

    console.log("Connected!");

    return singleton;

}


export async function findCustomers() {
    const db = await connectMongo();
    
    const customers = db.collection("customers").find().toArray();

    return customers;
}


export async function addCustomer() {
    const db = await connectMongo();

    await db.collection("customers").insertOne({});
}