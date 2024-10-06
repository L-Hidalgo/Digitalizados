import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { FileService } from "src/app/core/services/incorporaciones/file.service";
import Swal from "sweetalert2";
import { MatDialog } from "@angular/material/dialog";
import { PdfViewerComponent } from "../pdf-viewer/pdf-viewer.component";
//import { saveAs } from "file-saver";
import { FileEditComponent } from "../file-edit/file-edit.component";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { Subscription, timer } from "rxjs";
import { CrearCarpetaComponent } from "../crear-carpeta/crear-carpeta.component";
import { SubirCarpetaComponent } from "../subir-carpeta/subir-carpeta.component";
import { SubirArchivoComponent } from "../subir-archivo/subir-archivo.component";

@Component({
  selector: "app-child-files",
  templateUrl: "./child-files.component.html",
  styleUrls: ["./child-files.component.css"],
})
export class ChildFilesComponent implements OnInit {
  noDataFound: boolean = false;
  datos: any[] = [];
  parentId!: number;
  personaFile: string = "";
  role!: string;
  isAdmin: boolean = false;
  userName: string = "";
  private autoLogoutSubscription: Subscription = new Subscription();
  private routeSubscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    public dialog: MatDialog,
    private authGuard: AuthGuard,
    public authService: AuthenticationService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(params => {
      this.parentId = +params['parentId']; 
      this.getListDataHijos(); 
    });

    const user = this.authService.getCurrentUser();
    this.isAdmin = user.isAdmin;
    this.userName = user.fullName;
    if (user) {
      this.role = user.role;
    }
    const timer$ = timer(2000, 5000);
    this.autoLogoutSubscription = timer$.subscribe(() => {
      this.authGuard.canActivate();
    });
  }

  aplicarFiltrosDigitalizados(value: string): void {
    this.personaFile = value;
    this.getListDataHijos();
  }

  clearFiltrosDigitalizados(input: HTMLInputElement): void {
    input.value = "";
    this.personaFile = "";
    this.aplicarFiltrosDigitalizados(this.personaFile);
  }

  getListDataHijos() {
    this.fileService.getFileChildren(this.parentId, this.personaFile).subscribe(
      (resp: any) => {
        console.log("Respuesta:", resp);
        if (resp.length > 0) {
          this.datos = resp;
          this.noDataFound = false;
        } else {
          this.datos = [];
          this.noDataFound = true;
        }
      },
      (error) => {
        console.error("Error al obtener la lista de documentos:", error);
        this.noDataFound = true;
      }
    );
  }

  openPdfPreview(fileId: number, nombreFile: string): void {
    this.fileService.getDocumento(fileId).subscribe(({ blob }) => {
      const url = URL.createObjectURL(blob);
      this.dialog.open(PdfViewerComponent, {
        data: { pdfSrc: url, nombreDocumento: nombreFile },
        width: "90%",
      });
    });
  }

  openModificarFile(fileId: number): void {
    this.fileService.getNombreFile(fileId).subscribe((file) => {
      const dialogRef = this.dialog.open(FileEditComponent, {
        width: "300px",
        data: { file },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log("El modal ha sido cerrado");
        this.getListDataHijos();
      });
    });
  }

  /*downloadDocumento(fileId: number, nombreFile: string): void {
    this.fileService.downloadDocumento(fileId).subscribe(
      (blob: Blob) => {
        if (blob.size > 0) {
          saveAs(blob, nombreFile);
        } else {
          Swal.fire({
            icon: "error",
            title: "Archivo no encontrado",
            text: "El archivo que intentas descargar no está disponible.",
          });
        }
      },
      (error) => {
        console.error("Error al descargar el documento", error);
        Swal.fire({
          icon: "error",
          title: "Error al descargar el documento",
          text: "Hubo un problema al intentar descargar el archivo. Inténtalo de nuevo más tarde.",
        });
      }
    );
  }*/

  darBajaFile(idFile: number) {
    this.fileService.darBajaFile(idFile).subscribe(
      (response) => {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Documento dado de baja correctamente.",
          confirmButtonText: "Aceptar",
        }).then(() => {
          this.getListDataHijos();
        });
      },
      (error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al dar de baja el documento.",
          confirmButtonText: "Aceptar",
        });
      }
    );
  }

  openModalCrearCarpeta() {
    this.parentId = Number(this.route.snapshot.paramMap.get("parentId"));

    const dialogRef = this.dialog.open(CrearCarpetaComponent, {
      width: "350px",
      data: { parentId: this.parentId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("El modal se cerró");
      this.getListDataHijos();
    });
  }

  openModalUploadCarpeta(): void {
    this.parentId = Number(this.route.snapshot.paramMap.get("parentId"));

    const dialogRef = this.dialog.open(SubirCarpetaComponent, {
      width: "350px",
      data: { parentId: this.parentId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("El modal se cerró");
      this.getListDataHijos();
    });
  }

  openModalUploadDocumento() {
    this.parentId = Number(this.route.snapshot.paramMap.get("parentId"));

    const dialogRef = this.dialog.open(SubirArchivoComponent, {
      width: "350px",
      data: { parentId: this.parentId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("El modal se cerró");
      this.getListDataHijos();
    });
  }

  navigateToChildren(parentId: number): void {
    this.router.navigate(["digitalizacion/files", parentId]);
  }
}
