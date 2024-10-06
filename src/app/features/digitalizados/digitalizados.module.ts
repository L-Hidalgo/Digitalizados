import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DigitalizadosRoutingModule } from './digitalizados-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { SafeUrlPipe } from './safe-url.pipe';
import { FileListComponent } from './file-list/file-list.component';
import { CrearCarpetaComponent } from './crear-carpeta/crear-carpeta.component';
import { SubirCarpetaComponent } from './subir-carpeta/subir-carpeta.component';
import { SubirArchivoComponent } from './subir-archivo/subir-archivo.component';
import { ChildFilesComponent } from './child-files/child-files.component';
import { PdfViewerComponent } from './pdf-viewer/pdf-viewer.component';
import { FileEditComponent } from './file-edit/file-edit.component';
import { MemRapComponent } from './mem-rap/mem-rap.component';

@NgModule({
  declarations: [ SafeUrlPipe, FileListComponent, CrearCarpetaComponent, SubirCarpetaComponent, SubirArchivoComponent, ChildFilesComponent, PdfViewerComponent, FileEditComponent, MemRapComponent],
  imports: [
    CommonModule,
    SharedModule,
    DigitalizadosRoutingModule
  ],
  //entryComponents: [PdfViewerComponent]
})
export class DigitalizadosModule { }
