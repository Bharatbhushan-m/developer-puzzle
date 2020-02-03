import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'coding-challenge-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
  @Input() data$: Observable<any>;
  public chartData: []; /*changed 'any' to Array type for more generic*/
  public chartDataUnsubscribe: Subject<void> = new Subject<void>();


  chart: {
    title: string;
    type: string;
    data: any;
    columnNames: string[];
    options: any;
  };
  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit() {
    this.chart = {
      title: '',
      type: 'LineChart',
      data: [],
      columnNames: ['period', 'close'],
      options: { title: `Stock price`, width: '600', height: '400' }
    };

    this.data$.pipe(takeUntil(this.chartDataUnsubscribe))
    .subscribe(newData => (this.chartData = newData));

  }

  /**
  * Added unscubscription to avoid memory leaks
  */
 ngOnDestroy() {
  this.chartDataUnsubscribe.next();
  this.chartDataUnsubscribe.complete();
}

}
