import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ProductDto } from '../product/model/productModel';
import { TotalSystem } from './model/DashboardDto';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

    baseUrl = `${environment.baseUrl}/Dashboard`

    constructor(public _http: HttpClient){

    }

    getCountSystem(){
        const _url = `${this.baseUrl}/GetTotalSystem`;
        return this._http.get<TotalSystem>(_url);
    }

    getTopProduct(){
        const _url = `${this.baseUrl}/GetTopProduct`;
        return this._http.get<ProductDto[]>(_url);
    }

    getRevueneByYear(year){
        const _url = `${this.baseUrl}/GetRevueneByYear/${year}`;
        return this._http.get<number[]>(_url);
    }

    getRevueneByMonth(year,month){
        const _url = `${this.baseUrl}/GetRevueneByMonth/${year}/${month}`;
        return this._http.get<number[]>(_url);
    }
}
