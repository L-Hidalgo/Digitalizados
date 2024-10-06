import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { FileService } from "src/app/core/services/incorporaciones/file.service";

@Component({
  selector: "app-subir-archivo",
  templateUrl: "./subir-archivo.component.html",
  styleUrls: ["./subir-archivo.component.css"],
})
export class SubirArchivoComponent  implements OnInit {
  form: FormGroup;
  nombreFile: string = ''; 
  file: File | null = null;
  parentId!: number;

  constructor(
    public dialogRef: MatDialogRef<SubirArchivoComponent>,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: { parentId: number,  tipoDocumentoFile: number }
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

  onFileSelected(event: any) {
    const selectedFiles = event.target.files;
    if (selectedFiles.length > 0) {
      this.file = selectedFiles[0];
      this.nombreFile = this.file?.name || '';
      this.form.patchValue({ nombreFile: this.nombreFile });
    } else {
      this.file = null;
      this.nombreFile = '';
      this.form.patchValue({ nombreFile: '' });
    }
  }
 
  subirArchivo() {
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

    const parentId = this.parentId; 

    if (this.file) {
      formData.append("file", this.file); 
    } else {
      Swal.fire({
        title: "Error",
        text: "No se ha seleccionado ningún archivo.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    formData.append("tipoDocumentoFile", this.form.value.tipoDocumentoFile.toString());
    formData.append("tipoFile", "2");
    if (parentId != null) { 
      formData.append("parentId", parentId.toString());
    }
    this.fileService.crearFile(formData).subscribe(
      (response) => {
        Swal.fire({
          title: "Éxito",
          text: "Archivo creado correctamente.",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          this.dialogRef.close(); 
        });
      },
      (error) => {
        Swal.fire({
          title: "Error",
          text: "Hubo un error al crear el archivo.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    );
  }
}
