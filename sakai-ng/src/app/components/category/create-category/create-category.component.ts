import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryService } from 'src/app/service/category/category.service';
import { CategoryDto } from 'src/app/service/category/model/categoryModel';
import { SelectBoxDataDto } from 'src/app/service/table/model/tableModel';
import { TableColumnService } from 'src/app/service/table/table.service';

@Component({
  selector: 'app-create-category',
  templateUrl: './create-category.component.html',
  styleUrls: ['./create-category.component.scss']
})
export class CreateCategoryComponent implements OnInit {

  submited = false;

  listStatus: SelectBoxDataDto[];

  category: CategoryDto = {
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
            , public _categoryService: CategoryService
             ) { }

  ngOnInit(): void {
    if(this.config.data != undefined)
      this.category = this.config.data;

    // call function only run one time
    this.initFormBuilder();
    this.getListMasterData(1);
  }

  /**
   * cấu hình những trường cần thiết cho form
   */
  initFormBuilder(){
     this.infoForm = this._fb.group({
         code : [this.category.code, Validators.required],
         name : [this.category.name, Validators.required],
         status : [this.category.status,[Validators.required ,Validators.min(1)]],
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
    this.category = {
        ...this.category,
        code : this.infoForm.get('code').value,
        name : this.infoForm.get('name').value,
        status : this.infoForm.get('status').value,
    }
    this._categoryService.createOrUpdate(this.category).subscribe(res=>{
        // thêm thành công
        // config msg
        let msg = this.category.id==0?'Thêm mới':'Cập nhật'
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
