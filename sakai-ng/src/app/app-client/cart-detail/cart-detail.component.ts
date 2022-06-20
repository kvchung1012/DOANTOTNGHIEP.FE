import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CartService } from 'src/app/service/cart/cart.service';
import { HomeService } from 'src/app/service/home/home.service';
import { CreateCartOrder, ProductInCart } from 'src/app/service/order/model/orderModel';
import { ProductDto } from 'src/app/service/product/model/productModel';
import { SaleCodeDto } from 'src/app/service/salecode/model/saleCodeDto';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-cart-detail',
    templateUrl: './cart-detail.component.html',
    styleUrls: ['./cart-detail.component.scss']
})
export class CartDetailComponent implements OnInit {

    saleCode: SaleCodeDto = null;
    createCart: CreateCartOrder;
    constructor(public _cartService: CartService
        , public _messageService: MessageService
        , public _homeSerive: HomeService) { }

    ngOnInit(): void {
        this.resetForm();
        console.log(this._cartService.getUserInfoByToken())
        if (this._cartService.getUserInfoByToken()) {
            this.createCart = {
                ...this.createCart,
                customerEmail: this._cartService.getUserInfoByToken().Email,
                customerPhone: this._cartService.getUserInfoByToken().Phone,
                customerName: this._cartService.getUserInfoByToken().FullName
            }
        }
    }

    resetForm() {
        this.createCart = {
            changeMoney: 0,
            customerEmail: '',
            customerName: '',
            customerPhone: '',
            products: [],
            receiveMoney: 0,
            totalMoney: 0
        }
    }

    addStock(product: ProductInCart) {
        this._cartService.addStock(product);
    }

    subStock(product: ProductInCart) {
        this._cartService.subStock(product);
    }

    /**
     *
     * @param product
     * @returns trả về số tiền được giảm giá của sản phẩm
     */
    caculatePriceDiscount(product: ProductDto) {
        if (product.value && product.value > 0 && product.price > 0) {
            if (product.saleType) {
                return product.price - product.value;
            }
            return product.price - product.price * (product.value / 100)
        }
        return product.price;
    }


    /**
     *
     * @param path
     * @returns lấy path của ảnh
     */
    getImagePath(path: string) {
        if (!path)
            return '../../../../assets/demo/no-image.png';
        return environment.baseUrl + path;
    }

    /**
     * Sự kiện bấm thanh toán giỏ hàng
     */
    createOrder() {
        if (this._cartService.getCart().length == 0) {
            this._messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Chưa chọn sản phẩm' });
            return;
        }
        if (!this.createCart.customerEmail || !this.createCart.customerPhone || !this.createCart.customerName) {
            this._messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Chưa điền đủ thông tin khách hàng' });
            return;
        }

        // pass in here

        this.createCart.products = this._cartService.getCart().map(x => {
            return {
                productId: x.product.id,
                stock: x.stock
            }
        })
        this._homeSerive.createCart(this.createCart).subscribe(res => {
            if (res.orderId > 0) {
                window.location.href = res.paymentUrl;
                this.resetForm();
                this._messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Đặt hàng thành công' });
            }
            else {
                this._messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Hệ thống lỗi' });
            }
        })
    }


    // mã giảm giá
    checkSaleCode() {
        if (this.createCart.saleCode) {
            this._homeSerive.checkSaleCode(this.createCart.saleCode).subscribe(res => {
                this.saleCode = res;
                if (!res) {
                    this._messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Mã giảm giá không hợp lệ' });
                }
            }, err => {
                console.log(err);
            })
        }
    }

    getPriceSale() {
        // giảm tiền mặt
        if (this.saleCode.saleType) {
            return this.saleCode.value;
        }
        else {
            return this._cartService.getTotalPriceCart() * (this.saleCode.value / 100)
        }
    }

    getPriceAfter() {
        return this._cartService.getTotalPriceCart() - this.getPriceSale();
    }

}
