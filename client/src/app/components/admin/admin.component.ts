import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {SelectionModel} from "@angular/cdk/collections";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, OnDestroy {
  users$;
  subscription: Subscription;
  toDelete = [];
  displayedColumns: string[] = ['select', 'email', 'firstName', 'lastName'];
  dataSource = new MatTableDataSource();
  selection = new SelectionModel(true, []);
  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.subscription = this.authService.getUsers()
      .subscribe(res => {
        this.users$ = res;
        this.dataSource = this.users$;
      }, err => {
        console.log(err);
      });
  }
//  Whether the number of selected rows matches the total number of elements
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.users$.length;
    return numSelected === numRows;
  }

  removeSelectedRows(): void {
    this.selection.selected.forEach(row => {
      let index: number = this.users$.findIndex(r => row === r);
      this.toDelete.push(this.users$[index]);
      this.users$.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.users$)
    });
    this.authService.deleteUsers(this.toDelete);
    this.selection = new SelectionModel(true, []);
  }

  masterToggle() {
    this.isAllSelected() ? this.selection.clear() : this.users$.forEach(row => this.selection.select(row));
  }

  ngOnDestroy(): void {
    console.log('unsubscribing when the component is destroyed');
    this.subscription.unsubscribe();
  }
}
