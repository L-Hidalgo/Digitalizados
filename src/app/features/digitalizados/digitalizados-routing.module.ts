import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from 'src/app/shared/layout/layout.component';
import { FileListComponent } from './file-list/file-list.component';
import { ChildFilesComponent } from './child-files/child-files.component';
import { MemRapComponent } from './mem-rap/mem-rap.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      { path: 'file', component: FileListComponent },
      { path: 'mem-rap', component: MemRapComponent },
      { path: 'files/:parentId', component: ChildFilesComponent },
    ]
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DigitalizadosRoutingModule { }
