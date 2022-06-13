import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseParamModel, ListResult, SelectBoxDataDto } from '../table/model/tableModel';
import { CategoryDto } from './model/categoryModel';
@Injectable()
export class CategoryService {
    baseUrl = `${environment.baseUrl}/Category`
    constructor(public _http: HttpClient){

    }

    getData(baseParam:BaseParamModel){
        const _url = `${this.baseUrl}/GetListCategory`;
        return this._http.post<ListResult<CategoryDto>>(_url,baseParam);
    }

    createOrUpdate(category:CategoryDto){
        const _url = `${this.baseUrl}/CreateUpdateCategory`;
        return this._http.post<boolean>(_url,category);
    }

    delete(id:number){
        const _url = `${this.baseUrl}/Delete/${id}`;
        return this._http.delete<boolean>(_url);
    }

    getAll(){
        const _url = `${this.baseUrl}/GetAll`;
        return this._http.get<SelectBoxDataDto[]>(_url);
    }
}
