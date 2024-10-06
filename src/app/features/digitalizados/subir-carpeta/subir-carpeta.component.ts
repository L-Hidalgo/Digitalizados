import { Component, OnInit, Inject } from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import Swal from "sweetalert2";
import { FileService } from "src/app/core/services/incorporaciones/file.service";

@Component({
  selector: "app-subir-carpeta",
  templateUrl: "./subir-carpeta.component.html",
  styleUrls: ["./subir-carpeta.component.css"],
})
export class SubirCarpetaComponent implements OnInit {
  form: FormGroup;
  nombreFile: string = "";
  files: File[] = [];
  parentId!: number;

  constructor(
    public dialogRef: MatDialogRef<SubirCarpetaComponent>,
    private fileService: FileService,
    @Inject(MAT_DIALOG_DATA) public data: { parentId: number, tipoDocumentoFile: number }
  ) {
    this.form = new FormGroup({
      nombreFile: new FormControl(""),
      tipoDocumentoFile: new FormControl(data.tipoDocumentoFile),
    });
  }

  ngOnInit() {
    this.parentId = this.data.parentId;
  }

  onCancel() {
    this.dialogRef.close();
  }

  onCarpetaSelected(event: any) {
    const selectedFiles = event.target.files;
    console.log('selectedFiles:', selectedFiles);
    if (selectedFiles.length > 0) {
      const folderPath = selectedFiles[0].webkitRelativePath;
      console.log('folderPath:', folderPath);
      this.nombreFile = folderPath.split("/")[0];
      this.files = Array.from(selectedFiles);
      this.form.patchValue({ nombreFile: this.nombreFile });
    } else {
      this.files = [];
      this.nombreFile = "";
      this.form.patchValue({ nombreFile: "" });
    }
  }

  subirCarpeta() {
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
    const parentId = this.parentId;
    formData.append("nombreFile", this.form.value.nombreFile);

    if (parentId != null) {
      formData.append("parentId", parentId.toString());
    }

    if (this.files.length > 0) {
      const arrayPaths: Array<{ fileName: string; filePath: string}> = [];
      this.files.forEach((file) => {
        formData.append("files[]", file);
        arrayPaths.push({
          fileName: file.name,
          filePath: file.webkitRelativePath,
        });
      });
      formData.append("paths", JSON.stringify(arrayPaths));
    } else {
      Swal.fire({
        title: "Error",
        text: "No se ha seleccionado ningún archivo.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    formData.append(
      "tipoDocumentoFile",
      this.form.value.tipoDocumentoFile.toString()
    );
    formData.append("tipoFile", "1");

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
