import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CreatePositionUserDto, PositionDetailDto, PositionDto, PositionUserDto } from './model/PositionDto';

@Injectable({
  providedIn: 'root'
})
export class PositionService {

    baseUrl = `${environment.baseUrl}/Position`
    constructor(public _http: HttpClient){

    }

    getAllPosition(){
        return this._http.get<PositionDto[]>(`${this.baseUrl}/GetListPosition`)
    }

    getListPositionById(id:number){
        return this._http.get<PositionDetailDto>(`${this.baseUrl}/GetListPositionById/${id}`)
    }

    createPosition(input:PositionDto){
        return this._http.post<number>(`${this.baseUrl}/CreateUpdate`,input)
    }

    checkStaffPosition(input: CreatePositionUserDto){
        return this._http.post<boolean>(`${this.baseUrl}/CheckStaffPosition`,input)
    }

    createStaffPosition(input: CreatePositionUserDto){
        return this._http.post<number>(`${this.baseUrl}/CreateStaffPosition`,input)
    }
}
