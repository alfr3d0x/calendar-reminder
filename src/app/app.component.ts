import { Component } from '@angular/core';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { ReminderComponent } from './reminder/reminder.component';
import { ApiService } from './api.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'calendar-reminder';

  public months: Array<any> = [];

  public lastMonthDisplayed: any;

  public wdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(
    public dialog: MatDialog,
    private api: ApiService
  ) {}

  ngOnInit() {
    this.drawMonth();
  }

  public drawMonth() {
    let monthsDrawn = this.months.length;
    let startDate = moment().startOf('month').add(monthsDrawn, 'months');
    let numberOfDays = moment(startDate).daysInMonth();
    let monthDays: Array<any> = [];
    let monthToDraw = {
      name: this.getMonth(startDate),
      days: []
    };
    for (let n = 0; n < numberOfDays; n++) {
      let newDate = moment(startDate).add(n, 'd');
      monthDays.push({
        dayDate: newDate,
        reminders: []
      });
    }
    monthToDraw.days = this.addRemainingDays(startDate, monthDays);
    this.lastMonthDisplayed = monthToDraw;
    this.months.push(monthToDraw);
  }

  private addRemainingDays(startDate: any, days: Array<any>) {
    let firstWeekDay = days[0].dayDate.weekday();
    for (let n = 1; n <= firstWeekDay; n++) {
      let previousDate = moment(startDate).subtract(n, 'd');
      days.unshift({
        dayDate: previousDate,
        reminders: []
      });
    }
    let lastDay = days[days.length -1].dayDate;
    let lastWeekday = lastDay.weekday();
    let extraDays = 1;
    while(lastWeekday < 6) {
      let nextDate = moment(lastDay).add(extraDays, 'd');
      days.push({
        dayDate: nextDate,
        reminders: []
      });
      extraDays += 1;
      lastWeekday += 1;
    }
    return days;
  }

  private getMonth(date: any) {
    return `${date.format('MMMM')} ${date.format('YYYY')}`;
  }

  isInMonth(date: any, month: any) {
    let dateMonth = this.getMonth(date);
    return dateMonth === month.name;
  }

  public isWeekend(day: any) {
    return day === 0 || day === 6;
  }

  public getReminderText(reminder: any) {
    let textToDisplay = ""
    for(let key in reminder) {
      if(key != 'background' && !!reminder[key]) {
        textToDisplay += `\n ${key.charAt(0).toUpperCase() + key.substr(1).toLowerCase()}: ${reminder[key]}`
      }
    }
    return textToDisplay;
  }

  public createReminder(day: any) {
    if(this.isValidDateForReminder(day)) {
      let dialogRef = this.dialog.open(ReminderComponent, {
        width: '250px',
        data: {
          reminder: {},
          isEdit: false
        }
      });
  
      dialogRef.afterClosed().subscribe(reminder => {
        console.log('The dialog was closed');
        if(reminder){
          if(reminder.description && reminder.description.length <= 30) {
            if(reminder.city) {
              this.getForecast(reminder);
            }
            day.reminders.push(reminder);
          } else {
            alert('The reminder must have a description and the description must have 35 characters at the most');
          }  
        }
      });
    }
  }

  public editReminder(day: any, reminder: any) {
    let dialogRef = this.dialog.open(ReminderComponent, {
      width: '250px',
      data: {
        reminder: reminder,
        isEdit: true
      }
    });

    dialogRef.afterClosed().subscribe(rem => {
      console.log('The dialog was closed');
      if(rem){
        if(rem.delete){
          let index = day.reminders.indexOf(reminder);
          if(index != -1) {
            day.reminders.splice(index, 1);
          }
        } else {
          if(rem.description && rem.description.length < 30) {
            reminder = rem
            if(reminder.city) {
              this.getForecast(reminder);
            }
          } else {
            alert('The reminder must have a description and the description must have 35 characters at the most');
          }
        }
      }
    });
  }

  private isValidDateForReminder(day) {
    let yesterday = moment().subtract(1, 'd');
    return moment(yesterday).isBefore(day.dayDate, 'day');
  }

  private getForecast(reminder: any) {
    this.api.getForecast(reminder.city).subscribe(
      (data: any) => {
       reminder.forecast = `\n *Description: ${data.weather[0].description} \n *Temperature: ${data.main.temp}`
      },
      (error: any) => {
        console.log(error);
      }
    )
  }
}
