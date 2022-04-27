import { DetailedInvoice } from "./DetailedInvoice";
import { ImportInfo } from "./ImportInfo";
import { Product } from "./Product";

export class DetailedProduct{
    id!:number;
    quantity!:number;
    priceSell!:number;
    available!:boolean;
    isDeleted!:boolean;
    dateRelease!:Date;
    dateEnd!:Date;

    product!:Product;
    importInfo!:ImportInfo;

    detailedInvoice!:DetailedInvoice[];
}