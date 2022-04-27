import { Role } from "./Role";
import { User } from "./Users";

export class Authority{
    id!:number;

    role!:Role;
    user!:User;
}