import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FeesRoutingModule } from './fees-routing.module';
import { AllfeesComponent } from './allfees/allfees.component';
import { AddfeesComponent } from './addfees/addfees.component';
import { EditfeesComponent } from './editfees/editfees.component';
import {UsersRoutingModule} from "../users/users-routing.module";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ComponentsModule} from "@shared/components/components.module";
import {SharedModule} from "@shared";
import { PaymentConfirmationDialogComponent } from './payment-confirmation-dialog/payment-confirmation-dialog.component';
import { ReceiptComponent } from './receipt/receipt.component';
import {Calendar, CalendarModule} from "primeng/calendar";
import {TableModule} from "primeng/table";


@NgModule({
  declarations: [
    AllfeesComponent,
    AddfeesComponent,
    EditfeesComponent,
    PaymentConfirmationDialogComponent,
    ReceiptComponent
  ],
  imports: [
    CommonModule,
    FeesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
    TableModule,
    CalendarModule,
  ]
})
export class FeesModule { }
