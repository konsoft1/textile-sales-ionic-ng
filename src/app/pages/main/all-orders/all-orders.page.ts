import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, IonInput, NavController } from "@ionic/angular";
import { DataService } from "../../../services/data/data.service";
import { Order } from 'src/app/models/Order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.page.html',
  styleUrls: ['./all-orders.page.scss'],
})
export class AllOrdersPage implements OnInit {

  today: string;

  salesmanId: string;
  salesmanName: string;
  rows: any[];
  orders: Order[];

  constructor(
    private dataService: DataService,
    private loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
  ) {
    this.today = new Date().toLocaleDateString('en-GB');

    this.salesmanId = '';
    this.salesmanName = '';
    this.rows = [];
    this.orders = [];
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.salesmanId = '';
    this.salesmanName = '';
    this.rows = [];
    this.orders = [];
  }

  selectRow(index: number): void {
    console.log(index);
    /* this.navController.navigateForward('/details', {
      queryParams: {
        order: this.orders[index]
      }
    }); */
    this.router.navigate(['/details'], {
      state: {
        order: this.orders[index]
      }
    })
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

}
