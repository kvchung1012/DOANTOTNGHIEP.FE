import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryService } from 'src/app/service/category/category.service';
import { ProductCreateDto, ProductComboDto, ProductPriceDto } from 'src/app/service/product/model/productModel';
import { ProductService } from 'src/app/service/product/product.service';
import { SelectBoxDataDto } from 'src/app/service/table/model/tableModel';
import { TableColumnService } from 'src/app/service/table/table.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-create-product',
    templateUrl: './create-product.component.html',
    styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent implements OnInit {

    id:number = 0;

    submited = false;

    listStatus: SelectBoxDataDto[];
    listCategory: SelectBoxDataDto[];
    listCombo: SelectBoxDataDto[];

    productCombos: number[] = [];
    product: ProductCreateDto = {
        id: 0,
        code: '',
        name: '',
        description: '',
        image: '',
        isCombo: false,
        isTop: false,
        productPrice: [],
        productCombo: [],
        status: 0,
        categoryId: 0,
    };
    clonedProductPrice: { [s: string]: ProductPriceDto; } = {};

    // clonedStartTime : Date
    // clonedEndTime : Date

    infoForm: FormGroup;

    constructor(public _tableService: TableColumnService
        , public _fb: FormBuilder
        , private _activatedroute:ActivatedRoute
        , private messageService: MessageService
        , public _productService: ProductService
        , public _categoryService: CategoryService
    ) { }

    ngOnInit(): void {
        //   if(this.config.data != undefined)
        //     this.category = this.config.data;

        // call function only run one time
        this.initFormBuilder();
        this.getListMasterData(1);
        this.getListDataRef();

        // kiểm tra xem đã
        if(this._activatedroute.snapshot.paramMap.get("id")){
            this.id = parseInt(this._activatedroute.snapshot.paramMap.get("id"));
            this.getProductEdit(this.id);
        }
    }


    getProductEdit(id:number){
        this._productService.getById(id).subscribe(res=>{
            this.product = res;
            this.productCombos = res.productCombo.map(x=>x.productRefId);

            this.product.productPrice = res.productPrice.map(x=>{
                return {
                    ...x,
                    startTime : new Date(x.startTime),
                    endTime : new Date(x.endTime),
                }
            })
            this.infoForm.patchValue({
                code : this.product.code,
                name : this.product.name,
                description : this.product.description,
                categoryId : this.product.categoryId,
                isCombo : this.product.isCombo,
                isTop : this.product.isTop,
                status : this.product.status
            })

            console.log(this.product);
        })
    }

    /**
     * cấu hình những trường cần thiết cho form
     */
    initFormBuilder() {
        this.infoForm = this._fb.group({
            code: [this.product.code, Validators.required],
            name: [this.product.name, Validators.required],
            description: [this.product.description, Validators.nullValidator],
            image: [this.product.image, Validators.nullValidator],
            status: [this.product.status, [Validators.required, Validators.min(1)]],
            isCombo: [this.product.isCombo, [Validators.required]],
            productCombo: [[], [Validators.nullValidator]],
            isTop: [this.product.isTop, [Validators.required]],
            categoryId: [this.product.categoryId, [Validators.required, Validators.min(1)]],
        })
    }

    /**
     *
     * @param id Mã trạng thái trong master data
     */
    getListMasterData(id: number) {
        this._tableService.getMasterDataByGroupId(id).subscribe(res => {
            this.listStatus = res;
        })
    }

    getListDataRef() {
        this._categoryService.getAll().subscribe(res => {
            this.listCategory = res;
        })

        this._productService.getCombo().subscribe(res => {
            this.listCombo = res;
        })
    }

    /**
     * Hàm lưu
     */
    save() {
        // xác nhận trạng thái gửi
        this.submited = true;

        // kiểm tra form đã đc valid hay chưa
        if (!this.infoForm.valid)
            return;

        // thực hiện login khi đã được valid
        this.product = {
            ...this.product,
            code: this.infoForm.get('code').value,
            name: this.infoForm.get('name').value,
            description: this.infoForm.get('description').value,
            isCombo: this.infoForm.get('isCombo').value,
            isTop: this.infoForm.get('isTop').value,
            categoryId: this.infoForm.get('categoryId').value,
            status: this.infoForm.get('status').value,
        }

        this.product.productCombo = this.productCombos.map<ProductComboDto>(x => {
            return {
                id: 0,
                productId: this.product.id,
                productRefId: x
            }
        })

        this.product.productPrice = this.product.productPrice.map<ProductPriceDto>(x => {
            return {
                id: 0,
                productId: this.product.id,
                price: x.price,
                startTime : new Date(x.startTime),
                endTime : new Date(x.endTime)
            }
        })

        if (this.product.productCombo.length == 0 && this.product.isCombo) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Chưa chọn combo' });
            return;
        }

        if (this.product.productPrice.length == 0) {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Chưa cài đặt giá sản phẩm' });
            return;
        }

        this._productService.createOrUpdate(this.product).subscribe(res => {
            // config msg
            // thêm thành công
            let msg = this.product.id == 0 ? 'Thêm mới' : 'Cập nhật'
            if (res > 0) {
                this.product.id = res;
                this.messageService.add({ severity: 'success', summary: 'Thành công', detail: msg + ' danh mục thành công' });
            }
            else {
                this.messageService.add({ severity: 'warning', summary: 'Thất bại', detail: msg + ' danh mục thất bại' });
            }
        })
    }

    addRowProductPrice() {
        this.product.productPrice.push({
            id: this.product.productPrice.length,
            price: 0,
            productId: 0
        })
    }


    // edit price
    onRowEditInit(productPrice: ProductPriceDto) {
        this.clonedProductPrice[productPrice.id] = { ...productPrice };
        // this.clonedStartTime = new Date(productPrice.startTime)
        // this.clonedEndTime = new Date(productPrice.endTime)
    }

    onRowEditSave(productPrice: ProductPriceDto) {
        if (productPrice.price > 0 && productPrice.startTime && productPrice.endTime) {
            if (new Date(productPrice.startTime) < new Date(productPrice.endTime)) {
                if (this.product.productPrice.filter(x => x.id != productPrice.id && new Date(x.startTime) <= new Date(productPrice.startTime) && new Date(x.endTime) >= new Date(productPrice.startTime)).length > 0) {
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ngày này đã cập nhật giá' });
                    this.product.productPrice = this.product.productPrice.filter(x => x.id != productPrice.id);
                }
                else {
                    delete this.clonedProductPrice[productPrice.id];
                    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Thành công' });
                }
            }
            else {
                this.product.productPrice = this.product.productPrice.filter(x => x.id != productPrice.id);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ngày bắt đầu nhỏ hơn ngày kết thúc' });
            }
        }
        else {
            this.product.productPrice = this.product.productPrice.filter(x => x.id != productPrice.id);
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Price or Date' });
        }
    }

    onRowEditCancel(productPrice: ProductPriceDto, index: number) {
        this.product.productPrice[index] = this.clonedProductPrice[productPrice.id];
        delete this.clonedProductPrice[productPrice.id];
    }

    onDeletePrice(index) {
        this.product.productPrice.splice(index, 1);
    }

    uploadImage(event) {
        this._productService.upload(event.target.files[0]).subscribe(res => {
            if (res.uploaded) {
                this.product.image = res.url;
            }
        })
    }


    getImagePath(path:string){
        if(!path)
            return '../../../../assets/demo/no-image.png';
        return environment.baseUrl + path;
    }


}
