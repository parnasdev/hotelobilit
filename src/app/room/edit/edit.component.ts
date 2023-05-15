import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryApiService } from 'src/app/Core/Https/category-api.service';
import { AirportReqDTO } from 'src/app/Core/Models/newAirlineDTO';
import { RoomReqDTO } from 'src/app/Core/Models/newRoomDTO';
import { CheckErrorService } from 'src/app/Core/Services/check-error.service';
import { ErrorsService } from 'src/app/Core/Services/errors.service';
import { MessageService } from 'src/app/Core/Services/message.service';

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent {
  room_id = 0
  nameFC = new FormControl();
  capacityFC = new FormControl();
  statusFC = new FormControl();
  destCityFC = new FormControl();

  req: RoomReqDTO = {
    Adl_capacity: 0,
    age_child: 0,
    chd_capacity:0,
    name: '',
    parent_id: null,
  }
  
  info: any

  show = false;

  constructor(public message: MessageService,
    public router: Router,
    public route: ActivatedRoute,
    public checkError: CheckErrorService,
    public errorService: ErrorsService,
    public dialog: MatDialog,
    public api: CategoryApiService) {
  }

  ngOnInit(): void {
    // @ts-ignore
    this.room_id = +this.route.snapshot.paramMap.get('id')
    this.getInfo()
  }

  submit(): void {
    this.setReq()
    this.api.updateCategory(this.room_id, 'RoomType', 'hotel', this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.message.custom(res.message)
        this.router.navigateByUrl('/panel/rooms');
      } else {
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.message.error()
      this.checkError.check(error)

    })
  }

  getEndCity(cityItemSelected: any): void {
    this.destCityFC.setValue(cityItemSelected.id);
  }

  getInfo(): void {
    this.api.editCategoryPage(this.room_id, 'RoomType', 'hotel').subscribe((res: any) => {
      if (res.isDone) {
        this.info = res.data
        this.setValue()
        this.show = true;
      } else {
        this.show = true;
        this.message.custom(res.message);
      }
    }, (error: any) => {
      this.show = true;
      this.message.error()
      this.checkError.check(error)

    })
  }

  setValue(): void {
    // this.logo = this.info.files.length > 0 ? this.info.files[0] : 0;
    this.nameFC.setValue(this.info.roomType.name)
    this.capacityFC.setValue(this.info.roomType.description.Adl_capacity)
  }


  setReq(): void {
    this.req = {
      Adl_capacity: this.capacityFC.value,
      age_child: 0,
      chd_capacity:0,
      name: this.nameFC.value,
      parent_id: null,
    }
  }
}
