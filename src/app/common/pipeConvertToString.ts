import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name:'toStringConverter'})
export class PipeConvertToString implements PipeTransform{
    transform(field: any) {
        return field as string;
    }
}