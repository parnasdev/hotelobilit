import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IListButtons } from 'src/app/Core/Models/dynamicList.model';
import { MessageService } from 'src/app/Core/Services/message.service';
import { PublicService } from 'src/app/Core/Services/public.service';

@Component({
  selector: 'prs-group-changes',
  templateUrl: './group-changes.component.html',
  styleUrls: ['./group-changes.component.scss']
})
export class GroupChangesComponent {

  @Input() groupChangesButton: IListButtons | null = {
    name: '',
    label: '',
    link: '',
    isLink: false,
    show: false,
    showDD: false,
    permission: '',
    icon: '',
    style: '',
    data: [],
    children: []
  }
  @Input() selectedItems: any = [];
  @Output() clearSelecteds = new EventEmitter()
  @Output() reloadData = new EventEmitter()
  @Output() buttonClicked = new EventEmitter()

  constructor(
    public dialog: MatDialog,
    public publicService: PublicService,
    public messageService: MessageService,
    ){

  }

  showMenuGroup() {
    if(this.groupChangesButton){
      this.groupChangesButton.showDD = !this.groupChangesButton.showDD
    }
  }

  openGroupChangesPopup(button: IListButtons) {
    if (this.selectedItems.length > 0) {
      this.buttonClicked.emit(button)
    } else {
      this.messageService.custom('لطفا برای انجام تغییرات یکی از آیتم ها را انتخاب کنید')
    }
  }

  deleteSelecteds(){
    this.clearSelecteds.emit(true)
  }

  checkGroupChanges(){
    this.groupChangesButton?.children.find(button => button.name === 'groupChanges')
  }

  checkGroupChangesShowDD(){
    this.groupChangesButton?.children.find((button:any) => button.name === 'groupChanges')?.showDD
  }


}
