import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { CartService } from 'src/app/service/cart/cart.service';
import { HomeService } from 'src/app/service/home/home.service';

@Component({
    selector: 'app-cart-result',
    templateUrl: './cart-result.component.html',
    styleUrls: ['./cart-result.component.scss'],

})
export class CartResultComponent implements OnInit {

    isDisable = true;
    result = false;
    msg = '';
    constructor(public homeService: HomeService
                , public _router: Router
                , public route: ActivatedRoute
                , public _cartService: CartService) { }

    ngOnInit(): void {
        var code = this.route.snapshot.queryParamMap.get("vnp_ResponseCode")
        this.result = code == "00";
        if (!this.result) {
            switch (code) {
                case "07":
                    this.msg = "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).";
                    break;
                case "09":
                    this.msg = "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.";
                    break;
                case "10":
                    this.msg = "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần";
                    break;
                case "11":
                    this.msg = "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.";
                    break;
                case "12":
                    this.msg = "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.";
                    break;
                case "13":
                    this.msg = "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.";
                    break;
                case "24":
                    this.msg = "Giao dịch không thành công do: Khách hàng hủy giao dịch";
                    break;

                case "51":
                    this.msg = "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.";
                    break;

                case "65":
                    this.msg = "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.";
                    break;
                case "75":
                    this.msg = "Ngân hàng thanh toán đang bảo trì.";
                    break;
                case "79":
                    this.msg = "Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch";
                    break;
                default:
                    this.msg = "Lỗi không xác định";
                    break;
            }
        }
        else{
            localStorage.removeItem('coffee-cart')


        }
        this.route.queryParams.subscribe(res => {
            let queryString = Object.keys(res).map(key => key + '=' + res[key]).join('&');
            this.homeService.returnCartResult(queryString).subscribe(result => {
                this.isDisable = false;
            });
        });
    }


    backHome() {
        this._router.navigate(['/'])
    }

    backCartDetai() {
        this._router.navigate(['/gio-hang'])
    }
}
