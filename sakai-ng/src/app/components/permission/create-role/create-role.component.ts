import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RoleDto } from 'src/app/service/permission/model/PermissionDto';
import { PermissionService } from 'src/app/service/permission/permission.service';
import { TableColumnService } from 'src/app/service/table/table.service';

@Component({
  selector: 'app-create-role',
  templateUrl: './create-role.component.html',
  styleUrls: ['./create-role.component.scss']
})
export class CreateRoleComponent implements OnInit {

    submited = false;

    roleDto: RoleDto = {
        id:0,
        name : '',
        description : '',
        isDefault : false,
    };

    infoForm: FormGroup;
    constructor(public _tableService:TableColumnService
              , public config: DynamicDialogConfig
              , public ref: DynamicDialogRef
              , public _fb: FormBuilder
              , private messageService: MessageService
              , public _permissionService: PermissionService
               ) { }

    ngOnInit(): void {
      if(this.config.data != undefined)
        this.roleDto = this.config.data;

      // call function only run one time
      this.initFormBuilder();
    }

    /**
     * cấu hình những trường cần thiết cho form
     */
    initFormBuilder(){
       this.infoForm = this._fb.group({
           name : [this.roleDto.name, Validators.required],
           description : [this.roleDto.description, Validators.nullValidator],
           isDefault : [this.roleDto.isDefault, Validators.required],
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
      this.roleDto = {
          ...this.roleDto,
          name : this.infoForm.get('name').value,
          description : this.infoForm.get('description').value,
          isDefault : this.infoForm.get('isDefault').value,
      }
      this._permissionService.createRole(this.roleDto).subscribe(res=>{
          // thêm thành công
          // config msg
          let msg = this.roleDto.id==0?'Thêm mới':'Cập nhật'
          if(res){
              this.messageService.add({severity:'success', summary: 'Thành công', detail: msg+' chức danh thành công'});
              this.ref.close(true);
          }
          else{
              this.messageService.add({severity:'warning', summary: 'Thất bại', detail: msg+' chức danh thất bại'});
          }
      })
    }


    close(){
      this.ref.close(false);
    }
}
