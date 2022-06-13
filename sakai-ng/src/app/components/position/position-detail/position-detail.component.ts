import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreatePositionUserDto, PositionDto, PositionUserDto, StaffSelected } from 'src/app/service/position/model/PositionDto';
import { PositionService } from 'src/app/service/position/position.service';
import { TableColumnService } from 'src/app/service/table/table.service';
import { UserDto } from 'src/app/service/user/model/UserDto';
import { UserService } from 'src/app/service/user/user.service';

@Component({
  selector: 'app-position-detail',
  templateUrl: './position-detail.component.html',
  styleUrls: ['./position-detail.component.scss']
})
export class PositionDetailComponent implements OnInit {

    submited = false;
    isUpdate = false;

    postionDto: PositionDto = {
        id:0,
        name : '',
        description : '',
        parentId : 0,
    };

    staffs: UserDto[];

    staffInPosition : PositionUserDto[]= [];

    staffSelected : StaffSelected = {
        user : null,
        userPositionId : 0,
        endTime : null,
        startTime : null
    };

    staffPos:CreatePositionUserDto = {
        id : 0,
        userId : 0,
        positionId : 0,
        startTime : null,
        endTime :  null
    }

    infoForm: FormGroup;
    constructor(public _tableService:TableColumnService
              , public config: DynamicDialogConfig
              , public ref: DynamicDialogRef
              , public _fb: FormBuilder
              , private messageService: MessageService
              , public _positionService: PositionService
              , public _userService: UserService
               ) { }

    ngOnInit(): void {

      if(this.config.data != undefined){
          if(this.config.data.isUpdate){
              this.postionDto = this.config.data.data;
          }
          else{
              this.postionDto.parentId =  this.config.data.data.id
          }
      }

      // call function only run one time
      this.initData();
      this.initFormBuilder();
    }

    /**
     * cấu hình những trường cần thiết cho form
     */
    initFormBuilder(){
       this.infoForm = this._fb.group({
           name : [this.postionDto.name, Validators.required],
           description : [this.postionDto.description, Validators.nullValidator],
       })
    }

    initData(){
        this._userService.getAllStaff().subscribe(res=>{
            this.staffs = res;
        })
        if(this.postionDto.id > 0)
            this._positionService.getListPositionById(this.postionDto.id).subscribe(res=>{
                this.staffInPosition = res.staffs;
                this.postionDto = res.postion;

                // cập nhật trạng thái
                this.isUpdate = true;
                // cập nhật form
                this.infoForm.patchValue({
                    name : this.postionDto.name,
                    description : this.postionDto.description
                })
            })
    }

    addStaff(){
        // chưa chọn đủ điều kiện
        if(this.staffSelected.user == null || this.staffSelected.startTime == null){
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Chọn nhân viên và ngày bắt đầu' });
            return;
        }

        // đã có nhân viên trong danh sách
        else if(this.staffInPosition.filter(x=>x.id == this.staffSelected.user.id && this.staffSelected.userPositionId == 0).length > 0){
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Nhân viên đang trong chức vụ này' });
            return;
        }

        // kiểm tra case nhập ngày bắt đầu lớn hơn kết thúc
        else if(this.staffSelected.endTime != null && new Date(this.staffSelected.startTime) > new Date(this.staffSelected.endTime)){
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ngày bắt đầu phải ở trước ngày kết thúc' });
            return;
        }
        // add list in here
        this.staffPos = {
            id : this.staffSelected.userPositionId,
            userId : this.staffSelected.user.id,
            positionId : this.postionDto.id,
            startTime : this.staffSelected.startTime,
            endTime :  this.staffSelected.endTime
        }
        this._positionService.checkStaffPosition(this.staffPos).subscribe(res=>{
            if(res){
                this._positionService.createStaffPosition(this.staffPos).subscribe(result=>{
                    if(result > 0){
                        // trường hợp thêm mới
                        if(this.staffPos.id == 0){
                            this.staffInPosition.push({
                                id : this.staffSelected.user.id,
                                fullName : this.staffSelected.user.fullName,
                                email :  this.staffSelected.user.email,
                                phone :  this.staffSelected.user.phone,
                                startTime : this.staffSelected.startTime,
                                userPositionId : result,
                                positionId : this.postionDto.id,
                                endTime : this.staffSelected.endTime,
                                userName : this.staffSelected.user.userName
                            })
                        }
                        // cập nhật
                        else{
                            var edit = this.staffInPosition.find(x=>x.id = this.staffPos.userId);
                            edit.startTime = this.staffPos.startTime,
                            edit.endTime = this.staffPos.endTime
                        }
                        // thêm vào list để hiển thị

                    }
                    else{
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Nhân viên đang làm việc ở vị trí khác' });
                    }
                })
            }
            else{
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Nhân viên đang làm việc ở vị trí khác' });
            }
        })

    }

    chooseEdit(item:PositionUserDto){
        // set to form
        this.staffSelected = {
            ...this.staffSelected,
            user : this.staffs.filter(x=>x.id == item.id)[0],
            userPositionId : item.userPositionId,
            startTime : new Date(item.startTime),
            endTime : new Date(item.endTime)
        }
    }

    removeStaff(item:PositionUserDto){
        this.staffInPosition = this.staffInPosition.filter(x=>x.id != item.id);
    }

    save(){
        // xác nhận trạng thái gửi
        this.submited = true;

        // kiểm tra form đã đc valid hay chưa
        if(!this.infoForm.valid)
            return;
        this.postionDto = {
            ...this.postionDto,
            name : this.infoForm.controls['name'].value,
            description : this.infoForm.controls['description'].value,
        }
        this._positionService.createPosition(this.postionDto).subscribe(res=>{
            if(res > 0){
                this.postionDto.id = res;
                this.messageService.add({ severity: 'success', summary: 'SUCCESS', detail: 'Cập nhật dữ liệu thành công' });
            }
        })
    }


    close(){
        this.ref.close(this.isUpdate);
    }
}
