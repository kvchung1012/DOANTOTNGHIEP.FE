import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FilterColumn, SystemTableColumn, SystemTableColumnDto } from 'src/app/service/table/model/tableModel';
import { TableColumnService } from 'src/app/service/table/table.service';

@Component({
  selector: 'app-filter-table',
  templateUrl: './filter-table.component.html',
  styleUrls: ['./filter-table.component.scss']
})
export class FilterTableComponent implements OnInit {

  // danh sách các cột cần filter
  @Input()
  tableName: string;

  @Output()
  onfilter: EventEmitter<FilterColumn[]> = new EventEmitter()


  listColumn: SystemTableColumnDto[];

  filter:FilterColumn[];

  constructor(public _tableService: TableColumnService) { }

  ngOnInit(): void {
    this.getListColumn()
  }

  getListColumn(){
      this._tableService.getListColumnFilterTable(this.tableName).subscribe(res=>{
        this.listColumn =  res;
      })
  }


  filterColumn(){
    this.filter = this.listColumn.map(x=>{
        if(x.value == null){
            return {
                columnId : x.id,
                value : null
            };
        }
        // trường hợp không null
        else{
            // string
            if(x.dataTypeId == 1 || x.dataTypeId == 2 || x.dataTypeId == 3 || x.dataTypeId == 6){
                return {
                    columnId : x.id,
                    value : x.value + ''
                };
            }
            // datetime
            else if(x.dataTypeId == 5){
                return {
                    columnId : x.id,
                    value : new Date(x.value).toISOString()
                }
            }

            // select multiple
            else return{
                columnId : x.id,
                value : x.value
            }
        }

    }).filter(x=>x.value != null);
    this.onfilter.emit(this.filter);
  }

}
