import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Product } from '../../api/product';
import { ProductService } from '../../service/productservice';
import { Subscription } from 'rxjs';
import { ConfigService } from '../../service/app.config.service';
import { AppConfig } from '../../api/appconfig';
import { TotalSystem } from 'src/app/service/dashboard/model/DashboardDto';
import { DashboardService } from 'src/app/service/dashboard/dashboard.service';
import { ProductDto } from 'src/app/service/product/model/productModel';
import { environment } from 'src/environments/environment';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

    countSystem: TotalSystem = {
        users: 0,
        orderToday: 0,
        orders: 0,
        products: 0,
        supplier: 0
    };

    listProduct: ProductDto[] = [];

    revueneInYear: number[] = [];
    revueneInMonth: number[] = [];

    items: MenuItem[];

    products: Product[];

    chartDataYear: any;
    chartDataMonth: any;

    chartOptions: any;

    years = [];
    year = 0;
    month = [1,2,3,4,5,6,7,8,9,10]
    // default
    subscription: Subscription;

    config: AppConfig;

    constructor(private productService: ProductService
        , public configService: ConfigService
        , public _dashboardService: DashboardService) { }

    ngOnInit() {
        this.initData();
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe(config => {
            this.config = config;
            this.updateChartOptions();
        });
    }

    initData() {
        var currentTime = new Date();
        //set up year
        for (let index = currentTime.getFullYear()-10; index <= currentTime.getFullYear()+10; index++) {
           this.years.push(index);
        }


        this._dashboardService.getCountSystem().subscribe(res => {
            this.countSystem = res;
        })

        this._dashboardService.getTopProduct().subscribe(res => {
            this.listProduct = res;
        })

        this.getRevueneByYear(currentTime.getFullYear());
        this.getRevueneInMonth(currentTime.getFullYear(),currentTime.getMonth())
    }

    getRevueneByYear(year: number) {
        this._dashboardService.getRevueneByYear(year).subscribe(res => {
            this.chartDataYear = {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                datasets: [
                    {
                        label: 'Doanh số trong năm',
                        data: res,
                        fill: false,
                        backgroundColor: '#22c55e',
                        borderColor: '#22c55e',
                        tension: .4
                    }
                ]
            };
        })
    }

    getRevueneInMonth(year, month) {
        debugger
        this._dashboardService.getRevueneByMonth(year, month).subscribe(res => {
            // config ngày
            var dayLength = 31;
            var arrDay = [];
            for (let i = 0; i < dayLength; i++) {
                arrDay.push(i + 1)

            }
            this.chartDataMonth = {
                labels: arrDay,
                datasets: [
                    {
                        label: 'Doanh só theo ngày',
                        data: res,
                        fill: false,
                        backgroundColor: '#2f4860',
                        borderColor: '#2f4860',
                        tension: .4
                    }
                ]
            };
        })
    }

    getImagePath(path: string) {
        if (!path)
            return '../../../../assets/demo/no-image.png';
        return environment.baseUrl + path;
    }

    selectYear(event){
        this.year = event.value;
        this.getRevueneByYear(event.value)
    }

    selectMonth(event){
        this.getRevueneInMonth(this.year,event.value)
    }

    updateChartOptions() {
        if (this.config.dark)
            this.applyDarkTheme();
        else
            this.applyLightTheme();

    }

    applyDarkTheme() {
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)',
                    }
                },
            }
        };
    }

    applyLightTheme() {
        this.chartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef',
                    }
                },
            }
        };
    }
}
