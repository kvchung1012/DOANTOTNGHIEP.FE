import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseParamModel, ListResult } from '../table/model/tableModel';
import { SupplierDto } from './model/supplierModel';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

    baseUrl = `${environment.baseUrl}/Supplier`
    constructor(public _http: HttpClient){

    }

    getData(baseParam:BaseParamModel){
        const _url = `${this.baseUrl}/GetListSupplier`;
        return this._http.post<ListResult<SupplierDto>>(_url,baseParam);
    }

    getAll(){
        const _url = `${this.baseUrl}/GetAll`;
        return this._http.get<SupplierDto[]>(_url);
    }

    createOrUpdate(category:SupplierDto){
        const _url = `${this.baseUrl}/CreateUpdateSupplier`;
        return this._http.post<ListResult<SupplierDto>>(_url,category);
    }

    delete(id:number){
        const _url = `${this.baseUrl}/Delete/${id}`;
        return this._http.delete<ListResult<SupplierDto>>(_url);
    }
}
