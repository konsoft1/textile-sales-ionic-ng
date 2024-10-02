import { Employee } from "./Employee";
import { Product } from "./Product";

export interface OrderLine {
    product: Product;
    quantity: number;
    pieces: number;
    total: number;
}

export interface ArrayOfOrderLine {
    OrderLine: OrderLine[];
}

export interface Order {
    orderLines: ArrayOfOrderLine;
    employee: Employee;
    barcode: string;
    number: string;
    total: number;
    dateTime: string;
    printer: string;
    btw_perc: string;
}

export function initializeOrder(): Order {
    return {
        orderLines: {OrderLine: []},
        employee: null,
        barcode: '',
        number: '',
        total: 0,
        dateTime: '',
        printer: '',
        btw_perc: '',
    }
}