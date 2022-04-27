import { CartDetailDTO } from "./cartDetailDTO";

export class CartDTO{
    date!:Date;
    customerNotes!:string;
    phone!:string;
    address!:string;
    totalPayment!:number;
    totalPaymentNet!:number;
    status!:string;
    userId!:number;
    invoiceId!:number;
    detailedInvoice!:CartDetailDTO[];

}