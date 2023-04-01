import { Component,Inject,OnInit } from '@angular/core';
import { FormGroup, FormControl,FormBuilder,Validators  } from '@angular/forms';
import { ApiService } from '../api.service';
import { MatDialogRef,MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  freshnessList = ['Brand New','Second Hand','Refurbished'];
  actionBtn:string = 'Save';
  productForm!: FormGroup;
  constructor(private formBuilder:FormBuilder,
    private api:ApiService,
    @Inject(MAT_DIALOG_DATA) public editData: {
      id: number;
      comments: any;
      price: any;
      freshness: any;
      date: any;
      category: any;
      productName: any;name: string
},
    private dialogRef:MatDialogRef<DialogComponent>){}
  ngOnInit() {
    this.productForm = this.formBuilder.group({
      productName:['',Validators.required],
      category:['',Validators.required],
      freshness:['',Validators.required],
      price:['',Validators.required],
      comments:['',Validators.required],
      date:['',Validators.required]
    });
    if(this.editData){
      this.actionBtn = "Update";
      this.productForm.controls['productName'].setValue(this.editData.productName);
      this.productForm.controls['category'].setValue(this.editData.category);
      this.productForm.controls['date'].setValue(this.editData.date);
      this.productForm.controls['freshness'].setValue(this.editData.freshness);
      this.productForm.controls['price'].setValue(this.editData.price);
      this.productForm.controls['comments'].setValue(this.editData.comments);
    }
    
  }
  addProduct(){
    if(!this.editData){
      if(this.productForm.valid){
        this.api.postProduct(this.productForm.value)
        .subscribe({
          next:(res)=>{
            alert("Product added successfully");
            this.productForm.reset();
            this.dialogRef.close('save');
          },
          error:()=>{
            alert("error while adding the product");
          }
        })
      }
    }else{
      this.updateProduct();
    }
    
  }
  updateProduct(){
    this.api.putProduct(this.productForm.value,this.editData.id).subscribe({
      next:(res)=>{
        alert("Product updated successfully");
        this.productForm.reset();
        this.dialogRef.close('update');
      },
      error:()=>{
        alert("error while updating the record");
      }
    });
  }
}
