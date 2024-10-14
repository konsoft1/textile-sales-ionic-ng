import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { DataService } from "../../../services/data/data.service";
import { ActivatedRoute } from "@angular/router";
import { Observable, Subscription, max } from 'rxjs';
import { Employee } from 'src/app/models/Employee';
import { Product, initializeProduct } from 'src/app/models/Product';
import { Store } from '@ngrx/store';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { setProduct } from 'src/app/store/production/actions';
import { ArrayOfOrderLine, initializeOrder, Order, OrderLine } from 'src/app/models/Order';
//import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { BarcodeFormat, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit, OnDestroy {
  content_loaded: boolean = false;
  employee$: Observable<Employee>;
  product: Product;
  products: Product[];
  subscription: Subscription;
  productSub: Subscription;
  artcode: string;
  label: string;
  description: string;
  price: string;
  newprice: string;
  quantity: string;
  pieces: string;
  printer: string;
  rows: any[];
  informationEmployee: Employee;
  index: number;
  selectedIndexes: number[];
  scanning: boolean;
  total_price: number;


  constructor(
    private activedRoute: ActivatedRoute,
    private dataService: DataService,
    private store: Store<{ employee: Employee, product: Product }>,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private changeDetector: ChangeDetectorRef,
    private navController: NavController) {
    this.employee$ = store.select('employee');
    this.products = [];
    this.rows = [];
    this.index = 0;
    this.selectedIndexes = [];
    this.pieces = "1";
    this.printer = "Printer-1";
    this.scanning = false;
    this.total_price = 0;
    // this.product$ = store.select('product');
  }

  intializateProduct() {
    this.artcode = "";
    this.label = "";
    this.description = "";
    this.price = "";
    this.newprice = "";
    this.quantity = "";
    this.pieces = "1";
    this.product = initializeProduct();
  }

  ionViewWillEnter() {
    this.clearFields();
      
    this.products = [];
    this.rows = [];
    this.index = 0;
    this.selectedIndexes = [];
    this.total_price = 0;
  }

  ngOnInit() {

    setTimeout(() => {
      this.content_loaded = true;
      this.subscription = this.employee$.subscribe((employee) => {
        this.informationEmployee = employee;
      });
    }, 2000);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.productSub.unsubscribe();
  }

  async handleScanClick(event) {
    //this.navController.navigateForward('/barscan');

    //this.scanning = true;
    const { barcodes } = await BarcodeScanner.scan();
    this.artcode = barcodes[0].displayValue;
    this.handleSearchClick(null);
    //this.scanning = false;

    /* const allowed = await this.check_camera_permission();
    console.log('Scan allow', allowed);

    if (allowed) {
      this.scanning = true;
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scanning = false;
        this.artcode = result.content;

        this.handleSearchClick(null);
      } else {
        console.log('Scan not succesfull!');
      }
    } else {
      console.log('Camera permission not allowed!');

      const alert = await this.alertController.create({
        header: "Erorr",
        message: "Camera permission not allowed!",
        buttons: ['OK'],
      });
      await alert.present();
    } */
  }

  stop_camera() {
    //BarcodeScanner.stopScan();
    this.scanning = false;
  }

  /* async check_camera_permission() {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  } */

  async handleSearchClick(event) {
    if (this.artcode === '') {
      const alert = await this.alertController.create({
        header: "Erorr",
        message: "Please enter your code",
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      this.dataService.clientState().subscribe(async (ready) => {
        if (ready) {
          await this.getProduct(this.artcode);
          if (!this.product.ART_CODE || this.product.ART_CODE === '') {
            const alert = await this.alertController.create({
              header: "Erorr",
              message: "This is not valid ID, please check and Enter your User ID",
              buttons: ['OK'],
            });
            await alert.present();
            return;
          } else {
            this.artcode = this.product.ART_CODE;
            this.price = this.product.prijs;
            this.newprice = this.product.NewPrijs;
            this.description = this.product.details;
            this.label = this.product.LABEL;
          }
          // this.productSub = this.product$.subscribe(async (product) => {


          // })
          // if (this.employee.Name === '') {

          // } else {

          // }

        }
      }, error => {
        return error;
      });
    }
  }

  async handleAddClick(event) {
    if (this.product.ART_CODE === '') {
      const alert = await this.alertController.create({
        header: "Erorr",
        message: "Please fill up product equipment information",
        buttons: ['OK'],
      });
      await alert.present();
    } else {
      this.products.push(this.product);
      console.log(this.product);
      const artcode = this.product.ART_CODE;
      let quantity;
      if (!parseFloat(this.quantity)) {
        quantity = 1;
      } else {
        quantity = parseFloat(this.quantity);
      }
      const price = parseFloat(this.product.prijs);
      const newprice = parseFloat(this.product.NewPrijs);
      const rate = (!newprice || newprice == 0) || new Date(this.product.EndDateTime.replace(' ', 'T')) < new Date() ? price : newprice;
      const total = rate * quantity;
      const pieces = parseFloat(this.pieces);
      this.rows.push({
        // id: this.index++,
        article: artcode.toString(),
        quantity: quantity.toString(),
        oldprice: price,
        rate: rate.toString(),
        pieces: pieces,
        total: total.toString(),
        class: 'data-row',
      });
      this.total_price += total;
      this.intializateProduct();
    }

  }

  handleRowClick(id) {
    console.log(id)
      ;
    let pos = this.selectedIndexes.indexOf(id)
      ;
    if (pos !== -1) {
      this.selectedIndexes.splice(pos, 1);
      // console.log(pos);
      this.rows[id].class = 'data-row';
    } else {
      this.selectedIndexes.push(id)
        ;
      this.rows[id].class = 'data-row selected';
    }
    // console.log(this.selectedIndexes);
  }

  async getProduct(ART_CODE: string) {
    const loading = await this.loadingController.create({
      message: 'Loading product information...'
    });
    loading.present();
    return new Promise((resolve, reject) => {
      this.dataService.getProduct(ART_CODE).subscribe(data => {
        this.product = data;
        loading.dismiss();
        resolve(true);
      }, (error) => {
        loading.dismiss();
        reject(error);
      });

    });
  }

  // Function to clear all input fields
  clearFields(): void {
    this.artcode = '';
    this.label = '';
    this.description = '';
    this.price = '';
    this.newprice = '';
    this.quantity = '';
    this.pieces = '1';
  }

  handleDeleteClick(event) {
    const sortedIndexes = this.selectedIndexes.sort((a, b) => b - a);

    sortedIndexes.forEach(index => {
      this.rows.splice(index, 1);
    })

    console.log(this.rows);

    this.selectedIndexes = [];
    this.total_price = 0;
  }

  handlePrintClick() {
    let order: Order = initializeOrder();

    let total = 0;
    let cnt = 0;

    order.orderLines.OrderLine = this.products.map((product: Product, idx: number): OrderLine => {
      product.prijs = this.rows[idx].rate;
      const orderline: OrderLine = {
        product: product,
        quantity: this.rows[idx].quantity,
        pieces: this.rows[idx].pieces,
        total: this.rows[idx].total,
      };

      cnt++;
      total += orderline.total * 1;

      return orderline;
    });
    order.employee = this.informationEmployee;
    //order.barcode = this.artcode;
    order.number = cnt + '.00';
    order.total = total;
    order.dateTime = new Date().toISOString();
    order.printer = this.printer;

    this.dataService.testPrint(order).subscribe(data => {
      console.log('print data: ', data);

      this.clearFields();
      
      this.products = [];
      this.rows = [];
      this.index = 0;
      this.selectedIndexes = [];
      this.total_price = 0;
    }, (error) => {
      console.log('print error: ', error);
    });
  }

}