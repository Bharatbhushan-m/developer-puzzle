import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { StocksComponent } from './stocks.component';
import { PriceQueryFacade } from '@coding-challenge/stocks/data-access-price-query';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule, MatSelectModule } from '@angular/material';
import { SharedUiChartModule } from '@coding-challenge/shared/ui/chart';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('StocksComponent', () => {
  let component: StocksComponent;
  let fixture: ComponentFixture<StocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StocksComponent ],
      providers: [
        {
          provide: PriceQueryFacade, useValue: {
            priceQueries$: of([]),
            fetchQuote: jest.fn()
          }
        }
      ],
      imports: [
        BrowserAnimationsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        SharedUiChartModule
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('detectChanges', () => {
    it('should not process quotes if only symbol was provided', fakeAsync(() => {
      component.stockPickerForm.patchValue({
        symbol: 'AAPL'
      }, {
          emitEvent: true
        });
      fixture.detectChanges();
      const priceQueryFacade: PriceQueryFacade = TestBed.get(PriceQueryFacade);
      expect(priceQueryFacade.fetchQuote).not.toHaveBeenCalled();
    }));

    it('should not process quotes if only period was provided', fakeAsync(() => {
      component.stockPickerForm.patchValue({
        period: '1y'
      }, {
          emitEvent: true
        });
      fixture.detectChanges();
      const priceQueryFacade: PriceQueryFacade = TestBed.get(PriceQueryFacade);
      expect(priceQueryFacade.fetchQuote).not.toHaveBeenCalled();
    }));

    it('should request quotes and get response once form is filled and valid', fakeAsync(() => {
      component.stockPickerForm.patchValue({
        symbol: 'AAPL',
        period: '2y'
      }, {
          emitEvent: true
        });
      fixture.detectChanges();
      const priceQueryFacade: PriceQueryFacade = TestBed.get(PriceQueryFacade);
      expect(priceQueryFacade.fetchQuote).toHaveBeenCalledTimes(1);
      expect(priceQueryFacade.fetchQuote).toHaveBeenCalledWith('AAPL', '2y');
    }));
  });
});
