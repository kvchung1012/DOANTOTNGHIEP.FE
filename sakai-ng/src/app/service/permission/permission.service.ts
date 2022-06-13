import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreatePermissionRole, PermissionDto, RoleDto } from './model/PermissionDto';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {

    baseUrl = `${environment.baseUrl}/Permission`
    baseCommonUrl = `${environment.baseUrl}/Common`
    constructor(public _http: HttpClient){

    }

    getAllRole(){
        return this._http.get<RoleDto[]>(`${this.baseUrl}/GetAllRole`)
    }

    getPermissionByRole(id:number){
        return this._http.get<PermissionDto[]>(`${this.baseUrl}/GetPermissionByRole/${id}`)
    }

    createPermissionRole(input: CreatePermissionRole[]){
        return this._http.post<number>(`${this.baseUrl}/CreatePermissionByRole`,input);
    }

    createRole(input: RoleDto){
        return this._http.post<number>(`${this.baseUrl}/CreateRole`,input);
    }
}
