import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProdComponent } from './prod/prod.component';
import { ProductDetailsComponentComponent } from './product-details-component/product-details-component.component';
import { MediaComponent } from './media/media.component';
import { CreateDataComponent } from './create-data/create-data.component';

const routes: Routes = [
  { path: '', component: CreateDataComponent },
  { path: 'media', component: MediaComponent },
  { path: 'prod', component: ProdComponent },
  { path: 'products/:id', component: ProductDetailsComponentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
