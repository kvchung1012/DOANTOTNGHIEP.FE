import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Observable, of, throwError } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';

@Injectable()
export class AppInterceptor implements HttpInterceptor {

    constructor(private _mes: MessageService
            , private _router: Router
    ) {

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const requestId = Math.floor(Math.random() * (100000000 - 1) + 1);

        return next.handle(this.modifyRequest(req)).pipe(
            filter(event => event instanceof HttpResponse),
            catchError(error => {
                if (error instanceof HttpErrorResponse) {
                    if (error.status == HttpStatusCode.Unauthorized) {
                        // Refresh token here
                        // Pass
                        this._mes.add({ severity: 'error', summary: 'Lỗi', detail: error.error?.message || 'Thời gian đăng nhập hết hạn bạn cần đăng nhập lại!' });
                        if(req.url.includes('/Home/')){
                            this._router.navigate(['/dang-nhap'])
                        }
                        else{
                            this._router.navigate(['pages/login'])
                        }
                    }
                    else if(error.status == HttpStatusCode.Forbidden){
                        // không có quyền truy cập tài nguyên
                        this._router.navigate(['pages/access'])
                    }

                    console.log(error);
                    if (error.error) {
                        //Hiển thị lỗi trên các môi trường dev, testing
                        this._mes.add({ severity: 'error', summary: 'Lỗi', detail: error.error?.message || 'Không thể kết nối đến máy chủ, vui lòng kiểm tra lại đường truyền!' });
                        return throwError(error);
                    }
                }
                this._mes.add({ severity: 'error', summary: 'Lỗi', detail: 'Không thể kết nối đến máy chủ, vui lòng kiểm tra lại đường truyền!' });
                return throwError(error);
            })
        );
    }

    private modifyRequest(req: HttpRequest<any>) {
        if(req.url.endsWith('Common/UploadFileImage')){
            return req.clone({
                setHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
        }
        return req.clone({
            setHeaders: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json', }
        });
    }
}
