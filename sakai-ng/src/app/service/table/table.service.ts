import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { SelectBoxDataDto, SystemTableColumn, SystemTableColumnDto } from './model/tableModel';
@Injectable()
export class TableColumnService {
    baseUrl = `${environment.baseUrl}/Common`
    constructor(public _http: HttpClient){

    }

    getListColumnTable(table:string){
        const _url = `${this.baseUrl}/GetListColumn/${table}`;
        return this._http.get<SystemTableColumn[]>(_url);
    }

    getListColumnFilterTable(table:string){
        const _url = `${this.baseUrl}/GetListColumnFilter/${table}`;
        return this._http.get<SystemTableColumnDto[]>(_url);
    }

    getMasterDataByGroupId(Id:number){
        const _url = `${this.baseUrl}/GetMasterDataByGroupId/${Id}`;
        return this._http.get<SelectBoxDataDto[]>(_url);
    }

    getSelectBoxData(table:string){
        const _url = `${this.baseUrl}/GetSelectBoxData/${table}`;
        return this._http.get<SelectBoxDataDto[]>(_url);
    }
}
