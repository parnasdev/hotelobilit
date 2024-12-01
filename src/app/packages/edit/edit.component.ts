import { Component, OnInit } from '@angular/core';
import { AddComponent } from '../add/add.component';
import * as moment from 'moment';
import { PackageTourDTO } from 'src/app/Core/Models/tourDTO';
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
declare var $: any;

@Component({
  selector: 'prs-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss']
})
export class EditComponent extends AddComponent implements OnInit {
  tourData: any;
  id = ''
  del_packages: number[] = []
  rateChange:any=null;
  rate_number:any=null;
  rate_apply_to:any=[]
  // packagesErr:any={}
  hotel_setting:boolean=false
  select_all:boolean=false

  rate_arr=[{id:'chd_n_price',name:'کودک بدون تخت'},{id:'chd_w_price',name:'کودک با تخت'},{id:'extra_bed_price',name:'تخت اضافه'},
    {id:'inf_price',name:'نوزاد'},
    // {id:'plus_price',name:'فیمت اضافه'},
    {id:'price',name:'فیمت اتاق (هرنفر)'}]

  apply_rate_stats=false

  override ngOnInit() {
    this.title.setTitle('ویرایش تور | هتل و بلیط')

    this.id = this.route.snapshot.paramMap.get('id') ?? ''
    this.getInfo()
  }
  onRateTypeChange(event: any) {
    this.rate_apply_to = event.value;
  }
  getInfo(): void {
    this.isLoading = true;
    this.tourApi.getTourInfo(+this.id).subscribe((res: any) => {
      if (res.isDone) {
        this.tourData = res.data.tour;
        this.statuses = res.data.statuses;
        this.partners = res.data.partners;
        this.offered=res.data.tour.offered
        this.partnerNames = this.getPartnersNames(res.data.selected_partners)
        this.cities = res.data.cities
        this.currencies = res.data.currencies
        this.rooms = res.data.roomTypes
        this.setInfo();

      } else {
        this.message.custom(res.message);
      }
      this.isLoading = false;

    }, (error: any) => {
      // this.message.error()
      this.isLoading = false;

    })
  }
select_all_hotel(){
  this.packages=this.packages.map((pack:any)=>(
    {...pack,
      isChecked:!this.select_all
    }
  ))
  this.select_all=!this.select_all;

}




  applyRate(){

   let check_isChecked_package=this.packages.filter((pack:any)=>pack.isChecked)
    if(!this.apply_rate_stats ){

      if(this.rate_apply_to.length>0 && this.rate_number && this.rateChange){

        if(check_isChecked_package.length>0){
          this.apply_rate_stats=true
          if(+this.rateChange===3){
            this.packages= this.packages.map((pack:any)=> {
              if(pack.isChecked){
                return {
                  ...pack,
                  rooms: pack.rooms.map((room: any) => ({
                    ...room,
                    price: this.rate_apply_to.includes('price') ? +this.rate_number : room.price,
                    chd_n_price: this.rate_apply_to.includes('chd_n_price') ? +this.rate_number : room.chd_n_price,
                    chd_w_price: this.rate_apply_to.includes('chd_w_price') ? +this.rate_number : room.chd_w_price,
                    extra_bed_price: this.rate_apply_to.includes('extra_bed_price') ? +this.rate_number : room.extra_bed_price,
                    inf_price: this.rate_apply_to.includes('inf_price') ? +this.rate_number : room.inf_price,


                  }))


                }
              }else{
                return {
                  ...pack
                }
              }



            })
          }else{


            this.packages= this.packages.map((pack:any)=> {
              if(pack.isChecked){
                return {
                  ...pack,
                  rooms:
                    pack.rooms.map((room: any) => ({
                      ...room,
                      price: this.rate_apply_to.includes('price') ? (+this.rateChange === 1 ? +room.price + (+this.rate_number) : +room.price - (+this.rate_number)) : room.price,
                      chd_n_price: this.rate_apply_to.includes('chd_n_price') ? (+this.rateChange === 1 ? +room.chd_n_price + (+this.rate_number) : +room.chd_n_price - (+this.rate_number)) : room.chd_n_price,
                      chd_w_price: this.rate_apply_to.includes('chd_w_price') ? (+this.rateChange === 1 ? +room.chd_w_price + (+this.rate_number) : +room.chd_w_price - (+this.rate_number)) : room.chd_w_price,
                      extra_bed_price: this.rate_apply_to.includes('extra_bed_price') ? (+this.rateChange === 1 ? +room.extra_bed_price + (+this.rate_number) : +room.extra_bed_price - (+this.rate_number)) : room.extra_bed_price,
                      inf_price: this.rate_apply_to.includes('inf_price') ? (+this.rateChange === 1 ? +room.inf_price + (+this.rate_number) : +room.inf_price - (+this.rate_number)) : room.inf_price,
                    }))
                }}else{
                return {...pack}
              }
            })
          }
          this.rateChange=null;
          this.rate_number=null;
          this.rate_apply_to=[]

          alert('تغییرات با موفقیت انجام شد')
          this.apply_rate_stats=false
          this.select_all_hotel()

        }else{
          alert('لطفا پکیج های خود را انتخاب کنید')

        }






      }else{
        alert('لطفا فیلد های زیر را تکمیل کنید!')
      }
    }else{
      return
    }





  }

