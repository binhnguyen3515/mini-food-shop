import { discountDTO } from "../models-dto/discountDTO";
import { productDetailsDTO } from "../models-dto/productDetailsDTO";
import { productInfoDTO } from "../models-dto/productInfoDTO";
import { CategorySub } from "./CategorySub";
import { DetailedPicutre } from "./DetailedPicture";
import { DetailedProduct } from "./DetailedProduct";
import { Discount } from "./Discount";
import { ImportInfo } from "./ImportInfo";
import { ProductInfo } from "./ProductInfo";
import { Rating } from "./Rating";
import { UnitType } from "./UnitType";

export class Product{
    id!:number;
    name!:string;
    picture!:string;
    description!:string;
    brand!:string;
    origin!:string;
    isDeleted!:boolean;

    unitType!:UnitType;
    categorySub!:CategorySub;

    detailedPicutre!:DetailedPicutre[];
    importInfo!:ImportInfo[];
    detailedProduct!:DetailedProduct[];
    productInfo!:ProductInfo[];
    discount!:Discount[];
    rating!:Rating[];

    //DTO
    discountDTO!:discountDTO;
    productDetailsDTO!:productDetailsDTO;
    productInfoDTO!:productInfoDTO[];
}