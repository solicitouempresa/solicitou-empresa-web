import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardService } from '../../services';
import {
  DailyLineChartData,
  PerformanceChartData,
  ProjectStatData,
  RevenueChartData,
  ServerChartData,
  SupportRequestData,
  VisitsChartData
} from '../../models';
import { OrdersService } from 'src/app/pages/orders/services/orders.service';
import { OrderModel } from 'src/app/models/orderModel';
import { OrderDetailsModalComponent } from 'src/app/modal/order-detail/order-details-modal.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit{
  private dialogRef: MatDialogRef<OrderDetailsModalComponent> | null = null;
  public dailyLineChartData$: Observable<DailyLineChartData>;
  public performanceChartData$: Observable<PerformanceChartData>;
  public revenueChartData$: Observable<RevenueChartData>;
  public serverChartData$: Observable<ServerChartData>;
  public supportRequestData$: Observable<SupportRequestData[]>;
  public visitsChartData$: Observable<VisitsChartData>;
  public projectsStatsData$: Observable<ProjectStatData>;
  data:any;
  loading:boolean;
  valuesWin: number = 0;
  valuesImpost: number = 0;
  countSale:number = 0;
  sysdate:Date;
  establishmentActive:number;
  public idEstablishment = localStorage.getItem('idEstablishment');
  ordersData:OrderModel[];

  countSolicitado: number = 0;
  countPreparandoPedido: number = 0;
  countEntregando: number = 0;
  countEntregue: number = 0;

  constructor(private service: DashboardService,private orderService:OrdersService, private dialog: MatDialog) {
    // this.dailyLineChartData$ = this.service.loadDailyLineChartData();
    // this.performanceChartData$ = this.service.loadPerformanceChartData();
    // this.revenueChartData$ = this.service.loadRevenueChartData();
    // this.serverChartData$ = this.service.loadServerChartData();
    // this.supportRequestData$ = this.service.loadSupportRequestData();
    // this.visitsChartData$ = this.service.loadVisitsChartData();
    // this.projectsStatsData$ = this.service.loadProjectsStatsData();
    this.data = [{'name':'a','age':20},{'name':'b','age':30} ]
    this.sysdate = new Date();

    if(this.idEstablishment){
      this.loadData(this.idEstablishment);
       }
       else{
        alert('Não conseguimos carregar os dados dos PEDIDOS, entre em contato com o suporte')
       }
  }

  ngOnInit(): void {
    this.loading = true;
    this.countOrderBySolicitado();
    this.countOrderByPreparandoPedido();
    this.countOrderByEntregando();
    this.countOrderByEntregue();
  }

  loadData(idEstablishment: string){
    this.loading = true;
    this.orderService.getIdEstablishmentOrder(idEstablishment).subscribe(response =>{
      this.ordersData = response.map(item =>{
        return {
        id: item.payload.doc.id,
        ...item.payload.doc.data() as OrderModel
        } as OrderModel;
      })
      console.log(this.ordersData)
      this.valuesWin = this.someAllAmount(this.ordersData);
      this.valuesImpost = this.someAllAmountImpost(this.ordersData);
    });

    
    setTimeout(() => {
      this.setLoading();
    }, 2000);
  }

  someAllAmount(orders:OrderModel[]){
    let valueTotal = 0;
    let values:Array<number> = [];
    this.countSale = orders.length;
    orders.forEach(element => {
      if(element.statusPayment === 'PAGO' && element.statusOrder === 'FINALIZADO'){
        values.push(element.grossValue);
      }
        
    });
    valueTotal =  values.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      valueTotal
    );
    this.loading = false;
    return valueTotal;
  }

  someAllAmountImpost(orders:OrderModel[]){
    let valueTotal = 0;
    let values:Array<number> = [];
    orders.forEach(element => {
      if(element.statusPayment === 'PAGO' && element.statusOrder === 'FINALIZADO'){
        values.push(element.rateService);
      }
        
    });
    valueTotal =  values.reduce(
      (accumulator, currentValue) => accumulator + currentValue,
      valueTotal
    );
    this.loading = false;
    return valueTotal;
  }

  countOrderBySolicitado() {
    this.orderService.countOrderByStatusOrder('SOLICITADO', this.idEstablishment).subscribe(
      result => {
        this.countSolicitado = result;
      }
    );
  }

  countOrderByPreparandoPedido() {
    this.orderService.countOrderByStatusOrder('PREPARANDO PEDIDO', this.idEstablishment).subscribe(
      result => {
        this.countPreparandoPedido = result;
      }
    );
  }

  countOrderByEntregando() {
    this.orderService.countOrderByStatusOrder('ENTREGANDO', this.idEstablishment).subscribe(
      result => {
        this.countEntregando = result;
      }
    );
  }

  countOrderByEntregue() {
    this.orderService.countOrderByStatusOrder('ENTREGUE', this.idEstablishment).subscribe(
      result => {
        this.countEntregue = result;
      }
    );
  }

  countOrderByStatus(status: string) {
    console.log('status: ' + status);
    console.log('id: ' + this.idEstablishment);
    this.orderService.countOrderByStatusOrder(status, this.idEstablishment).subscribe(
      result => {
        if(status === 'SOLICITADO') {
          this.countSolicitado = result;
        }
        if(status === 'PREPARANDO PEDIDO') {
          this.countPreparandoPedido = result;
        }
        if(status === 'ENTREGANDO') {
          this.countEntregando = result;
        }
        if(status === 'ENTREGUE') {
          this.countEntregue = result;
        }
      }
    )
  }

  navigateToOrders(status: string) {
    this.orderService.getllOrderByStatusOrder(status, this.idEstablishment).subscribe(
      result => {
        // Ordenar os resultados por dateCreated
        const sortedOrders = result.sort((a: OrderModel, b: OrderModel) => {
          const dateA = this.ensureDate(a.dateCreated);
          const dateB = this.ensureDate(b.dateCreated);
          return dateB.getTime() - dateA.getTime();
        });

        // Verificar se a modal já está aberta
        if (this.dialogRef) {
          // Atualizar a modal com os pedidos ordenados
          this.dialogRef.componentInstance.data = { title: status, orders: sortedOrders };
          return;
        }

        // Abrir a modal com os pedidos ordenados
        this.dialogRef = this.dialog.open(OrderDetailsModalComponent, {
          width: '100%',
          data: { title: status, orders: sortedOrders }
        });

        // Limpar a referência da modal quando ela for fechada
        this.dialogRef.afterClosed().subscribe(() => {
          this.dialogRef = null;
        });
      },
      error => {
        console.error('Erro ao buscar pedidos:', error);
      }
    );
  }


  ensureDate(value: any): Date {
    if (value instanceof Date && !isNaN(value.getTime())) {
      return value;
    } else if (typeof value === 'number' && !isNaN(value)) {
      return new Date(value);
    } else if (value && value.toDate && typeof value.toDate === 'function') {
      return value.toDate();
    } else if (value === undefined || value === null) {
      console.error('Date value is undefined or null:', value);
      return new Date(0); // Valor padrão para evitar falhas
    } else {
      console.error('Invalid date value:', value);
      return new Date(0); // Valor padrão para evitar falhas
    }
  }
  

  setLoading(){
    this.loading = false;
  }
}