  getPartnersNames(ids: number[]) {
    let result: number[] = [];
    ids.forEach((x: any) => {
      let itemFiltered: any = this.partners.filter((item: any) => item.id === x)
      if (itemFiltered.length > 0) {
        result.push(itemFiltered[0].name);
      }
    })
    return result
  }



  override getHotels(): void {
    this.hotelLoading = true;
    if (this.destination_idFC.valid && this.checkinFC.valid && this.checkoutFC.valid) {
      const req = {
        "destination_id": this.destination_idFC.value,
        "checkin": this.checkinFC.value ? moment(this.checkinFC.value).format('YYYY-MM-DD') : null,
        "checkout": this.checkoutFC.value ? moment(this.checkoutFC.value).format('YYYY-MM-DD') : null,
        "night_num": this.night_numFC.value ? this.night_numFC.value : null,
      }
      this.tourApi.gethotels(req).subscribe((res: any) => {
        if (res.isDone) {
          this.hotels = res.data;
          this.convertPackages();
        } else {
          this.message.custom(res.message);
        }
        this.hotelLoading = false;
      }, (error: any) => {
        this.hotelLoading = false;
        // this.message.error()
      })
    }
  }

  changeHotelPackage(){
this.select_all=true;
  }


  convertPackages() {
    this.packages = [];
    this.tourData.packages.forEach((x: any) => {
      let item: PackageTourDTO = {
        isChecked:false,
        board_type:x.board_type,
        hotel_id: x.hotel.id,
        order_item: x.order_item,
        provider_id:x.provider_id,
        id: x.id,
        offered: x.offered,
        cwb: x.cwb ?? 0,
        child_age: x.child_age ?? '',
        rooms: x.rooms ?? []
      }
      this.packages.push(item)
    })
    this.packages.sort((a: any, b: any) => a.order_item - b.order_item)


    // console.log('asd',this.packages)
  }

  override getTransferRates(): void {
    // debugger
    if (this.origin_idFC.valid && this.destination_idFC.valid && this.checkinFC.valid && this.checkoutFC.valid) {
      const req = {
        origin_id: this.origin_idFC.value,
        destination_id: this.destination_idFC.value,
        checkin: this.checkinFC.value ? moment(this.checkinFC.value).format('YYYY-MM-DD') : null,
        checkout: this.checkoutFC.value ? moment(this.checkoutFC.value).format('YYYY-MM-DD') : null,
      }
      this.isLoading = true;

      this.tourApi.getFlights(req).subscribe((res: any) => {
        if (res.isDone) {
          this.transferRates = res.data;
          this.transferRates?.forEach(x => {
            this.tourData.flightIds.forEach((y: any) => {
              if (x.mixed_id == y) {
                x.flight.isChecked = true
              }
            })
          })
        } else {
          this.message.custom(res.message);
        }
        this.isLoading = false;

        if(this.tourData.flightIds.length===this.transferRates.length){
          this.checkAll=true
        }

      }, (error: any) => {
        // this.message.error()
        this.isLoading = false;

      })
    }
  }

  // override getCities(): void {
  //   this.isLoading = true;
  //   const req: CityListReq = {
  //     hasHotel: 0,
  //     hasFlight: 0,
  //   }
  //   this.cityApi.getCities(req).subscribe((res: any) => {
  //     if (res.isDone) {
  //       this.cities = res.data;
  //       this.getInfo()

