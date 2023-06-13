import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, deleteField, setDoc } from '@angular/fire/firestore'; // get data [collection , collectionData ]
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs'; // data binding for used like API's

@Component({
  selector: 'app-prod',
  templateUrl: './prod.component.html',
  styleUrls: ['./prod.component.scss']
})
export class ProdComponent implements OnInit {

  // items$: Observable<any[]>;
  firestore: Firestore = inject(Firestore)

  // constructor() {
  //   const aCollection = collection(this.firestore, 'item');
  //   this.items$ = collectionData(aCollection, { idField: 'id' });
  // }


  products: Observable<any[]> | undefined;
  items$: Observable<any[]>;
  dataForm: FormGroup



  constructor(private formBuilder: FormBuilder,private router: Router) {
    // Get data From fireBase 
    const aCollection = collection(this.firestore, 'product')
    // this.items$ = collectionData(aCollection);
    this.items$ = collectionData(aCollection, { idField: 'id' });
    this.items$.subscribe((data) => {
      data.forEach((item) => {
        const itemId = item.id;
        const itemData = item;
  
        console.log('Document ID:', itemId);
        // console.log('Document Data:', itemData);
      });
    });

    // formBuilder data create hard-coded 
    this.dataForm = this.formBuilder.group({
      tittle: new FormControl(''),
      description: new FormControl(''),
    });

  }

    // Create DATA 
  // standerd rules with ids 
  async addData() {
    // form data pass firebase / create collection data use with - interface
    const { tittle, description } = this.dataForm.value;
    const docRef = await addDoc(collection(this.firestore, "product"), {
      // add data rule of interface
      tittle: tittle,
      description: description,

    });
    this.dataForm.reset();
    console.log("Document written with ID: ", docRef.id);
  }
  //deleted
  onDeleteItemClick(product: string) {
    const itemRef = doc(this.firestore, 'product', product);
    deleteDoc(itemRef)
      .then(() => {
        console.log('Document deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting document:', error);
      });
  }
  ngOnInit() {
    const productCollection = collection(this.firestore, 'product');
    this.products = collectionData(productCollection);
  }


  // onCardClick(productId: string) {
  //   this.router.navigate(['/product', productId]);
  // }


}
