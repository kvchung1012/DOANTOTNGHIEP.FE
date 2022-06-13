import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseParamModel, ListResult, SelectBoxDataDto } from '../table/model/tableModel';
import { ProductCreateDto, ProductDto } from './model/productModel';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

    baseUrl = `${environment.baseUrl}/Product`
    baseCommonUrl = `${environment.baseUrl}/Common`
    constructor(public _http: HttpClient){

    }

    getData(baseParam:BaseParamModel){
        const _url = `${this.baseUrl}/GetListProduct`;
        return this._http.post<ListResult<ProductDto>>(_url,baseParam);
    }

    createOrUpdate(product:ProductCreateDto){
        const _url = `${this.baseUrl}/CreateUpdateProduct`;
        return this._http.post<number>(_url,product);
    }

    delete(id:number){
        const _url = `${this.baseUrl}/Delete/${id}`;
        return this._http.delete<boolean>(_url);
    }

    upload(file):Observable<any> {
        const _url = `${this.baseCommonUrl}/UploadFileImage`
        const formData = new FormData();
        formData.append("file", file, file.name);
        return this._http.post(_url, formData)
    }

    getCombo(){
        const _url = `${this.baseUrl}/GetListCombo`;
        return this._http.get<SelectBoxDataDto[]>(_url);
    }

    getProductByCategory(id: number){
        const _url = `${this.baseUrl}/GetListProductByCategory/${id}`;
        return this._http.get<SelectBoxDataDto[]>(_url);
    }

    getById(id:number){
        const _url = `${this.baseUrl}/GetProductById/${id}`;
        return this._http.get<ProductCreateDto>(_url);
    }
}
