import { Component, OnInit } from '@angular/core';
import { MessageService, PrimeNGConfig, TreeNode } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreatePermissionRole, PermissionDto, RoleDto } from 'src/app/service/permission/model/PermissionDto';
import { PermissionService } from 'src/app/service/permission/permission.service';
import { CreateRoleComponent } from './create-role/create-role.component';

@Component({
    selector: 'app-permission',
    templateUrl: './permission.component.html',
    styleUrls: ['./permission.component.scss']
})
export class PermissionComponent implements OnInit {


    nodes: TreeNode[] = [];

    nodeSelected: TreeNode[] = [];

    listRole : RoleDto[];
    listPermission: PermissionDto[];

    roleCurrent: number = 0;

    ref: DynamicDialogRef;
    constructor(public _permissionService: PermissionService
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
        this._permissionService.getAllRole().subscribe(res=>{
            this.listRole = res;
        })
    }

    /**
     * Hàm load các permission cho từng role
     * @param item chọn role
     */
    chooseRole(item:RoleDto){
        this.roleCurrent = item.id;
        this._permissionService.getPermissionByRole(item.id).subscribe(res=>{
            this.listPermission = res;
            this.nodes = [];
            this.nodeSelected = [];
            this.mapPermissionToTreeNode(this.nodes,res,0);
        })
    }

    /**
     * Hàm đệ quy để set vào tree node
     * @param nodes
     * @param listPermission
     * @param parentId
     * @returns
     */
    mapPermissionToTreeNode(nodes:TreeNode[],listPermission:PermissionDto[],parentId:number){
        if(listPermission.filter(x=>x.parentId == parentId).length == 0)
            return;
        // add to root nodes
        nodes.push(...listPermission.filter(x=>x.parentId == parentId).map(x=>{
            return {
                label : x.name,
                data: x,
            }
        }))

        // đệ quy add vào thằng con
        nodes.forEach(x=>{
            this.mapPermissionToTreeNode(x.children = [],listPermission,x.data.permissionId)
            x.type =  x.children.length == 0?'child':'parent';
            // nếu là parent
            if(x.type=='parent'){
                x.data.checked = null;
               if(x.children.length == x.children.filter(x=>x.data.checked).length){
                    x.data.checked = true;
               }
               else if(x.children.filter(x=>x.data.checked).length > 0){
                    x.data.checked = false;
               }
            }
        })
    }

    /**
     * Hàm khi bấm chọn all hay uncheck all
     * @param node
     */
    checkAllChild(node:TreeNode){
        let value = node.data.checked;
        this.updateChildSelection(node,value);
        this.checkItemPermission(node);
    }

    /**
     * Hàm đệ quy để cập nhật tất cả các nốt con
     * @param node
     * @param value
     * @returns
     */
    updateChildSelection(node:TreeNode,value){
        if(node.children.length==0)
            return;
        node.children.forEach(x=>{
            x.data.checked = value;
            if(x.type == 'child'){
                x.data.checked = value==true?true:false;
            }
            this.updateChildSelection(x,value);
        })
    }


    /**
     * Hàm chọn hoặc không chọn mà cập nhật lại parent
     * @param node
     */
    checkItemPermission(node:TreeNode){
        if(node.parent != null)
        {
            if(node.data.checked){
                node.parent.data.checked = node.parent.children.length == node.parent.children.filter(x=>x.data.checked).length;
            }
            else{
                node.parent.data.checked = node.parent.children.filter(x=>x.data.checked).length==0?null:false;
            }
            this.checkItemPermission(node.parent);
        }

    }

    /**
     * Hàm lưu lại quyền
     */
    savePermission(){
        const permissonRole: CreatePermissionRole[]=  [];
        this.readPermissionChecked(this.nodes,permissonRole);
        // gửi tới server tại đây
        this._permissionService.createPermissionRole(permissonRole).subscribe(res=>{
            if(res>0){
                this.messageService.add({severity:'success', summary: 'Thành công', detail: 'Cập nhật quyền thành công'});
            }
            else{
                this.messageService.add({severity:'danger', summary: 'Thất bại', detail: 'Lỗi hệ thống vui lòng thử lại'});
            }
        })
    }


    /**
     * Đọc các node đã tick chọn là true
     * @param node
     * @param permissonRole
     */
    readPermissionChecked(node:TreeNode[],permissonRole:CreatePermissionRole[]){
        node.forEach(x=>{
            if(x.data.checked){
                permissonRole.push({
                    roleId : this.roleCurrent,
                    permissonId : x.data.permissionId
                })
            }
            if(x.children.length>0)
                this.readPermissionChecked(x.children,permissonRole);
        })
    }


    createRole(roleDto:RoleDto = null){
        this.ref = this.dialogService.open(CreateRoleComponent, {
            header: 'Thêm mới quyền',
            width: '50%',
            data : roleDto,
            contentStyle: {"max-height": "500px", "overflow": "auto"},
            baseZIndex: 10000
        });

        this.ref.onClose.subscribe((result: boolean) =>{
            if(result){
                this.initData();
            }
        });
    }
}
