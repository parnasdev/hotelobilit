import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { Router } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { IListModel, IListButtons, IListProps } from 'src/app/Core/Models/dynamicList.model';
import { PublicService } from 'src/app/Core/Services/public.service';
import { DynamicFilterPopupComponent } from '../dynamic-filter-popup/dynamic-filter-popup.component';
import { SeparatorPipe } from '../pipes/separator.pipe';
import { CalenderServices } from 'src/app/Core/Services/calender-service';
import { PermitionsService } from 'src/app/Core/Services/permitions.service';


@Component({
  selector: 'prs-dynamic-list',
  templateUrl: './dynamic-list.component.html',
  styleUrls: ['./dynamic-list.component.scss']
})
export class DynamicListComponent implements OnInit {
  @Output() buttonClicked = new EventEmitter()
  @Output() rowButtonClicked = new EventEmitter()
  @Output() pageChanged = new EventEmitter()
  @Input() isLoading = false;
  @Output() onFilterClicked = new EventEmitter()
  isFilter=false
  @Input() data: IListModel = {
    props: [],
    data: '',
    isTrash: false,
    showTrash: false,
    buttons: [],
    rowButtons: [],
    filters: [],
    pagination: {
      confiq: '',
      meta: '',
      pageNumber: 1
    },
    label: '',
    emptyBox: {
      text: '',
      icon: ''
    }
  }
  cols: string = '';
  constructor(public router: Router,
    public dialog: MatDialog,
    public calendarService: CalenderServices,
    public permition: PermitionsService,
    public publicService: PublicService,
  ) {
  }

  ngOnChanges(changes: SimpleChange) {
    // @ts-ignore
    if (changes.data) {

      this.data.props.forEach(x => {
        this.cols = this.cols + ' ' + x.col
      })
    }
  }

  ngOnInit() {
    console.log(this.data)
  }

  openFilter() {
    this.dialog.open(DynamicFilterPopupComponent, {
      width: '30%', height: '75%',
      data: {data:this.data.filters,isFilter:this.isFilter},

    }).afterClosed().subscribe(result => {
      if (result) {
        this.data.filters = result






      }
      this.onFilterClicked.emit(true)
    })
  }

  isTrash() {

    this.data.isTrash = true
    this.onFilterClicked.emit(true)
  }

  isTrashne() {

    this.data.isTrash = false
    this.onFilterClicked.emit(true)
  }

  deleteFilters() {
    this.data.filters.map(item => item.value = '')
    this.onFilterClicked.emit(true)
    this.isFilter=false
  }


  onPageChanged(event: any) {
    this.data.pagination.pageNumber = event;
    this.pageChanged.emit(this.data.pagination.pageNumber)
  }

  onRowButtonClicked(button: IListButtons, item: any) {
    if (button.isLink) {
      this.router.navigateByUrl(button.link);
    } else {
      this.rowButtonClicked.emit({ button, item })
    }
  }

  onButtonClicked(button: IListButtons) {
    if (button.isLink) {
      this.router.navigateByUrl(button.link);
    } else {
      this.buttonClicked.emit(button)
    }
  }

  getText(x: any, prop: IListProps) {
    const sepratorPipe = new SeparatorPipe();
    let props = prop.name.split('.')
    switch (prop.type) {
      case 'text':
        return this.checkText(prop, x)
      case 'number':
        return this.checkNumber(prop, x)
      case 'date':
        return props.length > 1 ? this.calendarService.convertDate(x[props[0]][props[1]], 'fa', 'jYYYY/jMM/jDD HH:mm') :
          this.calendarService.convertDate(x[prop.name], 'fa', 'jYYYY/jMM/jDD HH:mm')
      case 'checkbox':
        return
      case 'buttons':
        return
    }
  }


  checkNumber(prop: IListProps, x: any) {
    const sepratorPipe = new SeparatorPipe();
    let props = prop.name.split('.')
    if (props.length > 2) {
      return sepratorPipe.transform(x[props[0]][props[1]][props[2]])
    } else if (props.length > 1) {
      return sepratorPipe.transform(x[props[0]][props[1]])
    } else {
      return sepratorPipe.transform(x[prop.name])

    }
  }

  checkText(prop: IListProps, x: any) {
    const sepratorPipe = new SeparatorPipe();
    let props = prop.name.split('.')
    if (props.length > 2) {
      return x[props[0]][props[1]][props[2]]
    } else if (props.length > 1) {
      return x[props[0]][props[1]]
    } else {
      return x[prop.name]

    }
  }



}
