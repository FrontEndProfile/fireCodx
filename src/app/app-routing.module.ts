import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
 import { TestComponent } from './test/test.component';
import { ProdComponent } from './prod/prod.component';
import { ProductDetailsComponentComponent } from './product-details-component/product-details-component.component';

const routes: Routes = [
  { path: 'test', component: TestComponent },
  { path: 'prod', component: ProdComponent },
  { path: 'products/:id', component: ProductDetailsComponentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
