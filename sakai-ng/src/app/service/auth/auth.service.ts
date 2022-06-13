import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseParamModel, ListResult } from '../table/model/tableModel';
import { LoginModel, TokenResult } from './model/loginModel';
@Injectable()
export class AuthService {
    baseUrl = `${environment.baseUrl}/Auth`
    constructor(public _http: HttpClient){

    }

    login(loginModel:LoginModel){
        const _url = `${this.baseUrl}/Login`;
        return this._http.post<TokenResult>(_url,loginModel);
    }
    

    checkToken(){
        const _url = `${this.baseUrl}/InitApp/${localStorage.getItem('token')}`;
        return this._http.get<TokenResult>(_url);
    }
}
