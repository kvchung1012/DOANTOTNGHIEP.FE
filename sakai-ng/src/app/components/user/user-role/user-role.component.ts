import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TableColumnService } from 'src/app/service/table/table.service';
import { CreateUserRole, UserRole } from 'src/app/service/user/model/UserDto';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss']
})
export class UserRoleComponent implements OnInit {

    id:number;
    userRoles: UserRole[];
    constructor(public _tableService:TableColumnService
        , public config: DynamicDialogConfig
        , public ref: DynamicDialogRef
        , public _fb: FormBuilder
        , private messageService: MessageService
        , public _userService: UserService
         ) { }

    ngOnInit(): void {
        if(this.config.data != undefined)
            this.id = this.config.data;
        this.getRoleByUser();
    }

    getRoleByUser(){
        this._userService.getRoleByUser(this.id).subscribe(res=>{
            this.userRoles = res;
        })
    }

    save(){
        let values = this.userRoles.filter(x=>x.checked).map<CreateUserRole>(x=>{
            return {
                userId : this.id,
                roleId : x.id
            }
        })
        this._userService.createUserRole(values).subscribe(res=>{
            if(res>0){
                this.messageService.add({severity:'success', summary: 'Thành công', detail:'Thêm quyền cho người dùng thành công'});
            }
            else{
                this.messageService.add({severity:'danger', summary: 'Thất bại', detail: 'Thêm quyền thất bại'});
            }
        })
    }

    close(){
        this.ref.close(false);
    }

}
