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
  showUpdateForm = false;
  updatedProduct: any = {};

  editId: any





  productId: any;




  products: Observable<any[]> | undefined;

  constructor(private route: ActivatedRoute, private firestore: Firestore) {

  }


  openUpdateForm() {
    this.updatedProduct = {
      heroHead: this.product.heroHead,
      heroContent: this.product.heroContent,
      // heroImg: [this.product.heroImg]
    };
    this.showUpdateForm = true;
  }


  // saveUpdate() {
  //   this.onUpdateClicked(this.updatedProduct);
  //   this.showUpdateForm = false;
  // }
  saveUpdate() {
    const updatedProduct = { ...this.product }; // Create a new copy of the product object
    Object.assign(updatedProduct, this.updatedProduct); // Merge the updated values from updatedProduct into the copy
    this.onUpdateClicked(updatedProduct); // Pass the updated product object to the update function
    this.product = updatedProduct; // Update the current product with the updated values
    this.showUpdateForm = false;
  }
  onUpdateClicked(updatedData: any) {
    const productDoc = doc(this.firestore, 'product', this.productId);
    // const productDoc = doc(this.firestore, 'product', 'jeA78qVrVHwaYXfLsWca');
    console.log('Update clicked');
    console.log('Product Update ID:', this.productId);

    updateDoc(productDoc, updatedData)
      .then(() => {
        console.log('Product updated successfully');
      })
      .catch((error) => {
        console.error('Error updating product:', error);
      });
  }



  ngOnInit(): void {
    this.route.paramMap.subscribe(async (params) => {
      // const productId = params.get('id');
      this.productId = params.get('id');
      if (this.productId) {
        const productDoc = doc(this.firestore, 'product', this.productId);
        const productSnapshot = await getDoc(productDoc);
        if (productSnapshot.exists()) {
          this.product = productSnapshot.data();
          console.log('Product:', this.product);
          console.log('Product ID:', this.productId);
          console.log(this.productId);
        } else {
          console.log('Product not found');
        }
      }
    });

  }
}
