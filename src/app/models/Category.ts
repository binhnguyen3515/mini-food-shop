import { categorySubDTO } from "../models-dto/categorySubDTO";
import { CategorySub } from "./CategorySub";

export class Category{
    id!:number;
    name!:string;
    
    categorySub!:CategorySub[];
    //DTO
    categorySubDTO!:categorySubDTO[];
}