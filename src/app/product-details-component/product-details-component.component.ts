import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, deleteField, setDoc, getDoc } from '@angular/fire/firestore'; // get data [collection , collectionData ]
import { Observable } from 'rxjs'; // data binding for used like API's

import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-product-details-component',
  templateUrl: './product-details-component.component.html',
  styleUrls: ['./product-details-component.component.scss']
})
export class ProductDetailsComponentComponent implements OnInit {

  product: any;

  constructor(private route: ActivatedRoute, private firestore: Firestore) {}

  ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const productId = params.get('id');
      if (productId) {
        const productDoc = doc(this.firestore, 'product', productId);
        const productSnapshot = await getDoc(productDoc);
        if (productSnapshot.exists()) {
          this.product = productSnapshot.data();
          console.log('Product:', this.product);
        } else {
          console.log('Product not found');
        }
      }
    });
  }
  
}
