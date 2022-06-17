import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartDetailComponent } from './cart-detail/cart-detail.component';
import { LayoutComponent } from './layout/layout.component';
import { ListProductComponent } from './list-product/list-product.component';
import { LoginClientComponent } from './login-client/login-client.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: LayoutComponent,
                children : [
                    {
                        path: '', component: ListProductComponent,
                    },
                    {
                        path: 'gio-hang', component: CartDetailComponent,
                    }
                ]
            },
            {
                path:'dang-nhap',
                component : LoginClientComponent
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppClientRoutingModule { }
