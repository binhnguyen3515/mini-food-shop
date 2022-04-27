import { DetailedProduct } from "./DetailedProduct";
import { Import } from "./Import";
import { Product } from "./Product";

export class ImportInfo{
    id!:number;
    priceImport!:number;
    quantityImport!:number;
    status!:string;

    import!:Import;
    product!:Product;

    detailedProduct!:DetailedProduct[];
}