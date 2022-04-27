import { User } from "./Users";

export class WorkingLog{
    id!:number;
    date!:Date;
    action!:string;
    entity!:string;

    user!:User;
}