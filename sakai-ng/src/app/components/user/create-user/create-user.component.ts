import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ProductService } from 'src/app/service/productservice';
import { SelectBoxDataDto } from 'src/app/service/table/model/tableModel';
import { TableColumnService } from 'src/app/service/table/table.service';
import { PositionByUser, UserDto } from 'src/app/service/user/model/UserDto';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

    id:number = 0;

    submited = false;

    listStatus: SelectBoxDataDto[];

    user: UserDto = {
        id : 0,
        fullName :'',
        userName :'',
        birthday : null,
        email : '',
        address : '',
        phone : null,
        isActive : true,
        identity : '',
        status : null,
        statusName :''
    }

    positions : PositionByUser[]= [];

    infoForm: FormGroup;

    constructor(public _tableService: TableColumnService
        , public _fb: FormBuilder
        , private _activatedroute:ActivatedRoute
        , private messageService: MessageService
        , public _userService: UserService
    ) { }

    ngOnInit(): void {
        this.initFormBuilder();
        this.getListMasterData(1);
        // this.getListDataRef();

        // kiểm tra xem đã
        if(this._activatedroute.snapshot.paramMap.get("id")){
            this.id = parseInt(this._activatedroute.snapshot.paramMap.get("id"));
            this.getUserById(this.id);
            this.getPositionByUserId(this.id);
        }
    }

    /**
     * cấu hình những trường cần thiết cho form
     */
     initFormBuilder() {
        this.infoForm = this._fb.group({
            fullName: [this.user.fullName, Validators.required],
            userName: [this.user.userName, Validators.required],
            phone: [this.user.phone, Validators.required],
            email: [this.user.email, Validators.required],
            birthday: [new Date(this.user.birthday), Validators.required],
            identity: [this.user.identity, Validators.required],
            address: [this.user.address, Validators.required],
            isActive: [this.user.isActive, Validators.required],
            status: [this.user.status, Validators.required],
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

    getUserById(id){
        this._userService.getUserById(id).subscribe(res => {
            this.user = res;
            this.initFormBuilder()
        })
    }

    getPositionByUserId(id){
        this._userService.getPositionByUserId(id).subscribe(res => {
            this.positions = res;
            console.log(this.positions);
        })
    }


    save(){
        this.submited = true;

        // kiểm tra form đã đc valid hay chưa
        if (!this.infoForm.valid)
            return;
        this.user = {
            ...this.user,
            fullName : this.infoForm.get('fullName').value,
            userName : this.infoForm.get('userName').value,
            birthday : this.infoForm.get('birthday').value,
            email : this.infoForm.get('email').value,
            phone : this.infoForm.get('phone').value+'',
            address : this.infoForm.get('address').value,
            isActive : this.infoForm.get('isActive').value,
            status : this.infoForm.get('status').value,
        }

        console.log(this.user)

        this._userService.createOrUpdate(this.user).subscribe(res=>{
            if(res>0){
                this.user.id = res;
                this.id = res;
                this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});
            }
        })
    }

    checkCurrentPosition(item:PositionByUser){
        let curent = new Date();
        let start = new Date(item.startTime);
        let end = item.endTime == null ? null : new Date(item.endTime);
        if(end == null)
            return true;
        if(start <= curent && end >= curent)
            return true;
        return false;
    }

}
