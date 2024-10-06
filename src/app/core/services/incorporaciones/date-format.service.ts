import { Injectable } from "@angular/core";
import * as moment from "moment";

@Injectable({
  providedIn: "root",
})
export class DateFormatService {

  constructor() { }

  formatToMySQLDate(date: Date | string | null): string {
    if (!date) {
      return ''; 
    }

    const formattedDate = moment(date);
    
    if (!formattedDate.isValid()) {
      throw new Error('Fecha no válida');
    }
  
    return formattedDate.format('YYYY-MM-DD');
  }

  convertStringToDate(dateString: string | null): Date | null {
    if (!dateString) {
      return null; 
    }
    return new Date(dateString);
  }

}
