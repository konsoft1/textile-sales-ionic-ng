import { Component, OnInit } from '@angular/core';
import { LoadingController, AlertController, IonInput, NavController } from "@ionic/angular";
import { DataService } from "../../../services/data/data.service";
import { Order } from 'src/app/models/Order';
import { Router } from '@angular/router';
import { Employee } from 'src/app/models/Employee';

@Component({
  selector: 'app-all-orders',
  templateUrl: './all-orders.page.html',
  styleUrls: ['./all-orders.page.scss'],
})
export class AllOrdersPage implements OnInit {

  today: string;
  
  selectedRow: number | null;

  salesmanId: string;
  salesmanName: string;
  employee: Employee | null;
  rows: any[];
  orders: Order[];
  total_price: number;

  constructor(
    private dataService: DataService,
    private loadingController: LoadingController,
    private router: Router,
    private alertController: AlertController,
    private navController: NavController,
  ) {
    this.today = new Date().toLocaleDateString('en-GB');
    this.selectedRow = null;

    this.salesmanId = '';
    this.salesmanName = '';
    this.employee = null;
    this.rows = [];
    this.orders = [];
    this.total_price = 0;
    this.selectedRow = null;
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    /* this.salesmanId = '';
    this.salesmanName = '';
    this.employee = null;
    this.rows = [];
    this.orders = [];
    this.total_price = 0;
    this.selectedRow = null; */
  }

  selectRow(index: number): void {
    console.log(index);
    this.selectedRow = index;
    /* this.navController.navigateForward('/details', {
      queryParams: {
        order: this.orders[index]
      }
    }); */
    this.router.navigate(['/details'], {
      state: {
        order: this.orders[index],
        employee: this.employee
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
      this.employee = null;
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
        this.employee = data;
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
        this.total_price = 0;
        this.rows = data.map((order: any) => {
          order.quantity = 0;
          order.total = 0;
          if (order.orderLines !== null)
            for (let token of order.orderLines.OrderLine) {
              order.quantity += token.quantity * 1;
              order.total += token.total * 1;
            }
          this.total_price += order.total;
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
