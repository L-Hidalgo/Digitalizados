import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.css']
})
export class PdfViewerComponent implements OnInit {

  pdfSrc: string;
  nombreDocumento!: string;

  constructor(
    public dialogRef: MatDialogRef<PdfViewerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.pdfSrc = data.pdfSrc;
    this.nombreDocumento = data.nombreDocumento;
  }

  ngOnInit(): void {
  }
  
  close(): void {
    this.dialogRef.close();
  }
}
