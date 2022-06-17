import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BaseParamModel, SystemTableColumn } from 'src/app/service/table/model/tableModel';
import { TableColumnService } from 'src/app/service/table/table.service';
import { UserService } from 'src/app/service/user/user.service';
import { UserRoleComponent } from './user-role/user-role.component';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  // config
  tableName = 'Users';
  // config column table
  listColumnTable!: SystemTableColumn[];
  listColumnShow !: SystemTableColumn[];
  listColumnFilter !: SystemTableColumn[];

  //data table
  baseParam: BaseParamModel = {
      filterString : '',
      tableConfigName: this.tableName,
      pageNumber: 1,
      pageSize: 5
  };
  listData: any[] = [];
  totalCount: number;
  isLoading: boolean;


  // column custom
  isShowFilter = false;
  isShowColumn = false;

  // dialog
  ref: DynamicDialogRef;

  constructor(public _tableService: TableColumnService
            , public _userService: UserService
            , private confirmationService: ConfirmationService
            , private messageService: MessageService
            , private _router: Router
            , private primengConfig: PrimeNGConfig
            , public dialogService: DialogService) { }

  ngOnInit(): void {
    this.primengConfig.ripple = true;
    // call once function
    this.getListColumn();
    this.getData();
  }

  // lấy danh sách cột từ server
  getListColumn(){
    this._tableService.getListColumnTable(this.tableName).subscribe(res=>{
        console.log(res);
        this.listColumnTable = res;
        this.listColumnFilter = res.filter(x=>x.isFilter);
        this.listColumnShow = res.filter(x=>x.isShow);
    })
  }


  // lấy ra data
  getData(){
      this.isLoading = true;
      this._userService.getData(this.baseParam).subscribe(res=>{
          console.log(res);
          this.isLoading = false;
          this.listData.length = 0;
          this.listData.push(...res.result);
          this.totalCount = res.count;
      },
      res=>{
          this.isLoading = false;
      })
  }

  customSort($event){
      this.baseParam.isAsc = $event.order == 1;
      this.baseParam.sortBy = this.listColumnTable.filter(x=>x.columnName == $event.field)[0].id;
      this.getData();
  }

  onPagination($event){
    this.baseParam.pageNumber = $event.page + 1;
    this.baseParam.pageSize = $event.rows;
    this.getData();
  }

  customOrder($event){
      console.log($event);
  }

  /**
   * Hàm tạo
   */
  create(){
    this._router.navigate(['/admin/user-manager/create-user'])
  }

  /**
   * Hàm sửa
   */
  edit(item){
    this._router.navigate(['/admin/user-manager/update-user',item.id])
  }

  /**
   * Hàm xóa
   */
   deleteItem(item){
    // this.confirmationService.confirm({
    //     message: 'Bạn có chắc muốn xóa danh mục sản phẩm không?',
    //     header: 'Xác nhận đồng ý',
    //     icon: 'pi pi-exclamation-triangle',
    //     rejectButtonStyleClass:'p-button-danger',
    //     acceptLabel:'Đồng ý',
    //     rejectLabel:'Hủy bỏ',
    //     accept: () => {
    //         this._categoryService.delete(item.id).subscribe(res=>{
    //             this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});
    //             this.getData();
    //         })
    //     },
    //     reject: () => {
    //        // this.messageService.add({severity:'danger', summary: 'Success', detail: 'Message Content'});
    //     }
    // });
  }

  /**
   * Mở side bar filter
   */
  openFilter(){
    this.isShowFilter = true;
  }

  /**
   * Mở side bar show hide
   */
  openShowHide(){
    this.isShowColumn = true;
  }


  filterData(filter){
    this.isShowFilter = false;
    this.baseParam.pageNumber = 1;
    this.baseParam.filterColumns = filter;
    this.getData();
  }

  openUserRole(id:number){
    this.ref = this.dialogService.open(UserRoleComponent, {
            header: 'Phân quyền người dùng',
            width: '40%',
            data : id,
            contentStyle: {"max-height": "70vh", "overflow": "auto"},
            baseZIndex: 10000
        });

        this.ref.onClose.subscribe((result: boolean) =>{
            if(result){
                this.getData();
            }
        });
  }

}
