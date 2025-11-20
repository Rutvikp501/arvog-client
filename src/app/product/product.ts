import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService  } from './product.service';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product.html',
  styleUrls: ['./product.css']
})
export class ProductComponent implements OnInit {

  products: any[] = [];
  filteredProducts: any[] = [];
  searchText = '';
  page = 1;
  totalPages = 1;

  // popup
  showPopup = false;
  editMode = false;

  productName = '';
  productPrice: number | null = null;
  categoryId: number | null = null;
  editId: number | null = null;

  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
showBulkUpload = false;
  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

loadProducts() {
  this.productService.getAll().subscribe((res: any) => {
    this.products = res.data;              // FIXED
    this.filteredProducts = [...this.products];
    this.totalPages = 1;
  });
}


  search() {
    const term = this.searchText.toLowerCase();
    this.filteredProducts = this.products.filter(p =>
      p.name.toLowerCase().includes(term)
    );
  }

onFileSelected(event: any) {
  this.selectedFile = event.target.files[0] || null;

  if (!this.selectedFile) return;  // <--- Important null check

  const reader = new FileReader();
  reader.onload = () => (this.previewUrl = reader.result);
  reader.readAsDataURL(this.selectedFile); // Now safe
}

  openAddPopup() {
    this.editMode = false;
    this.editId = null;
    this.productName = '';
    this.productPrice = null;
    this.categoryId = null;
    this.selectedFile = null;
    this.previewUrl = null;
    this.showPopup = true;
  }

  openEditPopup(product: any) {
    this.editMode = true;
    this.editId = product.id;
    this.productName = product.name;
    this.productPrice = product.price;
    this.categoryId = product.categoryId ?? null;
    this.previewUrl = product.image?.url ?? null;
    this.selectedFile = null;

    this.showPopup = true;
  }

  saveProduct() {
    if (!this.productName.trim() || !this.productPrice || !this.categoryId) return;

    const formData = new FormData();
    formData.append("name", this.productName);
    formData.append("price", this.productPrice.toString());
    formData.append("categoryId", this.categoryId.toString());
    if (this.selectedFile) formData.append("productImage", this.selectedFile);

    if (this.editMode) {
      this.productService.update(this.editId!, formData).subscribe(() => this.refresh());
    } else {
      this.productService.create(formData).subscribe(() => this.refresh());
    }
  }

  deleteProduct(id: number) {
    if (confirm("Are you sure you want to delete this product?")) {
      this.productService.delete(id).subscribe(() => this.refresh());
    }
  }

  refresh() {
    this.closePopup();
    this.loadProducts();
  }

  closePopup() {
    this.showPopup = false;
  }
downloadReport(type: 'csv' | 'xlsx') {
  this.productService.downloadReport(type).subscribe((file: Blob) => {
    const blob = new Blob([file]);
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = type === 'csv' ? 'products.csv' : 'products.xlsx';
    a.click();

    window.URL.revokeObjectURL(url);
  });
}

selectedBulkFile: File | null = null;

onBulkFileSelect(event: any) {
  const file = event.target.files[0];
  if (!file) return;

  this.selectedBulkFile = file;
  console.log("Selected File:", file);
}

uploadBulk() {
  if (!this.selectedBulkFile) {
    alert("Please select a file first");
    return;
  }

  const formData = new FormData();
  formData.append("file", this.selectedBulkFile);

  this.productService.bulkUpload(formData).subscribe({
    next: (res) => {
      console.log(res);
      alert("Bulk upload completed!");
      this.closeBulkUpload();
    },
    error: (err) => {
      console.error(err);
      alert("Upload failed");
    }
  });
}
openBulkUpload() {
  this.showBulkUpload = true;
}
 closeBulkUpload() {
    this.showBulkUpload = false;
  }
  nextPage() {}
  prevPage() {}
}
