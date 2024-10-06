import { Component, OnInit, ViewChild } from "@angular/core";
import { AuthenticationService } from "src/app/core/services/auth.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { AuthGuard } from "src/app/core/guards/auth.guard";
import { Subscription } from "rxjs";
import { timer } from "rxjs";
import { Title } from "@angular/platform-browser";
import { NotificationService } from "src/app/core/services/notification.service";
import { CrearCarpetaComponent } from "../crear-carpeta/crear-carpeta.component";
import { SubirCarpetaComponent } from "../subir-carpeta/subir-carpeta.component";
import { File } from "src/app/shared/models/incorporaciones/file";
import { SubirArchivoComponent } from "../subir-archivo/subir-archivo.component";
import { FileService } from "src/app/core/services/incorporaciones/file.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { FileEditComponent } from "../file-edit/file-edit.component";

@Component({
  selector: "app-file-list",
  templateUrl: "./file-list.component.html",
  styleUrls: ["./file-list.component.css"],
})
export class FileListComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = [
    "nombre",
    "propietario",
    "ultimaModificacion",
    "acciones",
  ];

  role!: string;
  isAdmin: boolean = false;
  userName: string = "";
  parentId!: number;

  dataSource: MatTableDataSource<File> = new MatTableDataSource<File>();
  length = 0;
  pageIndex = 0;
  pageSize = 8;
  pageSizeOptions = [8, 16, 24];
  rangeLabel = "";
  selectedOption!: string;
  currentUser: any;
  filterValue: string = "";
  personaFile: string = "";

  private autoLogoutSubscription: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private titleService: Title,
    private notificationService: NotificationService,
    public authService: AuthenticationService,
    private authGuard: AuthGuard,
    private fileService: FileService,
    private router: Router
  ) {
    this.dataSource = new MatTableDataSource();
    this.getListDataFile();
  }

  ngOnInit(): void {
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

    this.titleService.setTitle("RRHH-DDE - Digitalizados File");
    this.notificationService.openSnackBar(
      "Módulo Digitalizados File Cargando..."
    );
  }

  ngAfterViewInit() {
    this.getListDataFile();
  }

  openModalCrearCarpeta() {
    const dialogRef = this.dialog.open(CrearCarpetaComponent, {
      width: "350px",
      data: { parentId: this.parentId, tipoDocumentoFile: 1 }, 
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("El modal se cerró");
      this.getListDataFile();
    });
  }

  openModalUploadCarpeta(): void {
    const dialogRef = this.dialog.open(SubirCarpetaComponent, {
      width: "350px",
      data: { parentId: this.parentId, tipoDocumentoFile: 1 }, 
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("El modal se cerró");
      this.getListDataFile();
    });
  }

  openModalUploadDocumento() {
    const dialogRef = this.dialog.open(SubirArchivoComponent, {
      width: "350px",
      data: { parentId: this.parentId, tipoDocumentoFile: 1 }, 
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("El modal se cerró");
      this.getListDataFile();
    });
  }

  aplicarFiltrosDigitalizados(value: string): void {
    this.pageIndex = 0;
    this.personaFile = value;
    this.getListDataFile();
  }

  clearFiltrosDigitalizados(input: HTMLInputElement): void {
    input.value = "";
    this.personaFile = "";
    this.aplicarFiltrosDigitalizados(this.personaFile);
  }

  getListDataFile() {
    const query = this.personaFile ? { personaFile: this.personaFile } : {};
    const paginationOptions = {
      page: this.pageIndex + 1,
      limit: this.pageSize,
    };
    this.fileService.listarFile(query, paginationOptions).subscribe(
      (resp) => {
        if (resp.objetosList) {
          this.dataSource.data = resp.objetosList;
          this.length = resp.total || 0;
          this.updateRangeLabel();
          if (this.paginator) {
            this.paginator.pageIndex = this.pageIndex;
            this.paginator.pageSize = this.pageSize;
            this.paginator.length = this.length;
          }
        } else {
          this.dataSource.data = [];
          this.length = 0;
        }
      },
      (error) => {
        console.error("Error al obtener la lista de interinatos:", error);
      }
    );
  }

  updateRangeLabel() {
    const startIndex = this.pageIndex * this.pageSize + 1;
    const endIndex = Math.min(
      (this.pageIndex + 1) * this.pageSize,
      this.length
    );
    this.rangeLabel = `${startIndex} - ${endIndex} de ${this.length}`;
  }

  onPreviousPage() {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.getListDataFile();
    }
  }

  onNextPage() {
    if ((this.pageIndex + 1) * this.pageSize < this.length) {
      this.pageIndex++;
      this.getListDataFile();
    }
  }

  onPageSizeChange(event: any) {
    this.pageSize = event.target.value;
    this.pageIndex = 0;
    this.getListDataFile();
  }

  navigateToChildren(parentId: number): void {
    this.router.navigate(["digitalizacion/files", parentId]);
  }

  downloadCarpeta(fileId: number, nombreFile: string): void {
    this.fileService.downloadCarpeta(fileId).subscribe(
      (arrayBuffer: ArrayBuffer) => {
        const blob = new Blob([arrayBuffer]);
        if (blob.size > 0) {
          const downloadUrl = window.URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = downloadUrl;
          a.download = `${nombreFile}.zip`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          window.URL.revokeObjectURL(downloadUrl);
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
        let title = "Error al descargar el documento";
        let text =
          "Hubo un problema al intentar descargar el archivo. Inténtalo de nuevo más tarde.";

        if (error.status === 404) {
          text =
            error.error?.error || "No se encontró la carpeta o la carpeta está vacía.";
        } else if (error.status === 500) {
          text = "Error interno del servidor, no se pudo crear el archivo zip. Por favor, contacta al soporte.";
        } else {
          text = error.message || "Ocurrió un error inesperado.";
        }

        Swal.fire({
          icon: "error",
          title: title,
          text: text,
        });
      }
    );
  }

  openModalModificarFile(fileId: number): void {
    this.fileService.getNombreFile(fileId).subscribe((file) => {
      const dialogRef = this.dialog.open(FileEditComponent, {
        width: "300px",
        data: { file },
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.log("El modal ha sido cerrado");
        this.getListDataFile();
      });
    });
  }

  darBajaFile(fileId: number) {
    this.fileService.darBajaFile(fileId).subscribe(
      (response) => {
        Swal.fire({
          icon: "success",
          title: "Éxito",
          text: "Se dio de baja la carpeta.",
          confirmButtonText: "Aceptar",
        }).then(() => {
          this.getListDataFile();
        });
      },
      (error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al dar de baja la carpeta.",
          confirmButtonText: "Aceptar",
        });
      }
    );
  }
}
