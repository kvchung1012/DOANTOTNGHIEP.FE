import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateSaleCodeDto } from 'src/app/service/salecode/model/saleCodeDto';
import { SalecodeService } from 'src/app/service/salecode/salecode.service';
import { SelectBoxDataDto } from 'src/app/service/table/model/tableModel';
import { TableColumnService } from 'src/app/service/table/table.service';

@Component({
  selector: 'app-create-salecode',
  templateUrl: './create-salecode.component.html',
  styleUrls: ['./create-salecode.component.scss']
})
export class CreateSalecodeComponent implements OnInit {

    submited = false;

    listStatus: SelectBoxDataDto[];

    listSaleType = [{
        value: true,
        label: 'Giảm tiền'
    },
    {
        value: false,
        label: 'Giảm theo phần trăm'
    }
    ]
    salecode: CreateSaleCodeDto = {
        id: 0,
        code: '',
        name: '',
        status: null,
        startTime: null,
        endTime: null,
        saleType: null,
        value: 0,
        minPrice : 0,
        stock : 0,
        stockByUser :0
    };

    infoForm: FormGroup;
    constructor(public _tableService: TableColumnService
        , public config: DynamicDialogConfig
        , public ref: DynamicDialogRef
        , public _fb: FormBuilder
        , private messageService: MessageService
        , public _saleCodeService: SalecodeService
    ) { }

    ngOnInit(): void {
        if (this.config.data != undefined) {
            this.salecode = this.config.data;
            this._saleCodeService.getById(this.config.data.id).subscribe(res => {
                this.salecode = res;
                // this.salecode.startTime = new Date(res.startTime);
                // this.salecode.endTime = res.endTime == null ? null : new Date(res.endTime);
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
            code: [this.salecode.code, Validators.required],
            name: [this.salecode.name, Validators.required],
            startTime: [new Date(this.salecode.startTime), Validators.required],
            endTime: [this.salecode.endTime?new Date(this.salecode.startTime):null],
            saleType: [this.salecode.saleType, Validators.required],
            value: [this.salecode.value, Validators.required],
            status: [this.salecode.status, [Validators.required, Validators.min(1)]],
            minPrice : [this.salecode.minPrice, Validators.required],
            stock : [this.salecode.stock, Validators.required],
            stockByUser : [this.salecode.stockByUser, Validators.required]
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


    /**
     * Hàm lưu
     */
    save() {
        // xác nhận trạng thái gửi
        this.submited = true;

        // kiểm tra form đã đc valid hay chưa
        if (!this.infoForm.valid)
            return;

        // // thực hiện login khi đã được valid
        this.salecode = {
            ...this.salecode,
            code: this.infoForm.get('code').value,
            name: this.infoForm.get('name').value,
            startTime: this.infoForm.get('startTime').value,
            endTime: this.infoForm.get('endTime').value,
            saleType: this.infoForm.get('saleType').value,
            value: this.infoForm.get('value').value,
            status: this.infoForm.get('status').value,
            stock : this.infoForm.get('stock').value,
            stockByUser : this.infoForm.get('stockByUser').value,
            minPrice : this.infoForm.get('minPrice').value,
        }
        this._saleCodeService.createOrUpdate(this.salecode).subscribe(res => {
            // thêm thành công
            // config msg
            let msg = this.salecode.id == 0 ? 'Thêm mới' : 'Cập nhật'
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
