import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, deleteField, setDoc } from '@angular/fire/firestore'; // get data [collection , collectionData ]
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AngularFireStorage, AngularFireStorageModule, AngularFireStorageReference } from '@angular/fire/compat/storage';

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

  selectedFile: File | null = null;
  uploadPercent: number | undefined;


  ngUrl: any


  constructor(private formBuilder: FormBuilder, private router: Router, private storage: AngularFireStorage) {
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
      image: this.ngUrl,
    });

  }

  // Create DATA 
  // standerd rules with ids 
  async addData(imageUrl: any): Promise<void> {
    // form data pass firebase / create collection data use with - interface
    const { tittle, description } = this.dataForm.value;
    const docRef = await addDoc(collection(this.firestore, "product"), {
      // add data rule of interface
      tittle: tittle,
      description: description,
      image: imageUrl, // Assign the downloaded URL to the image property

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

  //upload media 
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(event: Event): void {
    event.preventDefault();

    if (this.selectedFile) {
      const filePath = `cms/${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);

      task.percentageChanges().subscribe((percentage) => {
        this.uploadPercent = Math.round(percentage || 0);
      });

      task.snapshotChanges().subscribe(
        (snapshot) => {
          if (snapshot!.state === 'success') {
            fileRef.getDownloadURL().subscribe((url) => {
              console.log('File available at:', url);
              // Perform further actions with the download URL
              console.log(url);
              this.addData(url); // Call the addData() function passing the URL as an argument
            });
          }
        },
        (error) => {
          console.log('Upload error:', error);
        }
      );
    } else {
      console.log('No file selected');
      this.addData(null);
    }
  }

  ngOnInit() {
    const productCollection = collection(this.firestore, 'product');
    this.products = collectionData(productCollection);
  }


  // onCardClick(productId: string) {
  //   this.router.navigate(['/product', productId]);
  // }


}
