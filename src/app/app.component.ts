import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, deleteField, setDoc } from '@angular/fire/firestore'; // get data [collection , collectionData ]
import { Observable } from 'rxjs'; // data binding for used like API's

import { FormGroup, FormControl, FormBuilder } from '@angular/forms';


export interface itemData {
  name: string;
  age: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent implements OnInit {
  title = 'fireCodx';
  formButtonLabel: string = 'Add Data'; // Default label for adding data


  nameHard: any
  ageHard: any
  dataForm: FormGroup

  items$: Observable<any[]>;
  // set-ip FireBase 
  firestore: Firestore = inject(Firestore)
  itemId: any;

  constructor(private formBuilder: FormBuilder) {
    // Get data From fireBase 
    const aCollection = collection(this.firestore, 'item')
    // this.items$ = collectionData(aCollection);
    this.items$ = collectionData(aCollection, { idField: 'id' });

    this.items$.subscribe((data) => {
      data.forEach((item) => {
        const itemId = item.id;
        const itemData = item;
  
        console.log('Document ID:', itemId);
        console.log('Document Data:', itemData);
      });
    });

    // end code

    // formBuilder data create hard-coded 
    this.dataForm = this.formBuilder.group({
      name: new FormControl(''),
      age: new FormControl(''),
    });

  }



  // Create DATA 
  // standerd rules with ids 
  // async addData() {
  //   // form data pass firebase / create collection data use with - interface
  //   const { name, age } = this.dataForm.value;
  //   const docRef = await addDoc(collection(this.firestore, "item"), {
  //     // add data rule of interface
  //     name: name,
  //     age: age

  //   });
  //   this.dataForm.reset();
  //   console.log("Document written with ID: ", docRef.id);
  // }
  async addData() {
    if (this.dataForm.valid) {
      const { name, age } = this.dataForm.value;
      const docRef = await addDoc(collection(this.firestore, 'item'), {
        name: name,
        age: age
      });
      console.log('Document written with ID:', docRef.id);
      this.dataForm.reset();
    } else {
      console.log('Invalid form data. Please fill in all fields.');
    }
  }

  // vs 

   onEditItemClick(item: any) {
    this.dataForm.patchValue({
      name: item.name,
      age: item.age
    });
    this.formButtonLabel = 'Update';
    this.itemId = item.id; // Store the item ID for updating
  }
  

  // last 
  async onFormSubmit() {
    const { name, age } = this.dataForm.value;
  
    if (this.formButtonLabel === 'Add Data') {
      // Add data
      if (this.dataForm.valid) {
        const docRef = await addDoc(collection(this.firestore, 'item'), {
          name: name,
          age: age
        });
        console.log('Document written with ID:', docRef.id);
        this.dataForm.reset();
      } else {
        console.log('Invalid form data. Please fill in all fields.');
      }
    } else if (this.formButtonLabel === 'Update') {
      // Update data
      if (this.dataForm.valid) {
        const itemRef = doc(this.firestore, 'item', this.itemId);
        const updatedData = {
          name: name,
          age: age
        };
        await setDoc(itemRef, updatedData);
        console.log('Data updated successfully!');
        this.dataForm.reset();
        this.formButtonLabel = 'Add Data'; // Reset the button label
      } else {
        console.log('Invalid form data. Please fill in all fields.');
      }
    }
  }
  
  
  //error state
  catch(e: any) {
    console.error("Error adding document: ", e);
  }


//deleted
  onDeleteItemClick(itemId: string) {
    const itemRef = doc(this.firestore, 'item', itemId);
    deleteDoc(itemRef)
      .then(() => {
        console.log('Document deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting document:', error);
      });
  }





  ngOnInit() {

  }

}