  //     }
  //     this.isLoading = false;

  //   }, (error: any) => {
  //     this.message.error()
  //     this.isLoading = false;

  //   })
  // }



   removeEditPackage(index: number, id: number) {
    this.del_packages.push(id);
    this.packages.splice(index, 1);
  }
  override setReq() {

    this.req = {
      offered:this.offered,
      title: this.titleFC.value ?? '',
      is_bundle: this.is_bundle,
      is_online: this.is_online,
      currencies: this.selectedCurrency,
      origin_id: +(this.origin_idFC.value ?? ''),
      destination_id: +(this.destination_idFC.value ?? ''),
      night_num: +(this.night_numFC.value ?? ''),
      del_packages: this.del_packages,
      day_num: +(this.day_numFC.value ?? ''),
      tour_type: +(this.tour_typeFC.value ?? ''),
      checkin: this.checkinFC.value ? moment(this.checkinFC.value).format('YYYY-MM-DD') : '',
      checkout: this.checkoutFC.value ? moment(this.checkoutFC.value).format('YYYY-MM-DD') : '',
      expired_at: this.expired_atFC.value ? moment(this.expired_atFC.value).format('YYYY-MM-DD') : '',
      status_id: +(this.status_idFC.value ?? ''),
      flights: this.flights,
      partnerIds: this.getPartners(),
      packages: this.packages,
      description:this.descriptionFC.value  ?? '',
      service:this.serviceFC.value  ?? '',
      documents:this.documentFC.value  ?? '',
      del_rooms:this.del_rooms ?? []
    }

    let newPackage = this.req.packages.map((p: any, index: number) => {
      return {
        ...p,
        order_item: index
      }
    })

    this.req.packages = newPackage
  }

  override submit(): void {

    if(this.flights.length > 0) {

    this.setReq()

      // console.log('fpack',this.req)
    this.tourApi.update(+this.id, this.req).subscribe((res: any) => {
      if (res.isDone) {
        this.message.showMessageBig(res.message);
        this.errorService.clear();
        this.router.navigateByUrl('/panel/packages');
      }
    }, (error: any) => {
      if (error.status == 422) {
        this.errorService.recordError(error.error.errors);
        this.message.showMessageBig('اطلاعات ارسال شده را مجددا بررسی کنید')
        this.packagesErr=error.error.errors
        console.log('error',error.error.errors)
      } else {
        this.message.showMessageBig('مشکلی رخ داده است لطفا مجددا تلاش کنید')
      }
      this.checkError.check(error);
    })
  }else {
    this.message.custom('پروازی انتخاب نکرده اید')
  }
  }


  setInfo() {

    this.documentFC.setValue(this.tourData.documents)
    this.serviceFC.setValue(this.tourData.service)
    this.descriptionFC.setValue(this.tourData.description)
    this.titleFC.setValue(this.tourData.title);
    this.origin_idFC.setValue(this.tourData.origin_id);
    this.destination_idFC.setValue(this.tourData.destination_id);
    this.night_numFC.setValue(this.tourData.night_num);
    this.day_numFC.setValue(this.tourData.day_num);
    this.tour_typeFC.setValue(this.tourData.tour_type);
    this.checkinFC.setValue(this.tourData.checkin);
    this.status_idFC.setValue(this.tourData.status.id)
    this.checkoutFC.setValue(this.tourData.checkout);
    // this.status_idFC.setValue(this.checkStatus(this.tourData.status.label));
    this.expired_atFC.setValue(this.tourData.expired_at);
    // this.onTitleGenerator(this.tourData.origin_name ?? '', this.tourData.destination_name);
    this.flights = this.tourData.flightIds;
    this.selectedCurrency = this.tourData.currencies
    this.is_bundle = this.tourData.is_bundle
    this.is_online = this.tourData.is_online
    // this.packages = this.tourData.packages
    this.getTransferRates();
    this.getHotels();
  }

  checkStatus(name: string) {
    return this.statuses.find(x => x.name === name)?.id ?? 0
  }



  drop(event: CdkDragDrop<PackageTourDTO[]>) {
    moveItemInArray(this.packages, event.previousIndex, event.currentIndex);
  }
}
