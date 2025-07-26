import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { FeesRoutingModule } from './fees-routing.module';
import { AllfeesComponent } from './allfees/allfees.component';
import { AddfeesComponent } from './addfees/addfees.component';
import { EditfeesComponent } from './editfees/editfees.component';
import {ComponentsModule} from "@shared/components/components.module";
import {SharedModule} from "@shared";
import { PaymentConfirmationDialogComponent } from './payment-confirmation-dialog/payment-confirmation-dialog.component';
import { ReceiptComponent } from './receipt/receipt.component';
import {Calendar, CalendarModule} from "primeng/calendar";
import {TableModule} from "primeng/table";
import { MaterialModule } from '../shared/material.module';
import { PaymentChargeListComponent } from './payment-charge-list/payment-charge-list.component';
import { GenerateChargesDialogComponent } from './payment-charge-list/generate-charges-dialog/generate-charges-dialog.component';
import {CollectFeesDialogComponent} from "./payment-charge-list/collect-fees-dialog/collect-fees-dialog.component";

@NgModule({
  declarations: [
    AllfeesComponent,
    AddfeesComponent,
    EditfeesComponent,
    PaymentConfirmationDialogComponent,
    ReceiptComponent,
    PaymentChargeListComponent,
    GenerateChargesDialogComponent,
    CollectFeesDialogComponent
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
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatTooltipModule,
    MatDialogModule,
    MatListModule,
    MaterialModule,
    RouterModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule
  ],
  exports: [
    PaymentChargeListComponent
  ]
})
export class FeesModule { }
