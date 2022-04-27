import { User } from "../models/Users";

export class ratingDTO{
    comment!:string;
    date!:Date;
    id!:number;
    star!:number;
    user!:User;
}