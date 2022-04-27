import { Product } from "./Product";

export class ProductInfo{
    id!:number;
    weight!:string;
    guide!:string;
    note!:string;
    component!:string;
    capacity!:number;
    others!:string;
    usage!:string;

    product!:Product;
}