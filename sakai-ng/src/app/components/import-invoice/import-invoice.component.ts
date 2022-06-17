import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { ImportInvoiceService } from 'src/app/service/import-invoice/import-invoice.service';
import { OrderService } from 'src/app/service/order/order.service';
import { SystemTableColumn, BaseParamModel } from 'src/app/service/table/model/tableModel';
import { TableColumnService } from 'src/app/service/table/table.service';
import { environment } from 'src/environments/environment';
import { OrderDetailComponent } from '../order/order-detail/order-detail.component';

@Component({
  selector: 'app-import-invoice',
  templateUrl: './import-invoice.component.html',
  styleUrls: ['./import-invoice.component.scss']
})
export class ImportInvoiceComponent implements OnInit {

  // config
  tableName = 'ImportInvoice';
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

  baseUrl = environment.baseUrl;
  constructor(public _tableService: TableColumnService
            , public _importInvoiceService: ImportInvoiceService
            , private confirmationService: ConfirmationService
            , private messageService: MessageService
            , private primengConfig: PrimeNGConfig
            , private _router: Router
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
      this._importInvoiceService.getData(this.baseParam).subscribe(res=>{
          this.isLoading = false;
          this.listData.length = 0;
          this.listData.push(...res.result);
          this.totalCount = res.count;
      },
      err=>{
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
    this._router.navigate(['/admin/import-invoice/create'])
  }

  /**
   * Hàm sửa
   */
  edit(item){
    this._router.navigate(['/admin/update-product',item.id])
  }

  viewDetail(item){
   this.ref = this.dialogService.open(OrderDetailComponent, {
       modal:true,
       data : item,
       header: 'Xem chi tiết hóa đơn',
       width: '70%',
       contentStyle: {"max-height": "700px", "overflow": "auto"},
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
           //  this._orderService.delete(item.id).subscribe(res=>{
           //      this.messageService.add({severity:'success', summary: 'Success', detail: 'Message Content'});
           //      this.getData();
           //  })
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
