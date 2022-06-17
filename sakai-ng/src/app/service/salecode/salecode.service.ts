import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseParamModel, ListResult } from '../table/model/tableModel';
import { CreateSaleCodeDto, SaleCodeDto } from './model/saleCodeDto';

@Injectable({
  providedIn: 'root'
})
export class SalecodeService {

    baseUrl = `${environment.baseUrl}/SaleCode`

    constructor(public _http: HttpClient){

    }

    getData(baseParam:BaseParamModel){
        const _url = `${this.baseUrl}/GetListSaleCode`;
        return this._http.post<ListResult<SaleCodeDto>>(_url,baseParam);
    }

    getById(id:number){
        const _url = `${this.baseUrl}/GetById/${id}`;
        return this._http.get<CreateSaleCodeDto>(_url);
    }

    createOrUpdate(input: CreateSaleCodeDto){
        const _url = `${this.baseUrl}/CreateOrUpdate`;
        return this._http.post<number>(_url,input);
    }
}
