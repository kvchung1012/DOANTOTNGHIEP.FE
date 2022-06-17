import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ProductInCart } from '../order/model/orderModel';
import { ProductDto } from '../product/model/productModel';

@Injectable({
    providedIn: 'root'
})
export class CartService {

    carts: ProductInCart[] = []
    constructor(private jwtHelper :JwtHelperService) {
        this.carts = JSON.parse(!localStorage.getItem('coffee-cart') ? '[]' : localStorage.getItem('coffee-cart'));
    }

    /**
     *
     * @returns danh sách trong giỏ hàng
     */
    getCart(){
        return this.carts;
    }

    getTotalCart(){
        return this.carts.reduce((partialSum, a) => partialSum + a.stock, 0);
    }

    getTotalPriceCart(){
        return this.carts.reduce((partialSum, a) => partialSum + this.caculatePriceDiscount(a.product) * a.stock, 0);
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
     * thêm mới sản phẩm
     * @param product
     */
    addToCart(product:ProductDto){
        let productInCart = this.carts.find(x=>x.product.id == product.id);
        // trường hợp thêm mới 1 sản phẩm
        if(productInCart == null){
            this.carts.push({
                product : product,
                stock:1
            });
        }
        else{
            productInCart.stock++;
        }
        this.updateCartToLocalStorate();
    }

    /**
     *
     * @param item
     * Hàm tăng số lượng đơn hàng
     */
    addStock(item: ProductInCart) {
        item.stock++;
        this.updateCartToLocalStorate();
    }

    /**
     *
     * @param item
     * Hàm giảm số lượng đơn hàng
     */
    subStock(item: ProductInCart) {
        item.stock--;
        if (item.stock == 0 || item.stock < 0) {
            this.carts = this.carts.filter(x => x.product.id != item.product.id);
        }
        this.updateCartToLocalStorate();
    }

    updateCartToLocalStorate(){
        localStorage.setItem('coffee-cart',JSON.stringify(this.carts));
    }


    getUserInfoByToken(){
        return this.jwtHelper.decodeToken(localStorage.getItem('token'));
    }


}
