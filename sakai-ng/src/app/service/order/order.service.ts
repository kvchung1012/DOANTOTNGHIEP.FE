import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseParamModel, ListResult } from '../table/model/tableModel';
import { CreateCartOrder, OrderDto, OrderFullDto } from './model/orderModel';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

    baseUrl = `${environment.baseUrl}/Order`

    constructor(public _http: HttpClient){

    }

    getData(baseParam:BaseParamModel){
        const _url = `${this.baseUrl}/GetListOrder`;
        return this._http.post<ListResult<OrderDto>>(_url,baseParam);
    }

    createCart(input: CreateCartOrder){
        const _url = `${this.baseUrl}/CreateOrder`;
        return this._http.post<number>(_url,input);
    }

    getOrderById(id:number){
        const _url = `${this.baseUrl}/GetListOrderById/${id}`;
        return this._http.get<OrderFullDto>(_url);
    }
}
