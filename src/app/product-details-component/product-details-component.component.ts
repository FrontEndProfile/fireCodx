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

  // productId: any;
  // product$: Observable<any> | undefined;
  // items$: Observable<any[]>;
  // // set-ip FireBase 
  // firestore: Firestore = inject(Firestore)
  // itemId: any;
  
  // constructor(private formBuilder: FormBuilder,private router: Router) {
  //   // Get data From fireBase 
  //   const aCollection = collection(this.firestore, 'product')
  //   // this.items$ = collectionData(aCollection);
  //   this.items$ = collectionData(aCollection, { idField: 'id' });
  //   this.items$.subscribe((data) => {
  //     data.forEach((item) => {
  //       const itemId = item.id;
  //       const itemData = item;
  
  //       console.log('Document ID:', itemId);
  //       // console.log('Document Data:', itemData);
  //     });
  //   });

  // }

  // ngOnInit() {
  //   // this.productId = this.route.snapshot.paramMap.get('id');
  //   // this.getProductDetails();
  // }

  // getProductDetails() {
  //   this.product$ = this.firestore.collection('products').doc(this.productId).valueChanges();
  // }



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
        } else {
          console.log('Product not found');
        }
      }
    });
  }
  
}
