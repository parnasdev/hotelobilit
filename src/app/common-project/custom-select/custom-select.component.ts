import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormControl } from "@angular/forms";
import { categoriesDTO } from 'src/app/Core/Models/newPostDTO';
import { Observable } from "rxjs";
import { map, startWith } from "rxjs/operators";
import { MatDialog } from '@angular/material/dialog';
import { ResponsiveService } from 'src/app/Core/Services/responsive.service';

declare let $: any;

@Component({
  selector: 'prs-custom-select',
  templateUrl: './custom-select.component.html',
  styleUrls: ['./custom-select.component.scss'],
})

export class CustomSelectComponent implements OnChanges {
  value: string = '';
  disabled = false;
  public dd = false;
  isMobile = false;
  isTablet=false;
  isDesktop=false;

  inpFC = new FormControl();

  @Output() itemResult = new EventEmitter()
  @Input() list: any[] = []
  @Input() inCommingItem: any;
  @Input() name= 'custom'
  @Input() baseType: boolean = false;
  @Input() title = 'انتخاب کنید';
  selectedItem:any

  filteredOptions!: Observable<any[]>;

  constructor(
    public mobileService: ResponsiveService,
    public dialog: MatDialog,
    ){
      this.isMobile = mobileService.isMobile();
      this.isDesktop = mobileService.isDesktop();
      this.isTablet = mobileService.isTablet();
  }

  ngOnInit() {
    this.filteredOptions = this.inpFC.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }
  openDropdown() {
      this.dd = true;
  }
  ngOnChanges() {
    
    if (this.inCommingItem && this.inCommingItem !== '') {
      if (this.list.filter(c => (c.id === +this.inCommingItem) ||
        (c.id === this.inCommingItem) ||
        (c.title === this.inCommingItem) ||
        (c.name === this.inCommingItem) ||
        (c.full_name === this.inCommingItem) ||
        (c.slug === this.inCommingItem)).length > 0) {

          let item = this.list.filter(c =>
            (c.id === +this.inCommingItem) ||
            (c.title === this.inCommingItem) ||
            (c.name === this.inCommingItem) ||
            (c.full_name === this.inCommingItem) ||
            (c.slug === this.inCommingItem))[0]
            
        this.inpFC.setValue(item.name ? item.name : (item.title ? item.full_name : item.title));
        this.selectedItem = item
          // this.title = item.name
        // this.itemResult.emit(this.list.filter(c => c.slugEn === this.inCommingItem)[0])
      }
    }
    this.filteredOptions = this.inpFC.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value)),
    );
  }

  private _filter(value: any): categoriesDTO[] {
    let filterValue = value
    if(filterValue !== '') {
      filterValue  = value;
    }
    return this.list.filter(item =>item?.id?.includes(filterValue) ||  item?.name?.includes(filterValue) || item.title?.includes(filterValue)|| item.full_name?.includes(filterValue));
  }



  onClickedOutside(jmgg:any){
    this.dd = false
  }

  changed(item: any): void {
    this.itemResult.emit(item)
    this.selectedItem=item
    this.dd = false

  }


}
