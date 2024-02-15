import { Component } from '@angular/core';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent {

  breadscrums = [
    {
      title: 'Class',
      items: ['List Class'],
      active: 'Class',
    },
  ];

}
