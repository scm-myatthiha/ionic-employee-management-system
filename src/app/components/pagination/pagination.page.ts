import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from "@angular/core";

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.page.html',
  styleUrls: ['./pagination.page.scss'],
})
export class PaginationPage implements OnInit, OnChanges {

  @Input() current: number = 0;
  @Input() total: number = 0;
  @Input() pagesFromList: number[] = [];

  @Output() goTo: EventEmitter<number> = new EventEmitter<number>();
  @Output() next: EventEmitter<number> = new EventEmitter<number>();
  @Output() previous: EventEmitter<number> = new EventEmitter<number>();

  public pages: number[] = [];
  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      (changes.current && changes.current.currentValue) ||
      (changes.total && changes.total.currentValue)
    ) {
      this.pages = this.getPages(this.current, this.total);
    }
  }

  changeFromLimit(current, total) {
    this.pages = this.getPages(current, total);
  }

  onGoTo(page: number): void {
    this.goTo.emit(page);
  }

  lastPage(page: number): void {
    this.goTo.emit(page)
  }

  onNext(): void {
    this.next.emit(this.current);
  }

  onPrevious(): void {
    this.previous.next(this.current);
  }

  private getPages(current: number, total: number): number[] {
    if (total <= 7) {
      return [...Array(total).keys()].map((x) => ++x);
    }

    if (current > 4) {
      if (current >= total - 3) {
        return [1, -1, total - 3, total - 2, total - 1, total];
      } else {
        return [1, -1, current - 1, current, current + 1, -1, total];
      }
    }

    return [1, 2, 3, 4, -1, total];
  }
}