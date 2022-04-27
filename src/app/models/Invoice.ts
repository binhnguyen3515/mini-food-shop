import { DetailedInvoice } from "./DetailedInvoice";
import { User } from "./Users";

export class Invoice{
    id!:number;
    date!:Date;
    customerNotes!:string;
    phone!:string;
    address!:string;
    totalPayment!:number;
    status!:string;

    user!:User;

    detailedInvoice!:DetailedInvoice[];
}