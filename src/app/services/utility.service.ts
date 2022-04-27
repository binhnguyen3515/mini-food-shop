import { Injectable } from '@angular/core';
import moment from 'moment';
@Injectable({
  providedIn: 'root'
})
export class UtilityService {

constructor() { }
  dayFormat(currentFormat:string,setFormat:string,date:string){
    return moment(date,currentFormat).format(setFormat);
  }

  get groupedInfo(){
    return "Nhóm SPRING 2022 - Bình, Linh, Tiến, Giàu, Quyên";
  }

  calculateExpiredDate(date:Date){
    const currentDate = new Date();
    let convertExpiredDateToString = moment.utc(date).format("MM-DD-YYYY");
    let getMonthOfExpiredDate = new Date(convertExpiredDateToString).getMonth()+1;
    let getYearOfExpiredDate = new Date(convertExpiredDateToString).getFullYear();

    let yearGap = currentDate.getFullYear() - getYearOfExpiredDate;
    let timeLeft = Math.abs(yearGap*12) + getMonthOfExpiredDate - (currentDate.getMonth()+1);
    if(yearGap > 0 || timeLeft < 0){
      return "Hết hạn";
    }

    return "HSD còn "+timeLeft+" tháng";
  }

  calculateExpiredDateCompact(date:Date){
    const currentDate = new Date();
    let convertExpiredDateToString = moment.utc(date).format("MM-DD-YYYY");
    let getMonthOfExpiredDate = new Date(convertExpiredDateToString).getMonth()+1;
    let getYearOfExpiredDate = new Date(convertExpiredDateToString).getFullYear();

    let yearGap = currentDate.getFullYear() - getYearOfExpiredDate;
    let timeLeft = Math.abs(yearGap*12) + getMonthOfExpiredDate - (currentDate.getMonth()+1);
    if(yearGap > 0 || timeLeft < 0){
      return "0 month(s)";
    }

    return timeLeft+" month(s)";
  }
}
