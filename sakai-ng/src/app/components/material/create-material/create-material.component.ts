import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MaterialService } from 'src/app/service/material/material.service';
import { MaterialDto } from 'src/app/service/material/model/materialModel';
import { SelectBoxDataDto } from 'src/app/service/table/model/tableModel';
import { TableColumnService } from 'src/app/service/table/table.service';

@Component({
  selector: 'app-create-material',
  templateUrl: './create-material.component.html',
  styleUrls: ['./create-material.component.scss']
})
export class CreateMaterialComponent implements OnInit {

    submited = false;

    listStatus: SelectBoxDataDto[];
    listUnit: SelectBoxDataDto[];

    material: MaterialDto = {
        id:0,
        code : '',
        name : '',
        unit: 0,
        unitName:'',
        status : 0,
        statusName : ''
    };

    infoForm: FormGroup;
    constructor(public _tableService:TableColumnService
              , public config: DynamicDialogConfig
              , public ref: DynamicDialogRef
              , public _fb: FormBuilder
              , private messageService: MessageService
              , public _materialService: MaterialService
               ) { }

    ngOnInit(): void {
      if(this.config.data != undefined)
        this.material = this.config.data;

      // call function only run one time
      this.initFormBuilder();
      this.getListMasterData();
    }

    /**
     * cấu hình những trường cần thiết cho form
     */
    initFormBuilder(){
       this.infoForm = this._fb.group({
           code : [this.material.code, Validators.required],
           name : [this.material.name, Validators.required],
           unit : [this.material.unit,[Validators.required ,Validators.min(1)]],
           status : [this.material.status,[Validators.required ,Validators.min(1)]],
       })
    }

    /**
     *
     * @param id Mã trạng thái trong master data
     */
    getListMasterData(){
      this._tableService.getMasterDataByGroupId(1).subscribe(res=>{
          this.listStatus = res;
      })

      this._tableService.getMasterDataByGroupId(4).subscribe(res=>{
        this.listUnit = res;
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
      this.material = {
          ...this.material,
          unit: this.infoForm.get('unit').value,
          code : this.infoForm.get('code').value,
          name : this.infoForm.get('name').value,
          status : this.infoForm.get('status').value,
      }
      this._materialService.createOrUpdate(this.material).subscribe(res=>{
          // thêm thành công
          // config msg
          let msg = this.material.id==0?'Thêm mới':'Cập nhật'
          if(res){
              this.messageService.add({severity:'success', summary: 'Thành công', detail: msg+' nguyên liệu thành công'});
              this.ref.close(true);
          }
          else{
              this.messageService.add({severity:'warning', summary: 'Thất bại', detail: msg+' nguyên liệu thất bại'});
          }
      })
    }


    close(){
      this.ref.close(false);
    }

}
