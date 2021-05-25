// 2 trang main - 404
import { MainPageComponent } from './view/main-page/main-page.component';
import { NotFoundPageComponent } from './view/not-found-page/not-found-page.component';
// Của Angular
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: "", component: MainPageComponent },
  { path: "bessenger", component: MainPageComponent },
  { path: "**", component: NotFoundPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
