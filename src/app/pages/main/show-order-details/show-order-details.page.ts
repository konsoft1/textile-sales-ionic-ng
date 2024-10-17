import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { Order } from 'src/app/models/Order';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-show-order-details',
  templateUrl: './show-order-details.page.html',
  styleUrls: ['./show-order-details.page.scss'],
})
export class ShowOrderDetailsPage implements OnInit {

  order: Order;

  selectedRow: number | null;

  constructor(
    private loadingController: LoadingController,
    private dataService: DataService,
    private router: Router,
    private route: ActivatedRoute,
    private alertController: AlertController,
  ) {
    this.selectedRow = null;
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.order = navigation.extras.state['order'];
      this.order.printer = 'Printer-1';
    }
    /* this.route.queryParams.subscribe(params => {
      this.order = params['order'];
      this.order.printer = 'Printer-1';
    }) */
  }

  selectRow(index: number): void {
    console.log(index);
    this.selectedRow = index;
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
      const loading = await this.loadingController.create({
        message: 'Loading employee information...'
      });
      loading.present();
      this.dataService.printDublicate(this.order).subscribe(data => {
        console.log('Printed successfully!');
        loading.dismiss();
      }, (error) => {
        console.log('Print failed.');
        loading.dismiss();
      });
    }
  }

}
