import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { FileService } from "src/app/core/services/incorporaciones/file.service";

@Component({
  selector: "app-crear-carpeta",
  templateUrl: "./crear-carpeta.component.html",
  styleUrls: ["./crear-carpeta.component.css"],
})
export class CrearCarpetaComponent implements OnInit {
  form: FormGroup;
  parentId!: number;

  constructor(
    public dialogRef: MatDialogRef<CrearCarpetaComponent>,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: { parentId: number, tipoDocumentoFile: number }
  ) {
    this.form = new FormGroup({
      nombreFile: new FormControl(""),
      tipoDocumentoFile: new FormControl(data.tipoDocumentoFile),
      parentId: new FormControl(data.parentId), 
    });
  }

  ngOnInit() {
    this.parentId = this.data.parentId; 
  }
  
  onCancel(): void {
    this.dialogRef.close();
  }

  crearCarpeta() {
    if (this.form.invalid) {
      Swal.fire({
        title: "Error",
        text: "Por favor, completa todos los campos.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }
  
    const formData = new FormData();
    formData.append("nombreFile", this.form.value.nombreFile);
  
    const tipoDocumentoFile = this.form.value.tipoDocumentoFile;
    const parentId = this.parentId; 
  
    if (tipoDocumentoFile !== null) {
      formData.append("tipoDocumentoFile", tipoDocumentoFile.toString());
    } else {
      formData.append("tipoDocumentoFile", "");
    }
  
    if (parentId != null) { 
      formData.append("parentId", parentId.toString());
    }
  
    formData.append("tipoFile", "1");
  
    this.fileService.crearFile(formData).subscribe(
      (response) => {
        Swal.fire({
          title: "Éxito",
          text: "Carpeta creada correctamente.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          this.dialogRef.close();
        });
      },
      (error) => {
        Swal.fire({
          title: "Error",
          text: "Hubo un error al crear la carpeta.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  } 
}
