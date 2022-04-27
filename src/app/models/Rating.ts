import { Product } from "./Product";
import { User } from "./Users";

export class Rating{
    id!:number;
    date!:Date;
    comment!:string;
    star!:string;
    
    product!:Product;
    user!:User;
}