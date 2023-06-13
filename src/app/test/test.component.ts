import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, deleteField, setDoc } from '@angular/fire/firestore'; // get data [collection , collectionData ]
import { Observable } from 'rxjs'; // data binding for used like API's

import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnInit  {

  dataForm: FormGroup;
  itemId: any = null;
  firestore: Firestore = inject(Firestore)
  isEditing: boolean = false;
  items$: Observable<any[]>;


  constructor(private formBuilder: FormBuilder) {
    // Get data from Firebase
    const aCollection = collection(this.firestore, 'item');
    this.items$ = collectionData(aCollection, { idField: 'id' });

    // Form builder data creation
    this.dataForm = this.formBuilder.group({
      name: new FormControl(''),
      age: new FormControl('')
    });
  }

  async addData() {
    if (this.dataForm.valid) {
      const { name, age } = this.dataForm.value;

      if (!this.isEditing) {
        const docRef = await addDoc(collection(this.firestore, 'item'), {
          name: name,
          age: age
        });
        console.log('Document written with ID:', docRef.id);
        this.dataForm.reset();
      } else {
        if (this.itemId) {
          const itemRef = doc(this.firestore, 'item', this.itemId);

          const updatedData = {
            name: name,
            age: age
          };

          await setDoc(itemRef, updatedData);
          console.log('Data updated successfully!');
          this.dataForm.reset();
          this.itemId = null;
          this.isEditing = false;
        }
      }
    }
  }

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

  onEditItemClick(item: any) {
    this.itemId = item.id;
    this.isEditing = true;

    this.dataForm.patchValue({
      name: item.name,
      age: item.age
    });
  }

  cancelEdit() {
    this.itemId = null;
    this.isEditing = false;
    this.dataForm.reset();
  }

  ngOnInit(): void {
    
  }
}
