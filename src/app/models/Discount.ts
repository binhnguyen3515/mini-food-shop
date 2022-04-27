import { Product } from "./Product";

export class Discount{
    id!:number;
    startDate!:Date;
    endDate!:Date;
    percentage!:number;

    product!:Product;
}