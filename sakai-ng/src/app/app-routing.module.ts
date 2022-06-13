import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { CategoryComponent } from './components/category/category.component';
import { AppMainComponent } from './app.main.component';
import { AccessComponent } from './components/access/access.component';
import { ChartsComponent } from './components/charts/charts.component';
import { EmptyComponent } from './components/empty/empty.component';
import { ErrorComponent } from './components/error/error.component';
import { MaterialComponent } from './components/material/material.component';
import { SupplierComponent } from './components/supplier/supplier.component';
import { ProductComponent } from './components/product/product.component';
import { CreateProductComponent } from './components/product/create-product/create-product.component';
import { LoginComponent } from './components/login/login.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { DiscountComponent } from './components/discount/discount.component';
import { OrderComponent } from './components/order/order.component';
import { CreateOrderComponent } from './components/order/create-order/create-order.component';
import { PermissionComponent } from './components/permission/permission.component';
import { UserComponent } from './components/user/user.component';
import { PositionComponent } from './components/position/position.component';
import { CreateUserComponent } from './components/user/create-user/create-user.component';
import { ImportInvoiceComponent } from './components/import-invoice/import-invoice.component';
import { CreateImportInvoiceComponent } from './components/import-invoice/create-import-invoice/create-import-invoice.component';
import { WarehouseComponent } from './components/warehouse/warehouse.component';
import { ExportInvoiceComponent } from './components/warehouse/export-invoice/export-invoice.component';
@NgModule({
    imports: [
        RouterModule.forRoot([
            {
                path: '', component: AppMainComponent,
                children: [
                    {path: '', component: DashboardComponent},
                    {path: 'uikit/menu', loadChildren: () => import('./components/menus/menus.module').then(m => m.MenusModule)},
                    {path: 'uikit/charts', component: ChartsComponent},
                    {path: 'pages/empty', component: EmptyComponent},
                    {path: 'category', component: CategoryComponent},
                    {path: 'discount', component: DiscountComponent},
                    {path: 'material', component: MaterialComponent},
                    {path: 'supplier', component: SupplierComponent},

                    // sản phẩm
                    {path: 'product', component: ProductComponent},
                    {path: 'create-product', component: CreateProductComponent},
                    {path: 'update-product/:id', component: CreateProductComponent},

                    // đơn hàng
                    {path: 'order', component: OrderComponent},
                    {path: 'create-order', component: CreateOrderComponent},

                    // giỏ hàng
                    {path: 'import-invoice', component: ImportInvoiceComponent},
                    {path: 'import-invoice/create', component: CreateImportInvoiceComponent},
                    {path: 'warehouse', component: WarehouseComponent},
                    {path: 'export-invoice', component: ExportInvoiceComponent},


                    // cài đặt quyền
                    {path:'permission-setting',component:PermissionComponent},
                    {path:'position',component:PositionComponent},

                    // user
                    {path:'user-manager',component:UserComponent},
                    {path:'user-manager/create-user',component:CreateUserComponent},
                    {path:'user-manager/update-user/:id',component:CreateUserComponent}
                ],
            },
            {path:'pages/landing', component: LoginComponent},
            {path:'pages/login', component: LoginComponent},
            {path:'pages/error', component: ErrorComponent},
            {path:'pages/notfound', component: NotfoundComponent},
            {path:'pages/access', component: AccessComponent},
            {path: '**', redirectTo: 'pages/notfound'},
        ], {scrollPositionRestoration: 'enabled', anchorScrolling:'enabled'})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
