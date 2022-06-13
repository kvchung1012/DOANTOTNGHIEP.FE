import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SupplierDto } from 'src/app/service/supplier/model/supplierModel';
import { SupplierService } from 'src/app/service/supplier/supplier.service';
import { SelectBoxDataDto } from 'src/app/service/table/model/tableModel';
import { TableColumnService } from 'src/app/service/table/table.service';

@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.scss']
})
export class CreateSupplierComponent implements OnInit {

    submited = false;

    listStatus: SelectBoxDataDto[];

    supplier: SupplierDto = {
        id:0,
        code : '',
        name : '',
        status : 0,
        statusName : ''
    };

    infoForm: FormGroup;
    constructor(public _tableService:TableColumnService
              , public config: DynamicDialogConfig
              , public ref: DynamicDialogRef
              , public _fb: FormBuilder
              , private messageService: MessageService
              , public _supplierService: SupplierService
               ) { }

    ngOnInit(): void {
      if(this.config.data != undefined)
        this.supplier = this.config.data;

      // call function only run one time
      this.initFormBuilder();
      this.getListMasterData(1);
    }

    /**
     * cấu hình những trường cần thiết cho form
     */
    initFormBuilder(){
       this.infoForm = this._fb.group({
           code : [this.supplier.code, Validators.required],
           name : [this.supplier.name, Validators.required],
           status : [this.supplier.status,[Validators.required ,Validators.min(1)]],
       })
    }

    /**
     *
     * @param id Mã trạng thái trong master data
     */
    getListMasterData(id:number){
      this._tableService.getMasterDataByGroupId(id).subscribe(res=>{
          this.listStatus = res;
      })
    }


    /**
     * Hàm lưu
     */
    save(){
      // xác nhận trạng thái gửi
      this.submited = true;

      // kiểm tra form đã đc valid hay chưa
      if(!this.infoForm.valid)
          return;

      // thực hiện login khi đã được valid
      this.supplier = {
          ...this.supplier,
          code : this.infoForm.get('code').value,
          name : this.infoForm.get('name').value,
          status : this.infoForm.get('status').value,
      }
      this._supplierService.createOrUpdate(this.supplier).subscribe(res=>{
          // thêm thành công
          // config msg
          let msg = this.supplier.id==0?'Thêm mới':'Cập nhật'
          if(res){
              this.messageService.add({severity:'success', summary: 'Thành công', detail: msg+' danh mục thành công'});
              this.ref.close(true);
          }
          else{
              this.messageService.add({severity:'warning', summary: 'Thất bại', detail: msg+' danh mục thất bại'});
          }
      })
    }


    close(){
      this.ref.close(false);
    }

}
