import { Component, OnInit } from '@angular/core';
import { AppMainComponent } from './app.main.component';

@Component({
    selector: 'app-menu',
    template: `
        <div class="layout-menu-container">
            <ul class="layout-menu" role="menu" (keydown)="onKeydown($event)">
                <li app-menu class="layout-menuitem-category" *ngFor="let item of model; let i = index;" [item]="item" [index]="i" [root]="true" role="none">
                    <div class="layout-menuitem-root-text" [attr.aria-label]="item.label">{{item.label}}</div>
                    <ul role="menu">
                        <li app-menuitem *ngFor="let child of item.items" [item]="child" [index]="i" role="none"></li>
                    </ul>
                </li>
                <a href="https://www.primefaces.org/primeblocks-ng/#/">
                    <img src="assets/layout/images/{{appMain.config.dark ? 'banner-primeblocks-dark' : 'banner-primeblocks'}}.png" alt="Prime Blocks" class="w-full mt-3"/>
                </a>
            </ul>
        </div>
    `
})
export class AppMenuComponent implements OnInit {

    model: any[];

    constructor(public appMain: AppMainComponent) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items:[
                    {label: 'Dashboard',icon: 'pi pi-fw pi-home', routerLink: ['/']}
                ]
            },
            {
                label: 'Cửa hàng',
                items:[
                    {label: 'Danh mục sản phẩm',icon: 'pi pi-tags', routerLink: ['/category']},
                    {label: 'Sản phẩm',icon: 'pi pi-th-large', routerLink: ['/product']},
                    {label: 'Chương trình khuyến mãi',icon: 'pi pi-heart', routerLink: ['/discount']},
                    {label: 'Mã khuyến mãi',icon: 'pi pi-heart', routerLink: ['/salecode']},
                    {label: 'Quản lý chất liệu',icon: 'pi pi-prime', routerLink: ['/material']},
                    {label: 'Quản lý nhà cung cấp',icon: 'pi pi-id-card', routerLink: ['/supplier']},
                    {label: 'Quản lý đơn hàng',icon: 'pi pi-shopping-cart', routerLink: ['/order']},
                ]
            },
            {
                label: 'Quản lý kho',
                items:[
                    {label: 'Nhập hàng',icon: 'pi pi-id-card', routerLink: ['/import-invoice']},
                    {label: 'Xuất hàng',icon: 'pi pi-tags', routerLink: ['/export-invoice']},
                    {label: 'Kho hàng',icon: 'pi pi-desktop', routerLink: ['/warehouse']},
                ]
            },
            {
                label: 'Cài đặt',
                items:[
                    {label: 'Tài khoản',icon: 'pi pi-tags', routerLink: ['/user-manager']},
                    {label: 'Chức vụ',icon: 'pi pi-sitemap', routerLink: ['/position']},
                    {label: 'Cài đặt quyền',icon: 'pi pi-tags', routerLink: ['/permission-setting']},
                ]
            },
            {
                label: 'Trang chủ',
                items:[
                    {
                        label: 'Trang chủ',
                        routerLink: ['/trang-chu'],
                    }
                ]
            }
        ];
    }

    onKeydown(event: KeyboardEvent) {
        const nodeElement = (<HTMLDivElement> event.target);
        if (event.code === 'Enter' || event.code === 'Space') {
            nodeElement.click();
            event.preventDefault();
        }
    }
}
