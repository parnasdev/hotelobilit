import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ReserveApiService } from 'src/app/Core/Https/reserve-api.service';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { PermitionsService } from 'src/app/Core/Services/permitions.service';
import { SessionService } from 'src/app/Core/Services/session.service';
import { Title } from "@angular/platform-browser";
import * as moment from 'moment';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

@Component({
  selector: 'prs-reserve-info',
  templateUrl: './reserve-info.component.html',
  styleUrls: ['./reserve-info.component.scss']
})
export class ReserveInfoComponent {
  info: any;
  statusNM = 0
  statuses: any[] = []
  isLoading = false
  reserve: string = ""
  constructor(
    public title: Title,
    public api: ReserveApiService,
    public route: ActivatedRoute,
    public checkErrorService: CheckErrorService,
    public calendarService: CalenderServices,
    public dialog: MatDialog,
    public permition: PermitionsService,
    public session: SessionService,
    public errorService: ErrorsService,
    public message: MessageService) { }


  ngOnInit(): void {
    this.reserve = this.route.snapshot.paramMap.get('reserve') ?? '';
    this.title.setTitle('جزییات رزرو | هتل و بلیط')

    this.getReserve(true)
    console.log(this.session.getRole())
  }


  getReserve(state: boolean): void {
    this.isLoading = true;
    this.api.getReserve(+this.reserve).subscribe((res: any) => {
      if (res.isDone) {
        this.info = res.data
        if(state){
          this.statuses = res.statuses;
        }
        this.statusNM = this.info.information.status.id
      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      this.message.error();
      this.checkErrorService.check(error);
    });
  }


  getPrices(item: any) {
    let list: any[] = []
    for (var key in item.prices) {
      if (item.prices.hasOwnProperty(key)) {
        list.push({ name: key, value: item.prices[key] })
      }
    }
    return list
  }
  export() {
    const data = document.getElementById('pdf');
    if (!data) {
      this.message.custom('Element not found');
      return;
    }

    const options = {
      scale: 2, // Increase quality
      useCORS: true,
      logging: true,
      scrollY: -window.scrollY,
      scrollX: -window.scrollX
    };

    html2canvas(data, options).then(canvas => {
      try {
        // A4 size page of PDF  
        const contentWidth = canvas.width;
        const contentHeight = canvas.height;
        
        // A4 paper size [595.28, 841.89] in points
        const pageHeight = contentWidth / 592.28 * 841.89;
        let leftHeight = contentHeight;
        let position = 0;
        const imgWidth = 595.28;
        const imgHeight = 592.28 / contentWidth * contentHeight;

        const pdf = new jsPDF('p', 'pt', 'a4');
        
        // First page rendering
        if (leftHeight < pageHeight) {
          pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, imgWidth, imgHeight);
        } else {
          while (leftHeight > 0) {
            pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, position, imgWidth, imgHeight);
            leftHeight -= pageHeight;
            position -= 841.89;
            if (leftHeight > 0) {
              pdf.addPage();
            }
          }
        }

        pdf.save(`reserve-${this.info?.information?.ref_code || 'export'}.pdf`);
      } catch (err) {
        console.error('PDF generation error:', err);
        this.message.custom('خطا در ایجاد PDF');
      }
    }).catch(err => {
      console.error('Canvas generation error:', err);
      this.message.custom('خطا در ایجاد تصویر');
    });
  }
  changeStatus(status: number = 0) {
    this.isLoading = true;
    this.api.editReserve(+this.reserve, this.statusNM).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message);
        this.getReserve(false)
      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;
    }, (error: any) => {
      this.isLoading = false;
      this.message.error();
      this.checkErrorService.check(error);
    });
  }


  getNight(item: any) {
    let checkin = '';
    let checkout = ''
    let transfer = item.flights;
    if (!transfer.departure.checkin_tomorrow && !transfer.return.checkout_yesterday) {
      checkin = transfer.departure.date;
      checkout = transfer.return.date;
    } else if (transfer.departure.checkin_tomorrow && !transfer.return.checkout_yesterday) {
      checkin = moment(transfer.date).add(1, 'days').format('YYYY-MM-DD');
      checkout = transfer.flight.date;
    } else if (!transfer.departure.checkin_tomorrow && transfer.return.checkout_yesterday) {
      checkin = transfer.date;
      checkout = moment(transfer.departure.date).add(-1, 'days').format('YYYY-MM-DD');
    } else {
      checkin = moment(transfer.departure.date).add(1, 'days').format('YYYY-MM-DD');
      checkout = moment(transfer.return.date).add(-1, 'days').format('YYYY-MM-DD');
    }
    return this.calendarService.enumerateDaysBetweenDates(checkin, checkout, 'YYYY-MM-DD').length - 1
  }

  getPassengerCount() {
    let count: number = 0
    this.info.selected_rooms.forEach((x: any) => {
      count += x.passengers.length
    })
    return count
  }


  getServicePrices(room: any) {
    let servicePrice: number = 0;
    room.services.forEach((x: any) => {
      servicePrice += x.rate
    })
    return servicePrice
  }

  getServices(services:any){
    let foundServices=services.filter((service: any) => service.airport_id===0 || service.airport_id===this.info.flights.departure.destination_id)
    return foundServices
  }

}
