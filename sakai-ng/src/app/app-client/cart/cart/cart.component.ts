import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/service/cart/cart.service';
import { ProductInCart } from 'src/app/service/order/model/orderModel';
import { ProductDto } from 'src/app/service/product/model/productModel';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

    constructor(public _cartService: CartService, public _router: Router) { }

    ngOnInit(): void {
    }

    addStock(product:ProductInCart){
        this._cartService.addStock(product);
    }

    subStock(product:ProductInCart){
        this._cartService.subStock(product);
    }

    /**
     *
     * @param product
     * @returns trả về số tiền được giảm giá của sản phẩm
     */
     caculatePriceDiscount(product:ProductDto){
        if(product.value && product.value > 0 && product.price > 0){
          if(product.saleType){
              return product.price - product.value;
          }
          return product.price - product.price*(product.value/100)
        }
        return product.price;
    }


    /**
     *
     * @param path
     * @returns lấy path của ảnh
     */
    getImagePath(path:string){
        if(!path)
            return '../../../../assets/demo/no-image.png';
        return environment.baseUrl + path;
    }

    goCartDetail(){
        this._router.navigate(['gio-hang'])
    }

}
