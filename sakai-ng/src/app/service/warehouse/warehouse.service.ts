import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseParamModel, ListResult } from '../table/model/tableModel';
import { CreateExportInvoiceDto, ExportInvoiceDto, GetWareHouse, MaterialDetailWareHouse, WareHouseDto } from './model/WareHouseDto';

@Injectable({
  providedIn: 'root'
})
export class WarehouseService {

    baseUrl = `${environment.baseUrl}/WareHouse`

    constructor(public _http: HttpClient){

    }

    getData(baseParam:GetWareHouse){
        const _url = `${this.baseUrl}/GetListWareHouse`;
        return this._http.post<ListResult<WareHouseDto>>(_url,baseParam);
    }

    getWarehouseDetail(id:number){
        const _url = `${this.baseUrl}/GetListWareHouseDetail/${id}`;
        return this._http.get<MaterialDetailWareHouse[]>(_url);
    }

    createExportInvoice(input: CreateExportInvoiceDto){
        const _url = `${this.baseUrl}/CreateExportInvoice`;
        return this._http.post<number>(_url,input);
    }

    getListExportInvoice(input: BaseParamModel){
        const _url = `${this.baseUrl}/GetListExportInvoice`;
        return this._http.post<ListResult<ExportInvoiceDto>>(_url,input);
    }

    // createCart(input: CreateCartOrder){
    //     const _url = `${this.baseUrl}/CreateOrder`;
    //     return this._http.post<number>(_url,input);
    // }

    // getOrderById(id:number){
    //     const _url = `${this.baseUrl}/GetListOrderById/${id}`;
    //     return this._http.get<OrderFullDto>(_url);
    // }
}
