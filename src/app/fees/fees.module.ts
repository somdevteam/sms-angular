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

import { FeesRoutingModule } from './fees-routing.module';
import { AllfeesComponent } from './allfees/allfees.component';
import { AddfeesComponent } from './addfees/addfees.component';
import { EditfeesComponent } from './editfees/editfees.component';
import {UsersRoutingModule} from "../users/users-routing.module";
import {ComponentsModule} from "@shared/components/components.module";
import {SharedModule} from "@shared";
import { PaymentConfirmationDialogComponent } from './payment-confirmation-dialog/payment-confirmation-dialog.component';
import { ReceiptComponent } from './receipt/receipt.component';
import {Calendar, CalendarModule} from "primeng/calendar";
import {TableModule} from "primeng/table";
import { StudentSelectionDialogComponent } from './student-selection-dialog/student-selection-dialog.component';
import { MaterialModule } from '../shared/material.module';


@NgModule({
  declarations: [
    AllfeesComponent,
    AddfeesComponent,
    EditfeesComponent,
    PaymentConfirmationDialogComponent,
    ReceiptComponent,
    StudentSelectionDialogComponent
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
    MaterialModule
  ]
})
export class FeesModule { }
