import { Component, EventEmitter, Input, OnInit, Output, SimpleChange } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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
  @Input() isLoading = false;
  @Output() onFilterClicked = new EventEmitter()
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
    },
    filterMode: '',
  }
  cols: string = '';

  isSelectedAllChecked = false;
  isMenuGroup = false
  selectedItems: any = [];

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public dialog: MatDialog,
    public calendarService: CalenderServices,
    public permission: PermitionsService,
    public publicService: PublicService,
  ) {
  }

  ngOnChanges(changes: SimpleChange) {
    // @ts-ignore
    if (changes.data) {
      this.data.props.forEach(x => {
        this.cols = this.cols + ' ' + x.col
      })
      this.setIsselectedToData()
    }
  }

  ngOnInit() {
  }

  openFilter() {
    this.dialog.open(DynamicFilterPopupComponent, {
      width: '30%',
      height: 'auto',
      data: this.data.filters,
    }).afterClosed().subscribe(result => {
      if (result) {
        this.sendFilters()
      }
    })
  }

  sendFilters() {
    this.router.navigate([], { queryParams: this.getQParames() });
    this.onFilterClicked.emit(true)
  }

  getQParames() {
    let qparams = {};
    this.data.filters.forEach((element: any) => {
      if (element.value && element.value !== '') {
        qparams = { ...qparams, [element.key]: element.value }
      }
    });
    return qparams
  }

  isTrash() {
    this.data.isTrash = true
    this.onFilterClicked.emit(true)
  }

  isTrashed() {
    this.data.isTrash = false
    this.onFilterClicked.emit(true)
  }

  deleteFilters() {
    this.data.filters.map(item => item.value = '')
    this.router.navigate([], {});
    this.onFilterClicked.emit(true)
  }

  checkHasFilter() {
    return this.data.filters.filter(item => item.value !== '' && item.key !== 'page').length > 0
  }

  checkShowFilter() {
    return this.data.filters.find(item => item.key !== 'page')
  }

  onPageChanged(event: any) {
    this.data.pagination.pageNumber = event;
    this.data.filters.filter(x => x.key === 'page')[0].value = event
    this.sendFilters()
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
      button.data = this.selectedItems;
      this.buttonClicked.emit(button)
    }
    this.clearSelectedItems();
  }

  getValue(x: any, prop: IListProps) {
    let props = prop.name.split('.')
    switch (prop.type) {
      case 'text':
        return this.checkEmptyText(prop, x)
      case 'number':
        return this.checkNumber(prop, x)
      case 'price':
        return this.checkPrice(prop, x)
      case 'date':
        return props.length > 1 ? this.calendarService.convertDate(x[props[0]][props[1]], 'fa', 'jYYYY/jMM/jDD') :
          this.calendarService.convertDate(x[prop.name], 'fa', 'jYYYY/jMM/jDD')
      case 'dateTime':
        return props.length > 1 ? this.calendarService.convertDate(x[props[0]][props[1]], 'fa', 'jYYYY/jMM/jDD HH:mm') :
          this.calendarService.convertDate(x[prop.name], 'fa', 'jYYYY/jMM/jDD HH:mm')
      case 'boolean':
        return x[prop.name]
      case 'img':
        return
      case 'checkbox':
        return
      case 'buttons':
        return
    }
  }

  checkPrice(prop: IListProps, x: any) {
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

  checkNumber(prop: IListProps, x: any) {
    let props = prop.name.split('.')
    if (props.length > 2) {
      return x[props[0]][props[1]][props[2]] ? x[props[0]][props[1]][props[2]] : '---'
    } else if (props.length > 1) {
      return x[props[0]][props[1]] ? x[props[0]][props[1]] : '---'
    } else {
      return x[prop.name] ? x[prop.name] : '---'
    }
  }

  checkEmptyText(prop: IListProps, x: any) {
    let keys = prop.name.split('|')
    if (keys.length > 1) {
      for (let index = 0; index < keys.length; index++) {
        let value = this.checkText(x, keys[index].trim())
        if (value && value !== '---') {
          return value
        }
      }
      return '---'
    } else {
      return this.checkText(x, keys[0])
    }
  }

  checkText(x: any, itemName: string) {
    let items = itemName.split('.')
    if (items.length > 2) {
      let value = x[items[0]][items[1]][items[2]]
      return value && value.trim() !== '' ? value : '---'
    } else if (items.length > 1) {
      let value = x[items[0]][items[1]]
      return value && value.trim() !== '' ? value : '---'
    } else {
      return x[itemName] && x[itemName].trim() !== '' ? x[itemName] : '---'
    }
  }

  checkAll() {
    if (this.isSelectedAllChecked) {
      this.selectedItems = []
      this.data.data.forEach((item: any) => {
        item.selected = true
        this.selectedItems.push(item.id)
      })
    } else {
      this.data.data.forEach((item: any) => {
        item.selected = false
      })
      this.selectedItems = []
    }
  }

  clearSelectedItems() {
    this.data.data.forEach((item: any) => {
      item.selected = false
    })
    this.isSelectedAllChecked = false;
    this.selectedItems = []
  }

  handleSelected(itemData: any) {
    if (this.selectedItems.find((x: number) => x === itemData.id)) {
      let item_index = this.selectedItems.findIndex((x: number) => x === itemData.id)
      this.selectedItems.splice(item_index, 1)
    } else {
      this.selectedItems.push(itemData.id)
    }
  }

  setIsselectedToData() {
    this.data.data.forEach((x: any) => {
      x.isSelected = false;
    })
  }

  getGroupChangesButton() {
    let groupChangesButton = this.data.buttons.find(button => button.name === 'groupChanges')
    return groupChangesButton ? groupChangesButton : null
  }

  getImage(data: any) {
    return data ? data.url : ''
  }

  checkShowButtons(button: IListButtons){
    return button.show && this.permission.checkSubItem(button.permission)
  }

}
