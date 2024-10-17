import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { filter } from 'rxjs';
import { Order } from 'src/app/models/Order';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-show-order-details',
  templateUrl: './show-order-details.page.html',
  styleUrls: ['./show-order-details.page.scss'],
})
export class ShowOrderDetailsPage implements OnInit {

  order: Order | null;
  total_price: number;

  constructor(
    private loadingController: LoadingController,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
  ) {
    this.order = null;
    this.total_price = 0;
  }

  ngOnInit() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras.state) {
        this.order = navigation.extras.state['order'];
        this.order.employee = navigation.extras.state['employee'];
        this.order.printer = 'Printer-1';
  
        this.total_price = 0;
        this.order.orderLines.OrderLine.forEach(row => {
          this.total_price += row.total * 1;
        });
      }
    });
    /* this.route.queryParams.subscribe(params => {
      this.order = params['order'];
      this.order.printer = 'Printer-1';
    }) */
  }

  selectRow(index: number): void {
    console.log(index);
  }

  async handlePrintClick() {
    if (this.order === null) {
      const alert = await this.alertController.create({
        header: "Erorr",
        message: "Please select order to print.",
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      const loading = await this.loadingController.create({
        message: 'Printing...'
      });
      loading.present();
      this.dataService.printDublicate(this.order).subscribe(async (data) => {
        console.log('Printed successfully!');
        loading.dismiss();

        const alert = await this.alertController.create({
          header: "Success",
          message: "Printed successfully!",
          buttons: ['OK'],
        });
        await alert.present();
      }, async (error) => {
        console.log('Print failed.');
        loading.dismiss();
        
        const alert = await this.alertController.create({
          header: "Erorr",
          message: "Print failed.",
          buttons: ['OK'],
        });
        await alert.present();
      });
    }
  }

}
