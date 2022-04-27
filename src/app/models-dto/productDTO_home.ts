import { CategorySub } from "../models/CategorySub";
import { DetailedPicutre } from "../models/DetailedPicture";
import { DetailedProduct } from "../models/DetailedProduct";
import { Discount } from "../models/Discount";
import { ImportInfo } from "../models/ImportInfo";
import { ProductInfo } from "../models/ProductInfo";
import { Rating } from "../models/Rating";
import { UnitType } from "../models/UnitType";
import { discountDTO } from "./discountDTO";
import { productDetailsDTO } from "./productDetailsDTO";
import { productInfoDTO } from "./productInfoDTO";

export class ProductDTO_home{
    id!:number;
    name!:string;
    picture!:string;
    description!:string;
    // brand!:string;
    // origin!:string;
    // isDeleted!:boolean;

    // unitType!:UnitType;
    categorySub!:CategorySub;
    starAveraged!:number;
    // detailedPicutre!:DetailedPicutre[];
    // importInfo!:ImportInfo[];
    // detailedProduct!:DetailedProduct[];
    // productInfo!:ProductInfo[];
    // discount!:Discount[];
    // rating!:Rating[];



    //DTO
    discountDTO!:discountDTO;
    productDetailsDTO!:productDetailsDTO;
    productInfoDTO!:productInfoDTO[];
}