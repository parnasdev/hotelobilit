import {Component, EventEmitter, Input, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {FaqDTO} from "../../Core/Models/cityDTO";
import {FooterLinks} from "../../Core/Models/commonDTO";

@Component({
  selector: 'prs-footer-links',
  templateUrl: './footer-links.component.html',
  styleUrls: ['./footer-links.component.scss']
})
export class FooterLinksComponent implements OnInit {
  @Input() incomingLinks: FooterLinks[] = [];
  @Output() result = new EventEmitter();
  form = new FormGroup({
    footerLinks: new FormArray([])
  });

  constructor(public fb: FormBuilder) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setValue()
  }

  ngOnInit(): void {
  }

  /*############### Add Dynamic Elements ###############*/
  get footerLinks() {
    return this.form.get('footerLinks') as FormArray;
  }

  add(): void {
    this.footerLinks.push(this.addItems())
  }

  addItems(item: FooterLinks | null = null) {
    return this.fb.group({
      title: [item ? item.title : ''],
      slug: [item ? item.slug : ''],
      type: [item ? item.type : '']
    });
  }

  removeLinks(i: any) {
    this.footerLinks.removeAt(i);
  }

  setValue(): void {
    // this.links = this.incommingLinks !== [] ? JSON.parse(this.inComingFaq) : [];
    this.incomingLinks.forEach(x => {
      this.footerLinks.push(this.addItems(x))
    })
  }

  submit(): void {
    this.result.emit(this.form.value.footerLinks)
  }
}
