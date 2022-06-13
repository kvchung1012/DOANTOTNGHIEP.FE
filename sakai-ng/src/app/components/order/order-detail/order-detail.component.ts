import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { OrderFullDto } from 'src/app/service/order/model/orderModel';
import { OrderService } from 'src/app/service/order/order.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

    data: OrderFullDto;
    constructor(public _orderService: OrderService
        , public config: DynamicDialogConfig) {
            if (this.config.data != undefined)
                this.initData(this.config.data.id)
    }


    ngOnInit(): void {

    }

    initData(id: number) {
        this._orderService.getOrderById(id).subscribe(res => {
            console.log(res);
            this.data = res;
        })
    }

    getImagePath(path: string) {
        if (!path)
            return '../../../../assets/demo/no-image.png';
        return environment.baseUrl + path;
    }

}
