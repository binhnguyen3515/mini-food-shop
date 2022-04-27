import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name:'orderBy'})
export class CustomPipe implements PipeTransform{
    transform(array: any, field:string,sortType:string) {
        if (!Array.isArray(array)) {
            return;
        }
        array.sort((a: any, b: any) => {
            if(sortType==='desc' && a[field]>b[field]) {
                return -1;
            }
            if(sortType === 'asc'){
                return 1;
            }
            return 0;
        });
        return array;
    }
}