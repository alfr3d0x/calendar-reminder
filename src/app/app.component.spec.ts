import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatTooltipModule, MatDialogModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';

import { OrderModule } from 'ngx-order-pipe';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        OrderModule,
        MatTooltipModule,
        MatDialogModule,
        HttpClientModule
      ],
      declarations: [
        AppComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
  }));

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it(`should have as title 'calendar-reminder'`, () => {
    expect(app.title).toEqual('calendar-reminder');
  });

  describe('Validate reminder', () => {
    it('should not be valid', () => {
      let valid = app.validateReminder({});
      expect(valid).toBeFalsy();
    });

    it('should be valid', () => {
      let valid = app.validateReminder({
        description: "desc",
        city: "Casacas",
        time: "4:30pm"
      });
      expect(valid).toBeTruthy();
    });
  })
});
