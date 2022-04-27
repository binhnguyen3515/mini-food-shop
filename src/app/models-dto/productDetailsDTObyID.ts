import { CategorySub } from "../models/CategorySub";
import { DetailedPicutre } from "../models/DetailedPicture";
import { UnitType } from "../models/UnitType";
import { discountDTO } from "./discountDTO";
import { productDetailsDTO } from "./productDetailsDTO";
import { productInfoDTO } from "./productInfoDTO";
import { ratingDTO } from "./ratingDTO";

export class ProductDetailsDtoById{
    brand!:string;
    categorySub!:CategorySub;
    description!:string;
    discountDTO!:discountDTO;
    id!:string;
    name!:string;
    origin!:string;
    picture!:string;

    pictureDetails!:DetailedPicutre[];
    productDetailsDTO!:productDetailsDTO;
    productInfoDTO!:productInfoDTO;
    ratingDTO!:ratingDTO[];

    unitType!:UnitType;
    starAveraged!:number;
}