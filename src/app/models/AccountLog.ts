import { User } from "./Users";

export class AccountLog{
    id!:number;
    date!:Date;
    action!:string;
    description!:string;
    
    user!:User;
}