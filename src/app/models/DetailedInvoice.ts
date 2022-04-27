import { DetailedProduct } from "./DetailedProduct";
import { Invoice } from "./Invoice";

export class DetailedInvoice{
    id!: number;
    quantity!: number;
    price!: number;

    detailedProduct!:DetailedProduct;
    invoice!:Invoice;
}