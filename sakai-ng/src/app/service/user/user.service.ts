import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseParamModel, ListResult } from '../table/model/tableModel';
import { CreateUserRole, PositionByUser, UserDto, UserRole } from './model/UserDto';

@Injectable({
  providedIn: 'root'
})
export class UserService {

    baseUrl = `${environment.baseUrl}/User`
    constructor(public _http: HttpClient){

    }

    getData(baseParam:BaseParamModel){
        const _url = `${this.baseUrl}/GetListUser`;
        return this._http.post<ListResult<UserDto>>(_url,baseParam);
    }

    getRoleByUser(id:number){
        const _url = `${this.baseUrl}/GetListRoleByUser/${id}`;
        return this._http.get<UserRole[]>(_url);
    }

    createUserRole(input: CreateUserRole[]){
        const _url = `${this.baseUrl}/CreateUserRole`;
        return this._http.post<number>(_url,input);
    }

    getAllStaff(){
        const _url = `${this.baseUrl}/GetAllStaff`;
        return this._http.get<UserDto[]>(_url);
    }

    createOrUpdate(user:UserDto){
        const _url = `${this.baseUrl}/CreateUser`;
        return this._http.post<number>(_url,user);
    }

    getUserById(id:number){
        const _url = `${this.baseUrl}/GetUserById/${id}`;
        return this._http.get<UserDto>(_url);
    }

    getPositionByUserId(id:number){
        const _url = `${this.baseUrl}/GetPositionByUserId/${id}`;
        return this._http.get<PositionByUser[]>(_url);
    }

    // delete(id:number){
    //     const _url = `${this.baseUrl}/Delete/${id}`;
    //     return this._http.delete<ListResult<UserDto>>(_url);
    // }
}
