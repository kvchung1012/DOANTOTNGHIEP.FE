import { Component, OnInit } from '@angular/core';
import { ConfirmationService, Message, MessageService, PrimeNGConfig } from 'primeng/api';
import { CategoryService } from 'src/app/service/category/category.service';
import { BaseParamModel, SystemTableColumn } from 'src/app/service/table/model/tableModel';
import { TableColumnService } from 'src/app/service/table/table.service';
import {DialogService, DynamicDialogRef} from 'primeng/dynamicdialog';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { CategoryDto } from 'src/app/service/category/model/categoryModel';
@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  // config
  tableName = 'Category';
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
            , public _categoryService: CategoryService
            , private confirmationService: ConfirmationService
            , private messageService: MessageService
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
        this.listColumnTable = res;
        this.listColumnFilter = res.filter(x=>x.isFilter);
        this.listColumnShow = res.filter(x=>x.isShow);
    })
  }


  // lấy ra data
  getData(){
      this.isLoading = true;
      this._categoryService.getData(this.baseParam).subscribe(res=>{
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
    this.ref = this.dialogService.open(CreateCategoryComponent, {
        header: 'Thêm mới danh mục sản phẩm',
        width: '50%',
        contentStyle: {"max-height": "500px", "overflow": "auto"},
        baseZIndex: 10000
    });

    this.ref.onClose.subscribe((result: boolean) =>{
        if(result){
            this.getData();
        }
    });
  }

  /**
   * Hàm sửa
   */
  edit(item){
    this.ref = this.dialogService.open(CreateCategoryComponent, {
        modal:true,
        data : item,
        header: 'Chỉnh sửa danh mục sản phẩm',
        width: '50%',
        contentStyle: {"max-height": "500px", "overflow": "auto"},
        baseZIndex: 10000
    });

    this.ref.onClose.subscribe((result: boolean) =>{
        if(result){
            // this.messageService.add({severity:'success', summary: 'Thành công', detail: 'Thêm mới danh mục thành công'});
            this.getData();
        }
    });
  }

  /**
   * Hàm xóa
   */
   deleteItem(item){
    this.confirmationService.confirm({
        message: 'Bạn có chắc muốn xóa danh mục sản phẩm không?',
        header: 'Xác nhận đồng ý',
        icon: 'pi pi-exclamation-triangle',
        rejectButtonStyleClass:'p-button-danger',
        acceptLabel:'Đồng ý',
        rejectLabel:'Hủy bỏ',
        accept: () => {
            this._categoryService.delete(item.id).subscribe(res=>{
                this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});
                this.getData();
            })
        },
        reject: () => {
           // this.messageService.add({severity:'danger', summary: 'Success', detail: 'Message Content'});
        }
    });
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
}
