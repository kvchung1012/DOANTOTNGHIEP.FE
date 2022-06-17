import { Component, HostListener, OnInit } from '@angular/core';
import { CartService } from 'src/app/service/cart/cart.service';
import { HomeService } from 'src/app/service/home/home.service';
import { ProductInCart } from 'src/app/service/order/model/orderModel';
import { ProductDto } from 'src/app/service/product/model/productModel';
import { SelectBoxDataDto } from 'src/app/service/table/model/tableModel';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-list-product',
    templateUrl: './list-product.component.html',
    styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent implements OnInit {

    currentCategory: SelectBoxDataDto;
    categories: SelectBoxDataDto[] = [];


    // query product
    categoryId: number = 0;
    fetch: number = 20;
    offset: number = 0;
    countProduct: number = 0;

    // kết quả trả về product
    products: ProductDto[] = [];

    topProducts: ProductDto[] = [];
    responsiveOptions;


    // giỏ hàng
    carts : ProductInCart[] = [];

    constructor(public _homeServie: HomeService
            , public _cartService: CartService) { }

    ngOnInit(): void {
        this.initData()
        this.fetchProduct();
        this.initConfig();
    }

    initData() {
        this._homeServie.getListCategory().subscribe(res => {
            this.categories = res;
        })

        this._homeServie.getTopProduct().subscribe(res => {
            this.topProducts = res;
        })
    }

    initConfig(){
        this.responsiveOptions = [
            {
                breakpoint: '1024px',
                numVisible: 4,
                numScroll: 4
            },
            {
                breakpoint: '768px',
                numVisible: 2,
                numScroll: 2
            },
            {
                breakpoint: '560px',
                numVisible: 1,
                numScroll: 1
            }
        ];
    }

    fetchProduct(){
        if(this.offset <= this.countProduct)
            this._homeServie.getListProduct(this.categoryId, this.fetch, this.offset).subscribe(res=>{
                this.products.push(...res.result);
                // đếm lại tổng
                this.countProduct = res.count;
                // gán lại số lượng bỏ qua
                this.offset+=this.fetch;
            })
    }

    chooseCategory(item: SelectBoxDataDto){
        this.currentCategory = item;
        // reset
        this.offset = 0;
        this.categoryId = item?item.id:0;
        this.products.length = 0;
        // lấy lại data
        this.fetchProduct();
    }


    addToCart(product:ProductDto){
        this._cartService.addToCart(product);
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


    @HostListener('window:scroll', ['$event']) // for window scroll events
    onScroll(event) {
        let pos = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
        let max = document.documentElement.scrollHeight;
        // pos/max will give you the distance between scroll bottom and and bottom of screen in percentage.
        if(pos == max )   {
        //Do your action here
            this.fetchProduct();
        }
    }



}
