import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { CityApiService } from 'src/app/Core/Https/city-api.service';
import { PostApiService } from 'src/app/Core/Https/post-api.service';
import { RatingResDTO, ratigListReqDTO, roomDTO } from 'src/app/Core/Models/newPostDTO';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';
import { SessionService } from 'src/app/Core/Services/session.service';
import {BoardType} from "../../../Core/Models/tourDTO";

@Component({
  selector: 'prs-pricing-popup',
  templateUrl: './pricing-popup.component.html',
  styleUrls: ['./pricing-popup.component.scss']
})
export class PricingPopupComponent implements OnInit {

  key = ''
  isLoading = false;
  standardTwinId = 148;
  standardTwinCoefficient = 0;
  showCalendar = true;
  agencies: any[] = []
  agency_selected = 33;

  isCoefficient = '0';
  req!: ratigListReqDTO;
  activedRoom = 0;
  roomTypeId = 0;
  calendarLang = 'shamsi'
  ratingData!: RatingResDTO;
  rooms: roomDTO[] = [];
  public boardtype=BoardType
  boardtype_selected = 'B.B';

  constructor(public checkError: CheckErrorService,
    public errorService: ErrorsService,
    public dialogRef: MatDialogRef<PricingPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { hotelId: string, slug: string },
    public dialog: MatDialog,
    public cityApiService: CityApiService,
    public session: SessionService,
    public route: ActivatedRoute,
    public api: PostApiService,
    public message: MessageService) { }

  ngOnInit(): void {
    this.getInfo()
  }

  getInfo(): void {
    this.isLoading = true;
    this.req = {
      fromDate: '',
      toDate: '',
      agency_id: +this.agency_selected,
      hotelId: +this.data.hotelId,
      roomId: 0,
      boardType: this.boardtype_selected,


    }
    this.api.ratingList(this.req).subscribe((res: any) => {
      this.isLoading = false;
      if (res.isDone) {
        this.ratingData = res.data;
        this.agencies = res.data.agencies

        this.rooms = this.ratingData.hotel.rooms ?? [];

        let obj: roomDTO | undefined = this.rooms.find(x => x.room_type === 'دوتخته' || x.room_type === 'دو تخته')
        this.activedRoom = obj ? obj.id : 0
        this.roomTypeId = obj ? obj.room_type_id : 0
        if (obj && obj.has_coefficient) {
          this.isCoefficient = '1'
        } else {
          this.isCoefficient = '0'
        }

      } else {
        this.message.custom(res.message)
      }
    }, (error: any) => {
      this.isLoading = false
      this.checkError.check(error)
      this.message.error()
    })
  }
  getAgencyName() {
    let itemFiltered = this.agencies.filter(x => x.id === +this.agency_selected);
    return itemFiltered.length > 0 ? itemFiltered[0].agency_name : '---'
  }
  getTwinCoefficient() {
    let result = 0
    this.ratingData.hotel.rooms?.forEach(item => {
      if (item.room_type_id === this.standardTwinId) {
        result = item.coefficient
      }
    })
    return result
  }
  agencyChanged() {
    this.getInfo()
    this.reload()
  }


  getStars(count: string): number[] {
    return Array.from(Array(+count).keys());
  }

  changeTab(id: number, roomTypeId: number): void {
    this.activedRoom = id
    this.roomTypeId = roomTypeId


    this.reload()
  }

  getRoom(): roomDTO | null {
    let room = this.rooms.filter(x => x.room_type_id === this.roomTypeId)
    return room.length > 0 ? room[0] : null
  }


  reload() {
    this.showCalendar = false;
    setTimeout(() => this.showCalendar = true);
  }


  // protected readonly boardtype = BoardType;
}
