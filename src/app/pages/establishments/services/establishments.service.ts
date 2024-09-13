import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, docData, DocumentData, Firestore, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { NeighborhoodModel } from 'src/app/models/neighborhoodsModel';

import { EstablishmentModel } from 'src/app/models/establishment';
import { MenuModel } from 'src/app/models/menuModel';
import { CategoryProductModel } from 'src/app/models/categoryProduct';
import { collectionGroup } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class EstablishmentsService {
  private establishmentCollection: CollectionReference<DocumentData>;
  private menuEstablishment: CollectionReference<DocumentData>;
  private neighborhoodDelivery: CollectionReference<DocumentData>;
  private categoryProduct: CollectionReference<DocumentData>;
  
  constructor(private firestore: Firestore, private db:AngularFirestore) {
   this.establishmentCollection = collection(this.firestore, 'headquarters/1/establishments'); //retornar estabelecimentos da matriz
  }

  //Listar todos estabelecimentos
  getAllEstablishments() {
    return collectionData(this.establishmentCollection, {
      idField: 'id',
    }) as Observable<EstablishmentModel[]>;
  }

  getId(id: string) {
    const establishmentDocumentReference = doc(this.firestore, `headquarters/1/establishments/${id}`);
    return docData(establishmentDocumentReference, { idField: 'id' });
  }

  getLoginEstablishment(login:string) {
   return this.db.collectionGroup('establishments', ref => ref.where('login', '==', login)).valueChanges();
  }

  delete(id: string) {
    const establishmentDocumentReference = doc(this.firestore, `headquarters/1/establishments/${id}`);
    return deleteDoc(establishmentDocumentReference);
  }

  getMenu(id: string) {
    this.menuEstablishment = collection(this.firestore, `headquarters/1/establishments/${id}/menu`);
    return collectionData(this.menuEstablishment, {
      idField: 'id',
    }) as Observable<MenuModel[]>;
  }

  getNeighborhoodDelivery(id: string) {
    this.neighborhoodDelivery = collection(this.firestore, `headquarters/1/establishments/${id}/neighborhoods`);
    return collectionData(this.neighborhoodDelivery, {
      idField: 'id',
    }) as Observable<NeighborhoodModel[]>;
  }

  //Criar novo estabelecimento
    create(establishment: EstablishmentModel) {
    return addDoc(this.establishmentCollection, establishment);
  }



  update(establishment: EstablishmentModel) {
    const establishmentDocumentReference = doc(
      this.firestore,
      `headquarters/1/establishments/${establishment.id}`
    );
    return updateDoc(establishmentDocumentReference, { ...establishment });
  }

   //Criar novo produto para o menu do estabelecimento
   createProduct(product: MenuModel, id:string) {
    this.menuEstablishment = collection(this.firestore, `headquarters/1/establishments/${id}/menu`);
    return addDoc(this.menuEstablishment, product);
  }

  updateProduct(product: MenuModel, establishmentId:string) {
    const establishmentDocumentReference = doc(
      this.firestore,
      `headquarters/1/establishments/${establishmentId}/menu/${product.id}`
    );
    return updateDoc(establishmentDocumentReference, { ...product });
  }

  getIdMenu(id: string, idEstablishment:string) {
    const establishmentDocumentReference = doc(this.firestore, `headquarters/1/establishments/${idEstablishment}/menu/${id}`);
    return docData(establishmentDocumentReference, { idField: 'id' });
  }
 
  
     //Criar novo bairro para o entrega do estabelecimento
     createNeighborhoodDelivery(neighborhoodDelivery: NeighborhoodModel, id:string) {
      this.neighborhoodDelivery = collection(this.firestore, `headquarters/1/establishments/${id}/neighborhoods`);
      return addDoc(this.neighborhoodDelivery, neighborhoodDelivery);
    }
  
    updateNeighborhoodDelivery(neighborhoodDelivery: NeighborhoodModel, establishmentId:string) {
      const establishmentDocumentReference = doc(
        this.firestore,
        `headquarters/1/establishments/${establishmentId}/neighborhoods/${neighborhoodDelivery.id}`
      );
      return updateDoc(establishmentDocumentReference, { ...neighborhoodDelivery });
    }

    //Criar nova categoria de produtos
    createCategoryProduct(categoryProduct: CategoryProductModel, id:string) {
      this.categoryProduct = collection(this.firestore, `headquarters/1/establishments/${id}/categoryproduct`);
      return addDoc(this.categoryProduct, categoryProduct);
    }
  
    updateCategoryProduct(categoryProduct: CategoryProductModel, establishmentId:string) {
      const establishmentDocumentReference = doc(
        this.firestore,
        `headquarters/1/establishments/${establishmentId}/categoryproduct/${categoryProduct.id}`
      );
      return updateDoc(establishmentDocumentReference, { ...categoryProduct });
    }

    getIdCategoryProduct(id: string, idEstablishment:string) {
      const establishmentDocumentReference = doc(this.firestore, `headquarters/1/establishments/${idEstablishment}/categoryproduct/${id}`);
      return docData(establishmentDocumentReference, { idField: 'id' });
    }

    getAllCategoryProduct(idEstablishment:string) {
      this.categoryProduct = collection(this.firestore, `headquarters/1/establishments/${idEstablishment}/categoryproduct`);
      return collectionData(this.categoryProduct, {
        idField: 'id',
      }) as Observable<CategoryProductModel[]>;
    }
  

}
