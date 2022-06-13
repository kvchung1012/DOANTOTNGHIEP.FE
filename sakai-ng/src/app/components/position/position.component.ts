import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig, TreeNode } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { RoleDto } from 'src/app/service/permission/model/PermissionDto';
import { PositionDto } from 'src/app/service/position/model/PositionDto';
import { PositionService } from 'src/app/service/position/position.service';
import { PositionDetailComponent } from './position-detail/position-detail.component';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit {

    nodes: TreeNode[];
    selectedNode: TreeNode;
    positions: PositionDto[];
    listRole : RoleDto[];

    roleCurrent: number = 0;

    ref: DynamicDialogRef;
    constructor(public _positionService: PositionService
              , private messageService: MessageService
              , private primengConfig: PrimeNGConfig
              , public dialogService: DialogService) { }

    ngOnInit(): void {
        this.initData();
    }


    /**
     * Hàm khởi tạo các giá trị mặc định
     */
    initData(){
        this._positionService.getAllPosition().subscribe(res=>{
            this.positions = res;
            this.mapPositionToTreeNode(this.nodes = [],this.positions,0);
        })
    }

    /**
     * Hàm đệ quy để set vào tree node
     * @param nodes
     * @param listPositions
     * @param parentId
     * @returns
     */
     mapPositionToTreeNode(nodes:TreeNode[],listPositions:PositionDto[],parentId:number){
        if(listPositions.filter(x=>x.parentId == parentId).length == 0)
            return;
        // add to root nodes
        nodes.push(...listPositions.filter(x=>x.parentId == parentId).map<TreeNode>(x=>{
            return {
                label : x.name,
                data: x,
                expanded : true,
                children: []
            }
        }))
        // đệ quy add vào thằng con
        nodes.forEach(x=>{
            this.mapPositionToTreeNode(x.children,listPositions,x.data.id)
        })
    }


    /**
     * Hàm khi chọn vào các node
     * @param event
     */
    onNodeSelect(node:TreeNode) {
        this.ref = this.dialogService.open(PositionDetailComponent, {
            header: 'Cập nhật dữ liệu',
            width: '75%',
            data: {
                data : node.data,
                isUpdate : true
            },
            contentStyle: {"max-height": "600px", "overflow": "auto"},
            baseZIndex: 10000
        });

        this.ref.onClose.subscribe((result: boolean) =>{
            this.initData();
        });
    }


    addNode(node:TreeNode){
        debugger
        this.ref = this.dialogService.open(PositionDetailComponent, {
            header: 'Thêm mới dữ liệu',
            width: '75%',
            data: {
                data : node.data,
                isUpdate : false
            },
            contentStyle: {"max-height": "600px", "overflow": "auto"},
            baseZIndex: 10000
        });

        this.ref.onClose.subscribe((result: boolean) =>{
            this.initData();
        });
    }
}
