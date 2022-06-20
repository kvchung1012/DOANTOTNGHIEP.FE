import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';
import { AppConfig } from 'src/app/api/appconfig';
import { ConfigService } from 'src/app/service/app.config.service';
import { AuthService } from 'src/app/service/auth/auth.service';

@Component({
  selector: 'app-login-client',
  templateUrl: './login-client.component.html',
  styleUrls: ['./login-client.component.scss'],
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
export class LoginClientComponent implements OnInit {

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
          this._route.navigate(['/'])
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
