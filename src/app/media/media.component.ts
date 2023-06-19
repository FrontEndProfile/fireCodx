import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, deleteField, setDoc } from '@angular/fire/firestore'; // get data [collection , collectionData ]
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AngularFireStorage, AngularFireStorageModule, AngularFireStorageReference } from '@angular/fire/compat/storage';

import { Router } from '@angular/router';
import { finalize, forkJoin, Observable } from 'rxjs'; // data binding for used like API's

@Component({
  selector: 'app-media',
  templateUrl: './media.component.html',
  styleUrls: ['./media.component.scss']
})
export class MediaComponent implements OnInit {

  firestore: Firestore = inject(Firestore)


  products: Observable<any[]> | undefined;
  items$: Observable<any[]>;
  dataForm: FormGroup

  selectedFile: File | null = null;
  uploadPercent: number | undefined;


  ngUrl: any
  imagLast: any


  selectedFiles: Record<string, File[]> = {};



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
  
    this.dataForm = this.formBuilder.group({
      tittle: new FormControl(''),
      description: new FormControl(''),
      imageOne: this.ngUrl,
      imageTwo: this.ngUrl,
    });
  }




  async addData(imageUrls: any[]): Promise<void> {
    const { tittle, description } = this.dataForm.value;
    const docRef = await addDoc(collection(this.firestore, "product"), {
      tittle: tittle,
      description: description,
      images: imageUrls,
    });
    this.dataForm.reset();
    console.log("Document written with ID:", docRef.id);
    this.dataForm.reset();
  }

  onFileSelected(event: any, field: string): void {
    const files: FileList = event.target.files;
    this.selectedFiles[field] = Array.from(files);
  }
  
  onSubmit(event: Event): void {
    event.preventDefault();
  
    const uploadTasks: Observable<any>[] = [];
    const imageUrls: any[] = [];
  
    for (const field in this.selectedFiles) {
      if (this.selectedFiles.hasOwnProperty(field)) {
        const files = this.selectedFiles[field];
  
        for (const file of files) {
          const filePath = `cms/${file.name}`;
          const fileRef = this.storage.ref(filePath);
          const task = this.storage.upload(filePath, file);
  
          uploadTasks.push(task.snapshotChanges().pipe(
            finalize(() => {
              fileRef.getDownloadURL().subscribe((url) => {
                console.log('File available at:', url);
                imageUrls.push(url);
                if (uploadTasks.length === imageUrls.length) {
                  this.addData(imageUrls);
                }
              });
            })
          ));
        }
      }
    }
  
    if (uploadTasks.length === 0) {
      this.addData([]);
    } else {
      forkJoin(uploadTasks).subscribe(() => {
        console.log('All files uploaded successfully');
      }, (error) => {
        console.log('Upload error:', error);
      });
    }
  }



  ngOnInit(): void {
    
  }
}
