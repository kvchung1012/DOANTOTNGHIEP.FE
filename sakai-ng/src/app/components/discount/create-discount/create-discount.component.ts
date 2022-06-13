import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DiscountService } from 'src/app/service/discount/discount.service';
import { CreateDiscountDto, DiscountProductDto } from 'src/app/service/discount/model/discountModel';
import { SelectBoxDataDto } from 'src/app/service/table/model/tableModel';
import { TableColumnService } from 'src/app/service/table/table.service';

@Component({
    selector: 'app-create-discount',
    templateUrl: './create-discount.component.html',
    styleUrls: ['./create-discount.component.scss']
})
export class CreateDiscountComponent implements OnInit {

    submited = false;

    listStatus: SelectBoxDataDto[];

    listProduct: SelectBoxDataDto[];
    listProductSelected: SelectBoxDataDto[];

    listSaleType = [{
        value: true,
        label: 'Giảm tiền'
    },
    {
        value: false,
        label: 'Giảm theo phần trăm'
    }
    ]
    discount: CreateDiscountDto = {
        id: 0,
        code: '',
        name: '',
        status: null,
        startTime: null,
        endTime: null,
        saleType: null,
        value: 0,
        productDiscount: []
    };

    infoForm: FormGroup;
    constructor(public _tableService: TableColumnService
        , public config: DynamicDialogConfig
        , public ref: DynamicDialogRef
        , public _fb: FormBuilder
        , private messageService: MessageService
        , public _discountService: DiscountService
    ) { }

    ngOnInit(): void {
        if (this.config.data != undefined) {
            this.discount = this.config.data;
            this._discountService.getDiscountById(this.config.data.id).subscribe(res => {
                this.discount = res;
                this.discount.startTime = new Date(res.startTime);
                this.discount.endTime = res.endTime == null ? null : new Date(res.endTime);
            });
        }
        // call function only run one time
        this.initFormBuilder();
        this.getListMasterData(1);
    }

    /**
     * cấu hình những trường cần thiết cho form
     */
    initFormBuilder() {
        this.infoForm = this._fb.group({
            code: [this.discount.code, Validators.required],
            name: [this.discount.name, Validators.required],
            startTime: [this.discount.startTime, Validators.required],
            endTime: [this.discount.endTime, Validators.required],
            saleType: [this.discount.saleType, Validators.required],
            value: [this.discount.value, Validators.required],
            status: [this.discount.status, [Validators.required, Validators.min(1)]],
            productDiscount: [this.discount.productDiscount, [Validators.required]],
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

        this._tableService.getSelectBoxData("Products").subscribe(res => {
            this.listProduct = res;
        })
    }


    /**
     * Hàm lưu
     */
    save() {
        // xác nhận trạng thái gửi
        this.submited = true;

        // kiểm tra form đã đc valid hay chưa
        if (!this.infoForm.valid || this.discount.productDiscount.length == 0)
            return;

        // thực hiện login khi đã được valid
        this.discount = {
            ...this.discount,
            code: this.infoForm.get('code').value,
            name: this.infoForm.get('name').value,
            startTime: this.infoForm.get('startTime').value,
            endTime: this.infoForm.get('endTime').value,
            saleType: this.infoForm.get('saleType').value,
            value: this.infoForm.get('value').value,
            status: this.infoForm.get('status').value,
        }

        this._discountService.createDiscount(this.discount).subscribe(res => {
            // thêm thành công
            // config msg
            let msg = this.discount.id == 0 ? 'Thêm mới' : 'Cập nhật'
            if (res > 0) {
                this.messageService.add({ severity: 'success', summary: 'Thành công', detail: msg + ' danh mục thành công' });
                this.ref.close(true);
            }
            else {
                this.messageService.add({ severity: 'warning', summary: 'Thất bại', detail: msg + ' danh mục thất bại' });
            }
        })
    }


    close() {
        this.ref.close(false);
    }

}
