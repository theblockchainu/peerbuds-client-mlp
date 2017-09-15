import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './default.component';
import { IndexComponent } from './index/index.component';


const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        // canActivateChild: [AuthGuard],
         children: [
          { path: '', component: IndexComponent },
          { path: '/index-philosophy',
    component: IndexComponent
  }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultRoutingModule { }
