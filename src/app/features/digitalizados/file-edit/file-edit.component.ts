import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FileService } from "src/app/core/services/incorporaciones/file.service";
import Swal from "sweetalert2";

@Component({
  selector: "app-file-edit",
  templateUrl: "./file-edit.component.html",
  styleUrls: ["./file-edit.component.css"],
})
export class FileEditComponent implements OnInit {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<FileEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private fileService: FileService
  ) {
    this.form = this.fb.group({
      nombreFile: [""],
      idFile: [""]
    });
  }

  ngOnInit(): void {
    this.form.patchValue({
      nombreFile: this.data.file.nombreFile,
      idFile: this.data.file.idFile
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onUpdateNombreFile(): void {
    if (this.form.valid) {
      const updatedFileName = this.form.value.nombreFile;
      const fileId = this.data.file.idFile;

      this.fileService.updateNombreFile(fileId, updatedFileName).subscribe(
        (response) => {
          console.log("Nombre de archivo actualizado:", response);
          Swal.fire({
            icon: "success",
            title: "¡Éxito!",
            text: "El nombre del archivo se ha modificado correctamente.",
            confirmButtonText: "Aceptar",
          });

          this.dialogRef.close(updatedFileName);
        },
        (error) => {
          console.error("Error al actualizar el nombre del archivo:", error);
          Swal.fire({
            icon: "error",
            title: "¡Error!",
            text: "Hubo un problema al modificar el nombre del archivo.",
            confirmButtonText: "Aceptar",
          });
        }
      );
    }
  }
}
