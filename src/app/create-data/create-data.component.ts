import { Component, inject, OnInit } from '@angular/core';
import { Firestore, collection, collectionData, addDoc, deleteDoc, doc, updateDoc, deleteField, setDoc } from '@angular/fire/firestore'; // get data [collection , collectionData ]
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { AngularFireStorage, AngularFireStorageModule, AngularFireStorageReference } from '@angular/fire/compat/storage';

import { Router } from '@angular/router';
import { finalize, forkJoin, Observable } from 'rxjs'; // data binding for used like API's
@Component({
  selector: 'app-create-data',
  templateUrl: './create-data.component.html',
  styleUrls: ['./create-data.component.scss']
})
export class CreateDataComponent implements OnInit {

  firestore: Firestore = inject(Firestore)


  products: Observable<any[]> | undefined;
  items$: Observable<any[]>;
  dataForm: FormGroup

  selectedFile: File | null = null;
  uploadPercent: number | undefined;


  ngUrl: any;


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
        console.log('Document Data:', itemData);
      });
    });

    this.dataForm = this.formBuilder.group({
      heroHead: new FormControl(''),
      heroContent: new FormControl(''),
      heroImg: this.ngUrl,
      bannerVedio: this.ngUrl,
      frameIntro: this.ngUrl,
      frameTittle: new FormControl(''),
      frameContent: new FormControl(''),
      frameOne: this.ngUrl,
      frameTwo: this.ngUrl,
      frameThree: this.ngUrl,
      viewLastBanner: this.ngUrl,
      viewLastIntroTittle: new FormControl(''),
      viewLastIntroContent: new FormControl(''),

    });
  }

  //deleted list of items
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


  async addData(imageUrls: any[]): Promise<void> {
    const { heroHead, heroContent,frameTittle ,frameContent,viewLastIntroTittle,viewLastIntroContent } = this.dataForm.value;
    const docRef = await addDoc(collection(this.firestore, "product"), {
      heroHead: heroHead,
      heroContent: heroContent,
      heroImg: imageUrls,
      bannerVedio: imageUrls,
      frameIntro: imageUrls,
      frameTittle: frameTittle,
      frameContent: frameContent,
      frameOne: imageUrls,
      frameTwo: imageUrls,
      frameThree: imageUrls,
      viewLastBanner: imageUrls,
      viewLastIntroTittle: viewLastIntroTittle,
      viewLastIntroContent: viewLastIntroContent,

    });
    this.dataForm.reset();
    console.log("Document written with ID:", docRef.id);
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
    // this.dataForm.reset();
      }, (error) => {
        console.log('Upload error:', error);
      });
    }
  }



  ngOnInit(): void {

  }


}
