import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Order } from 'aws-sdk/clients/mediaconvert';
import { OrderModel } from 'src/app/models/orderModel';
import { Timestamp } from '@angular/fire/firestore';
import { ProductDetailsModalComponent } from '../product-detail/product-details-modal.component';
import { title } from 'process';

@Component({
  selector: 'app-order-details-modal',
  templateUrl: './order-details-modal.component.html',
  styleUrls: ['./order-details-modal.component.scss']
})
export class OrderDetailsModalComponent {
  displayedColumns: string[] = ['establishment', 'status', 'address', 'dateTime'];
  dataSource: OrderModel[];
  titleScreen: string;

  constructor(
    public dialogRef: MatDialogRef<OrderDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { orders: OrderModel[], title: string },
    private dialog: MatDialog
  ) {
    this.dataSource = this.data.orders;
    this.dataSource.forEach(order => {
      if (order.dateCreated instanceof Timestamp) {
        order.dateCreated = this.convertTimestampToDate(order.dateCreated);
      }
    });
    this.titleScreen = this.data.title;
  }

  openProductDetails(order: OrderModel): void {
    const dialogRef = this.dialog.open(ProductDetailsModalComponent, {
      width: '100%',
      data: { order: order }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Product details modal closed');
    });
  }

  convertTimestampToDate(timestamp: Timestamp): Date {
    return new Date(timestamp.seconds * 1000);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
