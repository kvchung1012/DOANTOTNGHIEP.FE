import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/service/cart/cart.service';
import { ProductInCart } from 'src/app/service/order/model/orderModel';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

    infoUser: any;
    isShowCart = false;
    constructor(public _cartService: CartService, public _router: Router) { }

    ngOnInit(): void {
        this.infoUser = this._cartService.getUserInfoByToken();
    }

    openCart(){
        this.isShowCart = true;
    }

    login(){
        this._router.navigate(['/dang-nhap'])
    }

    logout(){
        localStorage.removeItem('token');
        this._router.navigate(['/dang-nhap'])
    }
}
