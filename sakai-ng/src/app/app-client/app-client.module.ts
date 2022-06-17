import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { AppClientRoutingModule } from './app-client-routing.module';
import { ListProductComponent } from './list-product/list-product.component';
import { ButtonModule } from 'primeng/button';
import { CarouselModule } from 'primeng/carousel';
import { BadgeModule } from 'primeng/badge';
import { CartComponent } from './cart/cart/cart.component';
import { SidebarModule } from 'primeng/sidebar';
import { LoginClientComponent } from './login-client/login-client.component';
import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { FormsModule } from '@angular/forms';
import { JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { CartDetailComponent } from './cart-detail/cart-detail.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ListProductComponent,
    CartComponent,
    LoginClientComponent,
    CartDetailComponent,
  ],
  imports: [
    CommonModule,
    AppClientRoutingModule,
    ButtonModule,
    CarouselModule,
    BadgeModule,
    SidebarModule,
    CheckboxModule,
    PasswordModule,
    FormsModule
  ],
  providers: [{ provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, JwtHelperService]
})
export class AppClientModule { }
