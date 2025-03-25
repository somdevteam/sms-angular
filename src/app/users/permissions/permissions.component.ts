import { Component, OnInit } from '@angular/core';
import { TreeNode } from 'primeng/api';
import { UserService } from '../user.service';

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss']
})
export class PermissionsComponent implements OnInit {
  files!: TreeNode[];

  selectedFiles!: TreeNode[];
  

  constructor(private userService: UserService  ) {}

  ngOnInit(): void {
    this.getMenusWithPermissions();
  }

  getMenusWithPermissions() {
    this.userService.getMenusWithPermissions().subscribe({
      next: (res) => {
        
        this.files = this.transformMenus(res.data);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  onNodeSelect(event: any) {
    console.log(event);
  }

  transformMenus(menus: any): TreeNode[] {
    return menus.map((menu: any) => ({
      id: menu.MENUID || menu.tabId || menu.permissionId,
      key: menu.MENUNAME.replace(/\s/g, '').toLowerCase(),
      label: menu.MENUNAME.replace(/\d+$/, '').trim(),
      children: menu.tabs.map((tab: any) => ({
        id: tab.tabId,
        key: tab.tabName.replace(/\s/g, '').toLowerCase(),
        label: tab.tabName.replace(/\d+$/, '').trim(),
        children: tab.tabPermission.map((tp: any) => ({
          id: tp.permission.permissionId,
          key: tp.permission.permission.replace(/\s/g, '').toLowerCase(),
          label: tp.permission.description.replace(/\d+$/, '').trim(),
        }))
      }))
    }));
  }
}

