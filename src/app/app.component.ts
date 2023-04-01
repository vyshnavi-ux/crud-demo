import { Component,Inject, OnInit ,ViewChild,AfterViewInit} from '@angular/core';
import {MatDialog,MatDialogRef} from '@angular/material/dialog';
import { ApiService } from './api.service';
import { DialogComponent } from './dialog/dialog.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'demo';
  displayedColumns: string[] = ['productName', 'category', 'date', 'freshness','price','comments','action'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog:MatDialog,private api:ApiService){}
  ngOnInit(): void {
    this.getAllProducts();
  }
  openDialog() {
    this.dialog.open(DialogComponent, {
     
    }).afterClosed().subscribe(
      val=>{
        if(val === 'save'){
          this.getAllProducts();
        }
      }
    );
  }
  getAllProducts(){
    this.api.getProduct().subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:(err)=>{
        alert("error while fetching the records");
      }
    });
  }
  editProduct(row:any){
    this.dialog.open(DialogComponent,{
      data:row
    }).afterClosed().subscribe(val=>{
      if(val === 'update'){
        this.getAllProducts();
      }
    });
  }
  deleteProduct(id:number){
    this.api.deleteProduct(id).subscribe({
      next:(res)=>{
        alert("Product Deleted successfully");
        this.getAllProducts();
      },
      error:()=>{
        alert("error while Deleting product");
      }
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
