import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule], 
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  ProductDetails: FormGroup;
  products: any[] = []; 
  selectedProduct: any = null     
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.ProductDetails = this.fb.group({
      product_name: [''],
      product_price: ['']
    });
  }

  ngOnInit() {
    this.getProducts(); 
  }

  onSubmit() {
    const details = this.ProductDetails.value;

    if (this.selectedProduct) {
      
      this.http.put(`http://localhost:3000/products/${this.selectedProduct.product_id}`, details)
        .subscribe(response => {
          console.log('Product updated successfully:', response);
          this.getProducts(); 
          this.selectedProduct = null;
          this.ProductDetails.reset();
        });
    } else {
     
      this.http.post("http://localhost:3000/products", details)
        .subscribe(response => {
          console.log('Product added successfully:', response);
          this.getProducts();
          this.ProductDetails.reset();
        });
    }
  }

  getProducts() {
    this.http.get<any[]>("http://localhost:3000/products").subscribe(response => {
      this.products = response;
    }, error => {
      console.error('Error fetching products:', error);
    });
  }

  editProduct(product: any) {
    this.selectedProduct = product; 
    this.ProductDetails.patchValue(product);
  }
  
  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.http.delete(`http://localhost:3000/products/${id}`).subscribe(response => {
        console.log('Product deleted successfully:', response);
        this.getProducts();
      }, error => {
        console.error('Error deleting product:', error);
      });
    }
  }
  

}
