import { ProductDto } from "../../product/model/productModel";

export interface OrderDto {
    id: number;
    code: string;
    customerId: number;
    customerName: string;
    customerPhone: string;
    totalPrice: number;
    receiveMoney: number;
    changeMoney: number;
    status: number;
    statusName: string;
}

export interface ProductInCart{
    product: ProductDto,
    stock: number;
}

export interface CreateCartOrder{
    totalMoney: number;
    receiveMoney: number;
    changeMoney: number;
    customerName:string;
    customerPhone:string;
    customerEmail:string;
    saleCode?:string;
    products: ProductCart[];

}

export interface ProductCart{
    productId:number;
    stock: number;
}


export interface OrderDetailDto {
    id: number;
    orderId: number;
    productId: number;
    code: string;
    name: string;
    image: string;
    price: number;
    priceSale: number;
    stock: number;
}

export interface OrderFullDto extends OrderDto {
    customerEmail: string;
    createdTime: string;
    createdBy: number;
    createdByName: string;
    orderDetail: OrderDetailDto[];
}
