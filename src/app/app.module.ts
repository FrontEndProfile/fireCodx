import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { ProdComponent } from './prod/prod.component';
import { ProductDetailsComponentComponent } from './product-details-component/product-details-component.component';
import { FIREBASE_OPTIONS } from "@angular/fire/compat";
import { MediaComponent } from './media/media.component';

@NgModule({
  declarations: [
    AppComponent,
    ProdComponent,
    ProductDetailsComponentComponent,
    MediaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    ReactiveFormsModule
  ],
  providers: [{ provide: FIREBASE_OPTIONS, useValue: environment.firebase }],

  bootstrap: [AppComponent]
})
export class AppModule { }
