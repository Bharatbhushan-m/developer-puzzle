import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { Subscription } from 'rxjs';
import { MatDatepickerInputEvent } from '@angular/material';

@Component({
  selector: 'coding-challenge-stocks',
  templateUrl: './stocks.component.html',
  styleUrls: ['./stocks.component.css']
})
export class StocksComponent implements OnInit {
  stockPickerForm: FormGroup;
  symbol: string;
  maxDate: Date = new Date();

  quotes$ = this.priceQuery.priceQueries$;

  private stockPickerValueChangeSubscription: Subscription;

  constructor(private fb: FormBuilder, private priceQuery: PriceQueryFacade) {
    this.stockPickerForm = fb.group({
      symbol: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required]
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.stockPickerValueChangeSubscription.unsubscribe();
  }


  fetchQuote() {
    if (this.stockPickerForm.valid) {
      const { symbol, fromDate, toDate } = this.stockPickerForm.value;
      this.priceQuery.fetchQuote(symbol, fromDate, toDate);
    }
  }

  /*if from date is after to date, make it the same as to date*/
  public fromDateChange(date): void {
    const { toDate } = (this.stockPickerForm.get('toDate').valid) ? this.stockPickerForm.value : '';
    if (toDate) {
      if (date.value.getTime() > toDate.getTime()) {
        this.stockPickerForm.controls.fromDate.setValue(toDate)
      };
    }
  }

  /*if to date is after from date, make it the same as from date*/
  public toDateChange(date): void {
    const { fromDate } = (this.stockPickerForm.get('fromDate').valid) ? this.stockPickerForm.value : '';
    if (fromDate) {
      if (date.value.getTime() < fromDate.getTime()) {
        this.stockPickerForm.controls.toDate.setValue(fromDate)
      }
    }
  }
}
