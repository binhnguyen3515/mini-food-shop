import { AccountLog } from "./AccountLog";
import { Authority } from "./Authority";
import { Invoice } from "./Invoice";
import { MemberShip } from "./MemberShip";
import { Rating } from "./Rating";
import { WorkingLog } from "./WorkingLog";

export class User{
    id!:number;
    password!:string;
    name!:string;
    email!:string;
    phone!:string;
    address!:string;
    gender!:boolean;
    photo!:string;
    isDeleted!:boolean;

    memberShip!:MemberShip;

    rating!:Rating[];
    invoice!:Invoice[];
    authority!:Authority[];
    workingLog!:WorkingLog[];
    accountLog!:AccountLog[];

}