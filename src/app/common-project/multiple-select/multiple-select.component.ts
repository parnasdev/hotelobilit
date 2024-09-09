import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'prs-multiple-select',
  templateUrl: './multiple-select.component.html',
  styleUrls: ['./multiple-select.component.scss']

})
export class MultipleSelectComponent {
  @Input() data: any = []
  @Input() showKey: string = ''
  @Input() incommingData: any[] = []
  @Input() valueKey: string | null = '';
  @Output() result: EventEmitter<any> = new EventEmitter();

  filteredList: any[] = []
  showItem: any
  selectedItems: any = []
  text: string = ''
  isShow = false
  isSelectAll = false;

  constructor() {}

  findIschecked() {
    let ischeckedItem = this.filteredList.filter((i: any) => i.isChecked)
    return ischeckedItem[0][this.showKey]
  }

  search() {
    if (this.text === '') {
      this.filteredList = this.data
    } else {
      this.filteredList = this.data.filter((i: any) => i[this.showKey].includes(this.text))
    }
  }

  passToParent() {
    this.selectedItems = [];
    this.data.forEach((item: any) => {
      if (item.isChecked) {
        this.selectedItems.push(this.valueKey ? item[this.valueKey] : item)
      }
    })
    this.showItem = this.getShowItem()
    this.result.emit(this.selectedItems)
  }

  getShowItem() {
    let itemFiltered = this.filteredList.filter((i: any) => i.isChecked);
    return itemFiltered.length > 0 ? itemFiltered[0].showKey : ''
  }

  ngOnChanges(changes: any) {
    if (changes.data) {
      this.convertData();
      this.data.map((item: any) => {
        item.isChecked = false
      });
      this.filteredList = this.data
    }
    if (changes.incommingData) {
      if (changes['incommingData'] && changes['incommingData'].currentValue) {
        if (this.incommingData && this.incommingData.length && this.incommingData.length > 0) {
          this.selectedItems = []
          this.filteredList.forEach((x: any) => {
            this.incommingData.forEach((y: any) => {
              let _x = x[this.valueKey ? this.valueKey : 'id']
              if (_x === y) {
                x.isChecked = true
                this.selectedItems.push(_x)
                this.showItem = this.getShowItem()
              }
            })
          })
        }
      }
    }
  }

  changeSelectionItems() {
    this.isSelectAll = !this.isSelectAll
    this.filteredList.map(item => {
      item.isChecked = this.isSelectAll
    })
    this.passToParent()
  }

  convertData() {
    if (this.showKey !== '') {
      this.data.forEach((item: any) => item.showKey = this.showKey)
    }
    let _list: any = []
    let showKeys = this.showKey ? this.showKey.split('&') : []
    if (showKeys.length > 0) {
      this.data.forEach((item: any) => {
        let showKey = ''
        showKeys.forEach(str => {
          showKey += item[str.trim()] + ' '
        })
        item = { ...item, showKey }
        _list.push(item)
      })
      this.data = []
      this.data = this.data.concat(_list)
    }
  }

}
