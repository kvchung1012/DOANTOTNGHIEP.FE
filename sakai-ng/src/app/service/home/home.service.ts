import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ParamMap } from '@angular/router';
import { environment } from 'src/environments/environment';
import { CreateCartOrder } from '../order/model/orderModel';
import { ProductDto } from '../product/model/productModel';
import { SaleCodeDto } from '../salecode/model/saleCodeDto';
import { ListResult, SelectBoxDataDto } from '../table/model/tableModel';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

    baseUrl = `${environment.baseUrl}/Home`
    constructor(public _http: HttpClient){

    }

    getListCategory(){
        const _url = `${this.baseUrl}/danh-sach-danh-muc`;
        return this._http.get<SelectBoxDataDto[]>(_url);
    }

    getListProduct(categoryId:number, fetch:number, offset: number){
        const _url = `${this.baseUrl}/danh-sach-san-pham?categoryId=${categoryId}&fetch=${fetch}&offset=${offset}`;
        return this._http.get<ListResult<ProductDto>>(_url);
    }

    getTopProduct(){
        const _url = `${this.baseUrl}/danh-sach-san-pham-noi-bat`;
        return this._http.get<ProductDto[]>(_url);
    }

    createCart(input: CreateCartOrder){
        const _url = `${this.baseUrl}/tao-gio-hang`;
        return this._http.post<any>(_url,input);
    }

    checkSaleCode(code:string){
        const _url = `${this.baseUrl}/kiem-tra-ma-giam-gia/${code}`;
        return this._http.get<SaleCodeDto>(_url);
    }

    returnCartResult(params){
        const _url = `${this.baseUrl}/ket-qua-thanh-toan?${params}`;
        return this._http.get(_url);
    }
}
