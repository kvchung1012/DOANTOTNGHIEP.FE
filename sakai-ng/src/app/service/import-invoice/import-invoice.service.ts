import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseParamModel, ListResult } from '../table/model/tableModel';
import { CreateImportInvoice, ImportInvoiceDto } from './model/ImportInvoiceDto';

@Injectable({
  providedIn: 'root'
})
export class ImportInvoiceService {

    baseUrl = `${environment.baseUrl}/ImportInvoice`

    constructor(public _http: HttpClient){

    }

    getData(baseParam:BaseParamModel){
        const _url = `${this.baseUrl}/GetListImportInvoice`;
        return this._http.post<ListResult<ImportInvoiceDto>>(_url,baseParam);
    }

    createImportInvoice(input: CreateImportInvoice){
        const _url = `${this.baseUrl}/CreateImportInvoice`;
        return this._http.post<number>(_url,input);
    }

    // getOrderById(id:number){
    //     const _url = `${this.baseUrl}/GetListOrderById/${id}`;
    //     return this._http.get<OrderFullDto>(_url);
    // }
}
