import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {CategoryApiService} from "../../Core/Https/category-api.service";
import {CategoryReqDTO, CategoryResDTO} from "../../Core/Models/CategoryDTO";
import {MessageService} from "../../Core/Services/message.service";
import {CheckErrorService} from "../../Core/Services/check-error.service";
import {FormControl} from "@angular/forms";


@Component({
  selector: 'prs-select-categories',
  templateUrl: './select-categories.component.html',
  styleUrls: ['./select-categories.component.scss']
})
export class SelectCategoriesComponent implements OnInit,OnChanges {
  categories: CategoryResDTO[] = []
  categoryFC = new FormControl();
  selectedCategory: any;
  @Output() categoryIds = new EventEmitter();
  @Input() inComingCategory: number[] = []

  constructor(public api: CategoryApiService,
              public checkError: CheckErrorService,
              public messageService: MessageService) {
  }

  ngOnInit(): void {
    this.getCategories()
  }

  getCategories(): void {
    const req: CategoryReqDTO = {
      paginate: false,
      perPage: 50,
      search: null,
      getParent: false
    }
    this.api.getCategories(req).subscribe((res: any) => {
        if (res.isDone) {
          this.categories = res.data
          debugger
          if (this.inComingCategory.length > 0) {
            this.selectedCategory = this.inComingCategory
          }
        }
      }, (error: any) => {
        this.checkError.check(error)
      }
    )
  }

  getCategorySelection(): void {
    this.categoryIds.emit(this.selectedCategory);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

}
