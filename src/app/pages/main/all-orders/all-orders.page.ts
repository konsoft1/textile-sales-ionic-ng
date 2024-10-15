import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, IonInput } from "@ionic/angular";
import { DataService } from "../../../services/data/data.service";
import { Order } from 'src/app/models/Order';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.page.html',
  styleUrls: ['./all-orders.page.scss'],
})
export class AllOrdersPage implements OnInit {

  salesmanId: string;
  salesmanName: string;
  rows: any[];
  orders: Order[];

  selectedRow: number | null;

  constructor(
    private dataService: DataService,
    private loadingController: LoadingController,
    private alertController: AlertController,
  ) {
    this.salesmanId = '';
    this.salesmanName = '';
    this.rows = [];

    this.selectedRow = null;
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.salesmanId = '';
    this.salesmanName = '';
    this.rows = [];

    this.selectedRow = null;
  }

  selectRow(index: number): void {
    console.log(index);
    this.selectedRow = index;
  }

  async handleSearchClick() {
    if (this.salesmanId === '') {
      const alert = await this.alertController.create({
        header: "Erorr",
        message: "Please enter your user ID",
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      this.salesmanName = '';
      this.rows = [];
      this.dataService.clientState().subscribe(async (ready) => {
        if (ready) {
          await this.getEmployee(this.salesmanId);
          if (this.salesmanName === '') {
            const alert = await this.alertController.create({
              header: "Erorr",
              message: "This is not valid ID, please check and Enter your User ID",
              buttons: ['OK'],
            });
            await alert.present();
          } else {
            await this.getOrdersForSaleman(this.salesmanId);
          }

        }
      }, error => {
        return error;
      });
    }
  }

  async getEmployee(userID: string) {
    const loading = await this.loadingController.create({
      message: 'Loading employee information...'
    });
    loading.present();
    return new Promise((resolve, reject) => {
      this.dataService.getEmployee(userID).subscribe(data => {
        this.salesmanName = data.Name;
        loading.dismiss();
        resolve(true);
      }, (error) => {
        loading.dismiss();
        reject(error);
      });

    });
  }

  async getOrdersForSaleman(userID: string) {
    const loading = await this.loadingController.create({
      message: 'Loading orders information...'
    });
    loading.present();
    return new Promise((resolve, reject) => {
      this.dataService.getOrdersForSaleman(userID).subscribe((data: [any]) => {
        this.orders = data;
        this.rows = data.map((order: any) => {
          order.quantity = 0;
          order.total = 0;
          if (order.orderLines !== null)
            for (let token of order.orderLines.OrderLine) {
              order.quantity += token.quantity * 1;
              order.total += token.total * 1;
            }
          return order;
        });
        loading.dismiss();
        resolve(true);
      }, (error) => {
        loading.dismiss();
        reject(error);
      });

    });
  }

  async handlePrintClick() {
    if (this.selectedRow === null) {
      const alert = await this.alertController.create({
        header: "Erorr",
        message: "Please select order to print.",
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      this.dataService.printDublicate(this.orders[this.selectedRow]).subscribe(data => {
        console.log('Printed successfully!');
      }, (error) => {
        console.log('Print failed.');
      });
    }
  }

}
