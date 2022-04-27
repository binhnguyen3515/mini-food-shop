import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name:'isImage'})
export class PipeFilterImage implements PipeTransform{
    transform(field: any) {
        let fieldConvert = field as string;
        if(fieldConvert.includes('https://drive.google.com')){
            return true;
        }
        return false;
    }
}