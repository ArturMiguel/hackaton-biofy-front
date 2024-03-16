import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CameraComponent } from './pages/camera/camera.component';

const routes: Routes = [
  {
    path: 'camera',
    component: CameraComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
