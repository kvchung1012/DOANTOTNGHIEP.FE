import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "./service/auth/auth.service";

@Injectable()
export class AppInitService {

    constructor(public _authService: AuthService
              , public _router: Router) {
    }

    Init() {
        return new Promise<boolean>((resolve, reject) => {
            console.log('checking app...')
            this._authService.checkToken().subscribe(res=>{
                console.log('init app success')
                // this._router.navigate(['/'])
                resolve(true);
            },
            err=>{
                console.log('unauthorize',err)
                this._router.navigate(['pages/login'])
                resolve(true);
            })
        });
    }
}
