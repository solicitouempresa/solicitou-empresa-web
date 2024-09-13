import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { OrderModel } from 'src/app/models/orderModel';
import { OrdersService } from 'src/app/pages/orders/services/orders.service';

@Component({
  selector: 'app-product-details-modal',
  templateUrl: './product-details-modal.component.html',
  styleUrls: ['./product-details-modal.component.scss']
})
export class ProductDetailsModalComponent {
  displayedColumns: string[] = ['name', 'description', 'quantity', 'price', 'total'];

  constructor(
    public dialogRef: MatDialogRef<ProductDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { order: OrderModel },
    public dialog: MatDialog,
    private orderService: OrdersService
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  recoveryNextStatus(status: string): string {
    if(status === 'SOLICITADO') {
        return 'PREPARANDO PEDIDO';
    }
    if(status === 'PREPARANDO PEDIDO') {
        return 'ENTREGANDO';
    }
    if(status === 'ENTREGANDO') {
        return 'ENTREGUE';
    }
  }

  advanceStatus(order: OrderModel): void {
    order.statusOrder = this.recoveryNextStatus(order.statusOrder);
    this.orderService.updateOrder(order);
    this.dialog.closeAll();
  }
}
