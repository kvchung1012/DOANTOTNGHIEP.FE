import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseParamModel, ListResult } from '../table/model/tableModel';
import { MaterialDto } from './model/materialModel';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {

    baseUrl = `${environment.baseUrl}/Material`
    constructor(public _http: HttpClient){

    }

    getData(baseParam:BaseParamModel){
        const _url = `${this.baseUrl}/GetListMaterial`;
        return this._http.post<ListResult<MaterialDto>>(_url,baseParam);
    }

    createOrUpdate(material:MaterialDto){
        const _url = `${this.baseUrl}/CreateUpdateMaterial`;
        return this._http.post<ListResult<boolean>>(_url,material);
    }

    delete(id:number){
        const _url = `${this.baseUrl}/Delete/${id}`;
        return this._http.delete<ListResult<boolean>>(_url);
    }
}
