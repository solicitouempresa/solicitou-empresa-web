import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';

import { DashboardPageComponent } from './containers';
import {
  SupportRequestsComponent
} from './components';
import { SharedModule } from '../../shared/shared.module';
import { DashboardService } from './services';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { OrderDetailsModalComponent } from 'src/app/modal/order-detail/order-details-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';
import { ProductDetailsModalComponent } from 'src/app/modal/product-detail/product-details-modal.component';


@NgModule({
  declarations: [
    DashboardPageComponent,
    SupportRequestsComponent,
    OrderDetailsModalComponent,
    ProductDetailsModalComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatProgressBarModule,
    MatToolbarModule,
    MatGridListModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    SharedModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatTableModule,
    MatSortModule
  ],
  exports: [
  ],
  providers: [
    DashboardService
  ]
})
export class DashboardModule { }
