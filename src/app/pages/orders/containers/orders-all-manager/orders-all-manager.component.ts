import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { OrderModel } from 'src/app/models/orderModel';
import { OrdersService } from '../../services/orders.service';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({
  selector: 'app-orders-all-manager',
  templateUrl: './orders-all-manager.component.html',
  styleUrls: ['./orders-all-manager.component.css']
})
export class OrdersAllManagerComponent implements OnInit {
  ordersData:OrderModel[];
  displayedColumns: string[] = ['id', 'establishment', 'statusOrder', 'address', 'dateCreated', 'editar', 'ações'];
  dataSource: MatTableDataSource<OrderModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  loading:boolean = true;
  buttonAccept:boolean;
  buttonCancel:boolean;
  public date:any;
  public idEstablishment = localStorage.getItem('idEstablishment');
  isSmallScreen = false;


  constructor(private breakpointObserver: BreakpointObserver, private ordersService:OrdersService, private router:Router, private route:ActivatedRoute) { }

  ngOnInit(): void {
    this.sizeScreen();
    if(this.idEstablishment){
    this.loadData(this.idEstablishment);
     }
     else{
      alert('Não conseguimos carregar os dados dos PEDIDOS, entre em contato com o suporte')
     }
  }

  sizeScreen(){
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet]).subscribe(result => {
      this.isSmallScreen = result.matches;
    });
  }


  loadData(idEstablishment: string){
    this.loading = true;
    this.ordersService.getIdEstablishmentOrder(idEstablishment).subscribe(response =>{
      this.ordersData = response.map(item =>{
        return {
        id: item.payload.doc.id,
        ...item.payload.doc.data() as OrderModel
        } as OrderModel;
      })
    });

    setTimeout(()=>{                           
      this.loadTable(this.ordersData); 
  }, 1000);
  }

  loadTable(orders:OrderModel[]){
    this.dataSource = new MatTableDataSource(orders);
    setTimeout(()=>{                           
      this.loadPaginator(this.dataSource);
  }, 1000);
    this.loading = false;
  }

  loadPaginator(datasource){
    datasource.paginator = this.paginator;
    datasource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  newOrder(){
    this.router.navigate(['new'], {relativeTo:this.route});
  }

  edit(id:number){
    this.router.navigate(['detail/'+ id], {relativeTo:this.route});
  }

  toCancel(order:OrderModel){
    this.date = Date.now();
    if(order.statusOrder !==  'CANCELADO'){
      order.statusOrder = 'CANCELADO';
      order.dateUpdated = this.date;
      order.statusDateCancel = this.date;
      this.ordersService.updateOrder(order);
      this.loadData(this.idEstablishment);
    } else {
      alert('Este pedido precisa ser diferente de CANCELADO, STATUS ATUAL: ' + order.statusOrder)
    }
  }

  toAccept(order:OrderModel){
    this.date = Date.now();
    if(order.statusOrder == 'CANCELADO' || order.statusOrder == 'SOLICITADO'){
      order.statusOrder = 'PREPARANDO PEDIDO';
      order.dateUpdated = this.date;
      order.statusDateAccept = this.date;
      this.ordersService.updateOrder(order);
      this.loadData(this.idEstablishment);
    } else {
      alert('Este pedido precisa está CANCELADO ou SOLICITADO, STATUS ATUAL: ' + order.statusOrder)
    }
  }

  toDelivery(order:OrderModel){
    this.date = Date.now();
    if(order.statusOrder == 'PREPARANDO PEDIDO'){
      order.statusOrder = 'ENTREGANDO';
      order.dateUpdated = this.date;
      order.statusDateDelivering = this.date;
      this.ordersService.updateOrder(order);
      this.loadData(this.idEstablishment);
    }else {
      alert('Este pedido precisa está PREPARANDO PEDIDO, STATUS ATUAL: ' + order.statusOrder)
    }
  }

  toDelivered(order:OrderModel){
    this.date = Date.now();
    if(order.statusOrder == 'ENTREGANDO'){
      order.statusOrder = 'ENTREGUE';
      order.dateUpdated = this.date;
      order.statusDateDelivered = this.date;
      this.ordersService.updateOrder(order);
      this.loadData(this.idEstablishment);
    }else {
      alert('Este pedido precisa está ENTREGANDO, STATUS ATUAL: ' + order.statusOrder)
    }
  }

  finalizeOrder(order:OrderModel){
    this.date = Date.now();
    if(order.statusOrder == 'ENTREGANDO' || order.statusOrder == 'ENTREGUE'){
      order.statusOrder = 'FINALIZADO';
      order.dateUpdated = this.date;
      order.statusDateFinalized = this.date;
      order.statusPayment = 'PAGO'
      this.ordersService.updateOrder(order);
      this.loadData(this.idEstablishment);
    } else {
      alert('Este pedido precisa está ENTREGANDO ou ENTREGUE, STATUS ATUAL: ' + order.statusOrder)

    }
  }

  isValidDate(date: any): boolean {
    if (date instanceof Date) {
      return !isNaN(date.getTime());
    }
    
    if (typeof date === 'number') {
      return !isNaN(new Date(date).getTime());
    }
  
    return false;
  }
  

}
