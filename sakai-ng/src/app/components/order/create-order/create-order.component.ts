import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CategoryService } from 'src/app/service/category/category.service';
import { CreateCartOrder, ProductInCart } from 'src/app/service/order/model/orderModel';
import { OrderService } from 'src/app/service/order/order.service';
import { ProductDto } from 'src/app/service/product/model/productModel';
import { ProductService } from 'src/app/service/product/product.service';
import { BaseParamModel, SelectBoxDataDto } from 'src/app/service/table/model/tableModel';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss']
})
export class CreateOrderComponent implements OnInit {

    listUser: SelectBoxDataDto[];
    listCategory: SelectBoxDataDto[];

    searchString:string = "";
    queryProduct: BaseParamModel = {
        tableConfigName : 'Product',
        pageNumber:0,
        pageSize:10,
        filterColumns : [
            // {
            //     columnId : 31,  // hash code filter
            //     value : ''
            // },
            // {
            //     columnId : 30,  // hash code filter
            //     value : ''
            // },
            // {
            //     columnId : 33,
            //     value: 0
            // }
        ]
    }

    // danh sách sản phẩm
    totalCount = 0;
    listProduct: ProductDto[];

    // giỏ hàng
    carts : ProductInCart[] = [];


    infoFormSearch: FormGroup;

    createCart: CreateCartOrder;

    constructor(
        public _categoryService: CategoryService
        , public _productService: ProductService
        , public _orderService: OrderService
        , public _fb: FormBuilder
        , private _messageService: MessageService
    ) { }


    ngOnInit(): void {
        this.initData();
        this.resetForm();
        this.initForm();
    }

    initForm(){
        this.infoFormSearch = this._fb.group({
            categoryId: [0, Validators.nullValidator],
            search: ['', Validators.nullValidator],
        })
    }

    resetForm(){
        this.createCart = {
            changeMoney : 0,
            customerEmail:'',
            customerName:'',
            customerPhone:'',
            products:[],
            receiveMoney:0,
            totalMoney:0
        }
        this.carts.length = 0;
    }

    initData(){
        /**Lấy ra danh sách danh mục */
        this._categoryService.getAll().subscribe(res=>{
            this.listCategory = res;
            this.getProduct();
        })
    }

    onSearchProduct(){
        this.getProduct();
    }

    onChangeCategory(event){
        // this.queryProduct.filterColumns[2].value = event.value??0;
        this.getProduct();
    }

    /**
    * Hàm query lấy sản phẩm trên server
    */
    getProduct(){
        this._productService.getData(this.queryProduct).subscribe(res=>{
            this.listProduct = res.result;
            this.totalCount = res.count;
        })
    }

    /**
     *
     * @param product
     * Thêm product vào giỏ hàng
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
    }

    /**
     *
     * @param item
     * Hàm tăng số lượng đơn hàng
     */
    addStock(item:ProductInCart){
        item.stock++;
    }

    /**
     *
     * @param item
     * Hàm giảm số lượng đơn hàng
     */
    subStock(item:ProductInCart){
        item.stock--;
        if(item.stock == 0 || item.stock < 0){
            this.carts = this.carts.filter(x=>x.product.id != item.product.id);
        }
    }

    /**
     *
     * @returns Tính tổng giá trị đơn hàng
     */
    getTotalCartMoney(){
        if(this.carts.length == 0)
            return 0;
        let sum = 0;
        this.carts.forEach(x => {
            sum += (this.caculatePriceDiscount(x.product))*x.stock;
        });
        this.createCart.totalMoney = sum;
        return sum;
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


    /**
     * Sự kiện bấm thanh toán giỏ hàng
     */
    createOrder(){
        if(this.carts.length == 0){
            this._messageService.add({severity:'danger', summary: 'Thất bại', detail: 'Chưa chọn sản phẩm'});
            return;
        }
        if(!this.createCart.receiveMoney){
            this._messageService.add({severity:'danger', summary: 'Thất bại', detail: 'Chưa điền đủ thông tin'});
            return;
        }

        // pass in here

        this.createCart.products = this.carts.map(x=>{
            return {
                productId : x.product.id,
                stock : x.stock
            }
        })
        this._orderService.createCart(this.createCart).subscribe(res=>{
            if(res>0){
                this.resetForm();
                this._messageService.add({severity:'success', summary: 'Thành công', detail: 'Đặt hàng thành công'});
            }
            else{
                this._messageService.add({severity:'danger', summary: 'Thất bại', detail: 'Hệ thống lỗi'});
            }
        })
    }

}
