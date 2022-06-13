import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseParamModel, ListResult } from '../table/model/tableModel';
import { CreateDiscountDto, GetDetailDiscount } from './model/discountModel';

@Injectable({
  providedIn: 'root'
})
export class DiscountService {

    baseUrl = `${environment.baseUrl}/Discount`

    constructor(public _http: HttpClient){

    }

    getData(baseParam:BaseParamModel){
        const _url = `${this.baseUrl}/GetListDiscount`;
        return this._http.post<ListResult<DiscountService>>(_url,baseParam);
    }

    createDiscount(discount: CreateDiscountDto){
        const _url = `${this.baseUrl}/CreateOrUpdate`;
        return this._http.post<number>(_url,discount);
    }

    getDiscountById(id:number){
        const _url = `${this.baseUrl}/GetDiscountById/${id}`;
        return this._http.get<CreateDiscountDto>(_url);
    }

}
