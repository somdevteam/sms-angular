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


@NgModule({
  declarations: [
    AllfeesComponent,
    AddfeesComponent,
    EditfeesComponent
  ],
  imports: [
    CommonModule,
    FeesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    SharedModule,
  ]
})
export class FeesModule { }
