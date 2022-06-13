import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { UserDto } from 'src/app/service/user/model/UserDto';
import { UserService } from 'src/app/service/user/user.service';
import { WareHouseDto, GetWareHouse, MaterialDetailWareHouse, WarehouseSelect, CreateExportInvoiceDto } from 'src/app/service/warehouse/model/WareHouseDto';
import { WarehouseService } from 'src/app/service/warehouse/warehouse.service';

@Component({
    selector: 'app-warehouse',
    templateUrl: './warehouse.component.html',
    styleUrls: ['./warehouse.component.scss']
})
export class WarehouseComponent implements OnInit {

    listMaterial: WareHouseDto[] = [];

    listDetail: MaterialDetailWareHouse[] = [];

    currentMaterial: WareHouseDto;

    countWarehouse: number = 0;

    queryWarehouse: GetWareHouse = {
        materialId: 0,
        skip: 0,
        take: 10
    };

    listExport: WarehouseSelect[] = [];
    submited = false;
    infoForm: FormGroup;

    listStaff: UserDto[] = [];
    constructor(public _warehouseService: WarehouseService
        , public _fb: FormBuilder
        , public _userService: UserService
        , public _messageService: MessageService) { }

    ngOnInit(): void {
        this.fetchMaterial();
        this.initForm();

        this._userService.getAllStaff().subscribe(res => {
            this.listStaff = res;
        })
    }

    initForm() {
        this.infoForm = this._fb.group({
            description: ['', Validators.required],
            exportTo: [null, Validators.required],
            note: ['', Validators.nullValidator]
        })
    }

    scrollMaterial(event: any) {
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
            this.fetchMaterial();
        }
    }

    fetchMaterial() {
        if (this.queryWarehouse.skip > this.countWarehouse) {
            console.log('hết r')
            return;
        }
        this._warehouseService.getData(this.queryWarehouse).subscribe(res => {
            this.queryWarehouse.skip += this.queryWarehouse.take;
            this.countWarehouse = res.count;
            this.listMaterial.push(...res.result);
        })
    }

    resetPage() {
        this.listDetail.length = 0;
        this.currentMaterial = null;
        this.countWarehouse = 0;
        this.queryWarehouse = {
            materialId: 0,
            skip: 0,
            take: 10
        };

        this.listExport.length = 0;
        this.submited = false;
        this.infoForm.patchValue({
            description: '',
            note: '',
            exportTo: null
        })
    }

    chooseMaterial(item: WareHouseDto) {
        this.currentMaterial = item;
        this._warehouseService.getWarehouseDetail(item.id).subscribe(res => {
            this.listDetail = res;

            // restock count
            this.listDetail.forEach(x => {
                var parent = this.listExport.find(ex => ex.id == item.id);
                if (parent != null) {
                    var getcount = parent.detail.find(y => y.id == x.id);
                    x.stock -= getcount == null ? 0 : getcount.stock;
                }
            })
        })
    }

    // chấm chọn xuất đơn hàng
    exportMaterial(item: MaterialDetailWareHouse) {
        // nếu hết hàng
        if (item.stock == 0) {
            // thông báo hết kho
            this._messageService.add({ severity: 'error', detail: 'Hết hàng' })
            return;
        }

        // trừ số lượng
        item.stock--;
        var material = this.listMaterial.find(x => x.id == item.materialId);
        // trừ cả bên ngoài
        material.stock--;

        var parent = this.listExport.find(x => x.id == material.id)
        // chưa tồn tại chất liệu
        if (parent == null) {
            var select: WarehouseSelect = { ...material, detail: [] };
            // khởi tạo mặc định là một
            select.detail.push({
                ...item,
                stock: 1
            });

            this.listExport.push(select);
        }
        // đã tồn tại chất liệu
        else {
            // cộng thêm vào list export
            // kiểm tra xem đã có mã nhập chưa
            var detail = parent.detail.find(y => y.id == item.id);
            if (detail == null) {
                parent.detail.push({
                    ...item,
                    stock: 1
                })
            }
            else {
                detail.stock++;
            }
        }
    }


    checkMaterialDetailSelected(item: MaterialDetailWareHouse) {
        var parent = this.listExport.find(x => x.id == item.materialId);
        if (parent == null) return false;
        return parent.detail.filter(x => x.id == item.id).length > 0;
    }


    export() {
        this.submited = true;
        if (this.infoForm.invalid) {
            return;
        }
        if (this.listExport.length == 0) {
            this._messageService.add({ severity: 'error', detail: 'Bạn chưa chọn nguyên liệu' })
            return;
        }

        const input: CreateExportInvoiceDto = {
            id: 0,
            code: '',
            description: this.infoForm.get('description').value,
            note: this.infoForm.get('note').value,
            exportTo: this.infoForm.get('exportTo').value,
            exportInvoiceDetails: []
        }
        this.listExport.forEach(ite=>{
            ite.detail.forEach(x=>{
                input.exportInvoiceDetails.push({
                    id: 0,
                    exportInvoiceId: 0,
                    materialId: x.materialId,
                    stock: x.stock,
                    warehouseId: x.id
                })
            })
        })
        this._warehouseService.createExportInvoice(input).subscribe(res => {
            if (res > 0) {
                this._messageService.add({ severity: 'success', detail: 'Thành công' })
                this.resetPage();
            }
        })
    }
}
