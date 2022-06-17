import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductDto } from '../product/model/productModel';
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
}
