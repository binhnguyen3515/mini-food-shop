import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name:'pipeInvoice'})
export class PipeInvoiceStatus implements PipeTransform{
    transform(field: string) {
        if(field === 'Pending'){
            return "danger"
        }
        if(field === 'Shipping'){
            return "info"
        }
        return 'secondary'
    }
}