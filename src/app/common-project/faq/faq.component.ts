import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {FaqDTO} from "../../Core/Models/cityDTO";
import {MessageService} from "../../Core/Services/message.service";

@Component({
  selector: 'prs-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit, OnChanges {
  @Input() inComingFaq = '';
  faqList = [];
  @Output() result = new EventEmitter();
  form = new FormGroup({
    faq: new FormArray([])
  });

  constructor(public fb: FormBuilder,
              public message: MessageService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setValue()
  }

  ngOnInit(): void {
  }

  /*############### Add Dynamic Elements ###############*/
  get Faq() {
    return this.form.get('faq') as FormArray
  }

  add(): void {
    this.Faq.push(this.addItems())
  }

  addItems(item: FaqDTO | null = null) {
    return this.fb.group({
      question: [item ? item.question : ''],
      answer: [item ? item.answer : '']
    });
  }

  removeFaq(i: any) {
    this.Faq.removeAt(i);
  }

  setValue(): void {
    this.faqList = this.inComingFaq !== '' ? JSON.parse(this.inComingFaq) : [];
    this.faqList.forEach(x => {
      this.Faq.push(this.addItems(x))
    })
    this.result.emit(this.form.value.faq)
  }

  submit(): void {
    this.result.emit(this.form.value.faq)
    this.message.custom('سوالات با موفقیت ثبت شد. لطفا روی ثبت نهایی کلیک کنید')
  }

}
