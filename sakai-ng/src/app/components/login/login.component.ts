import { Component, OnInit, OnDestroy } from '@angular/core';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import { Subscription } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/service/auth/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles:[`
    :host ::ng-deep .p-password input {
    width: 100%;
    padding:1rem;
    }

    :host ::ng-deep .pi-eye{
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }

    :host ::ng-deep .pi-eye-slash{
      transform:scale(1.6);
      margin-right: 1rem;
      color: var(--primary-color) !important;
    }
  `]
})
export class LoginComponent implements OnInit, OnDestroy {

  valCheck: string[] = ['remember'];

  /*
    Tài khoản mật khẩu
  */
  userName : string;
  password: string;

  config: AppConfig;

  subscription: Subscription;

  constructor(public configService: ConfigService
            , public messageService: MessageService
            , public _authServie: AuthService
            , public _route:Router){ }

  ngOnInit(): void {
    this.config = this.configService.config;
    this.subscription = this.configService.configUpdate$.subscribe(config => {
      this.config = config;
    });
  }

  login(){
    if(!this.userName || !this.password ){
        this.messageService.add({severity:'danger', summary: 'Thất bại', detail: 'Tài khoản và mật khẩu không hợp lệ'});
        return;
    }

    this._authServie.login({
        userName : this.userName,
        password : this.password
    }).subscribe(res=>{
        localStorage.setItem('token',res.accessToken);
        this.messageService.add({severity:'success', summary: 'Thành công', detail: 'Chào mừng bạn đến với coffee house'});
        this._route.navigate(['/admin'])
    },err=>{
        this.messageService.add({severity:'warning', summary: 'Thất bại', detail: 'Tài khoản và mật khẩu không chính xác'});
    })
  }

  ngOnDestroy(): void {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }
}
