import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { retry } from 'rxjs';
import { ImportInvoiceService } from 'src/app/service/import-invoice/import-invoice.service';
import { CreateImportInvoice, MaterialSelectDto } from 'src/app/service/import-invoice/model/ImportInvoiceDto';
import { MaterialService } from 'src/app/service/material/material.service';
import { MaterialDto } from 'src/app/service/material/model/materialModel';
import { SupplierDto } from 'src/app/service/supplier/model/supplierModel';
import { SupplierService } from 'src/app/service/supplier/supplier.service';
import { BaseParamModel, SelectBoxDataDto } from 'src/app/service/table/model/tableModel';
import { TableColumnService } from 'src/app/service/table/table.service';

@Component({
    selector: 'app-create-import-invoice',
    templateUrl: './create-import-invoice.component.html',
    styleUrls: ['./create-import-invoice.component.scss']
})
export class CreateImportInvoiceComponent implements OnInit {
    submited = false;
    isShowSidebar = false;
    isSelectMaterial = false;
    queryMaterials: BaseParamModel = {
        tableConfigName: 'Material',
        pageSize: 10,
        pageNumber: 1
    };

    countMaterial = 0;
    listMaterials: MaterialDto[] = [];
    listSupplier: SupplierDto[] = [];

    infoForm: FormGroup;

    currentMaterial: MaterialSelectDto ={
        material : null,
        price : 0,
        stock :0,
        startTime :null,
        expriedTime :null
    };

    materialSelected: MaterialSelectDto[]= [];

    listStatus : SelectBoxDataDto[]= [];

    constructor(public _materialService: MaterialService
            , public _tableService: TableColumnService
            , public _supplierService: SupplierService
            , public _importInvoiceService: ImportInvoiceService
            , public _fb: FormBuilder
            , private _messageService: MessageService) { }

    ngOnInit(): void {
        this.initForm();
        this.initData();
    }

    initData(){
        this.fetchMaterial();
        this._supplierService.getAll().subscribe(res=>{
            this.listSupplier =res;
        })

        this._tableService.getMasterDataByGroupId(1).subscribe(res=>{
            this.listStatus = res;
        })
    }

    initForm(){
        this.infoForm = this._fb.group({
            description: ['', Validators.required],
            supplierId: [null, Validators.required],
            note: ['', Validators.nullValidator],
            status: [null,Validators.required]
        })
    }

    scrollMaterial(event: any) {
        // visible height + pixel scrolled >= total height
        if (event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
            this.fetchMaterial();
        }
    }

    fetchMaterial() {
        let skip = this.queryMaterials.pageSize * (this.queryMaterials.pageNumber - 1)
        if (skip > this.countMaterial) {
            console.log('hết r')
            return;
        }
        this._materialService.getData(this.queryMaterials).subscribe(res => {
            this.queryMaterials.pageNumber++;
            this.countMaterial = res.count;
            this.listMaterials.push(...res.result);
        })
    }

    showSideBar(){
        this.isShowSidebar = true;
    }

    chooseMaterial(item:MaterialDto){
        // đã tồn tại
        var check = this.materialSelected.find(x=>x.material.id == item.id)
        if(check != null){
            check.stock++;
        }
        else{
            this.currentMaterial = {
                material : item,
                price :0,
                stock :1,
                startTime : null,
                expriedTime : null
            };
            this.isSelectMaterial = true;
            this.isShowSidebar = false;
        }
    }

    pushMaterial(){
        debugger
        if(!this.currentMaterial.price || !this.currentMaterial.stock || !this.currentMaterial.startTime || !this.currentMaterial.expriedTime){
            this._messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Thông tin không được để trống' });
            return;
        }
        if(this.currentMaterial.price <=0 || this.currentMaterial.stock <= 0){
            this._messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Số lượng và giá tiền phải lớn hơn 0' });
            return;
        }
        console.log(this.currentMaterial.startTime.toISOString())
        this.materialSelected.push(this.currentMaterial);
        this.isSelectMaterial = false;
    }

    addStock(item:MaterialSelectDto){
        item.stock++;
    }

    subStock(item:MaterialSelectDto){
        if(item.stock==0){
            this.materialSelected = this.materialSelected.filter(x=>x.material.id != item.material.id);
            return;
        }
        item.stock--;
    }

    checkIsMaterialExists(item: MaterialDto){
        return this.materialSelected.find(x=>x.material.id == item.id) != null;
    }

    getTotalPrice(){
        var total = 0;
        this.materialSelected.forEach(x=>{
            total+= x.stock*x.price;
        })
        return total;
    }

    save(){
        this.submited = true;
        if(this.infoForm.invalid){
            return;
        }
        if(this.materialSelected.length == 0){
            this._messageService.add({ severity: 'error', summary: 'Thất bại', detail: 'Bạn chưa chọn chất liệu để nhập' });
            return;
        }

        const importInvoice: CreateImportInvoice = {
            id : 0,
            description : this.infoForm.get('description').value,
            supplierId : this.infoForm.get('supplierId').value,
            note : this.infoForm.get('note').value,
            code:'',
            status :this.infoForm.get('status').value,
            importInvoiceDetails : []
        }

        importInvoice.importInvoiceDetails = this.materialSelected.map(x=>{
            return {
                id : 0,
                importInvoiceId :0,
                materialId : x.material.id,
                price : x.price,
                stock : x.stock,
                startTime : x.startTime,
                expriedTime : x.expriedTime
            }
        })
        console.log(importInvoice);
        this._importInvoiceService.createImportInvoice(importInvoice).subscribe(res=>{
            if(res>0){
                this._messageService.add({ severity: 'success', summary: 'Thành công', detail: 'Bạn đã nhập hàng thành công' });
            }
        })
    }
}
