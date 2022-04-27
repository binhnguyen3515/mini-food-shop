import { ImportInfo } from "./ImportInfo";

export class Import{
    id!:string;
    date!:Date;
    address!:string;
    shipperName!:string;
    staffName!:string;
    picture!:string;
    isDeleted!:boolean;
    
    importInfo!:ImportInfo[];
}