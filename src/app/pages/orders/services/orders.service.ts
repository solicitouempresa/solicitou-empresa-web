import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, docData, DocumentData, Firestore, query, updateDoc, where } from '@angular/fire/firestore';
import { map, Observable } from 'rxjs';
import { NeighborhoodModel } from 'src/app/models/neighborhoodsModel';

import { EstablishmentModel } from 'src/app/models/establishment';
import { MenuModel } from 'src/app/models/menuModel';
import { CategoryProductModel } from 'src/app/models/categoryProduct';
import { OrderModel } from 'src/app/models/orderModel';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private ordersCollection: CollectionReference<DocumentData>;

  
  constructor(private firestore: Firestore, private db:AngularFirestore) {
   this.ordersCollection = collection(this.firestore, 'headquarters/1/orders'); //retornar ordens da matriz
  }

  //ORDERS (PEDIDOS)
  createOrder(order: OrderModel) {
    this.ordersCollection = collection(this.firestore, `headquarters/1/orders`);
    return addDoc(this.ordersCollection, order);
  }

  getllOrder() {
    this.ordersCollection = collection(this.firestore, `headquarters/1/orders`);
    return collectionData(this.ordersCollection, {
      idField: 'id',
    }) as Observable<OrderModel[]>;
  }

  getllOrderByStatusOrder(statusOrder: string, establishmentId: string): Observable<OrderModel[]> {
    const ordersRef = collection(this.firestore, `headquarters/1/orders`);
    const q = query(
      ordersRef,
      where('statusOrder', '==', statusOrder),
      where('establishment.id', '==', establishmentId)
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map((orders: OrderModel[]) => orders)
    );
  }

  countOrderByStatusOrder(statusOrder: string, establishmentId: string): Observable<number> {
    const ordersRef = collection(this.firestore, `headquarters/1/orders`);
    const q = query(
      ordersRef,
      where('statusOrder', '==', statusOrder),
      where('establishment.id', '==', establishmentId)
    );
    return collectionData(q, { idField: 'id' }).pipe(
      map((orders: OrderModel[]) => orders.length)
    );
  }

  getIdOrder(idOrder:string) {
    const establishmentDocumentReference = doc(this.firestore, `headquarters/1/orders/${idOrder}`);
    return docData(establishmentDocumentReference, { idField: 'id'});
  }

  
  getIdEstablishmentOrder(idEstablishment:string) {
    return this.db.collectionGroup('orders', ref => ref.where('idEstablishment', '==', idEstablishment)).snapshotChanges();
   }

  updateOrder(order: OrderModel) {
    const establishmentDocumentReference = doc(
      this.firestore,
      `headquarters/1/orders/${order.id}`
    );
    return updateDoc(establishmentDocumentReference, { ...order });
  } 

}
