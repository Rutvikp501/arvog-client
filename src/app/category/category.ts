import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from './category.service';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './category.html',
  styleUrls: ['./category.css']
})
export class CategoryComponent implements OnInit {

  categories: any[] = [];
  filteredCategories: any[] = [];
  searchText = '';

  page = 1;
  totalPages = 1;

  showPopup = false;
  editMode = false;
  categoryName = '';
  editId: number | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories(page: number = 1) {
    this.categoryService.getAll(page).subscribe((res: any) => {
      this.categories = res.data;
      this.filteredCategories = [...this.categories];  // copy original list
      this.page = res.pagination.page;
      this.totalPages = res.pagination.pages;
    });
  }

  // 🔍 Frontend Search Filter
  search() {
    const term = this.searchText.toLowerCase();
    this.filteredCategories = this.categories.filter(c =>
      c.name.toLowerCase().includes(term)
    );
  }

  openAddPopup() {
    this.editMode = false;
    this.categoryName = '';
    this.showPopup = true;
  }

  openEditPopup(cat: any) {
    this.editMode = true;
    this.editId = cat.id;
    this.categoryName = cat.name;
    this.showPopup = true;
  }

  saveCategory() {
    if (!this.categoryName.trim()) return;

    if (this.editMode) {
      this.categoryService.update(this.editId!, { name: this.categoryName })
        .subscribe(() => this.refresh());
    } else {
      this.categoryService.create({ name: this.categoryName })
        .subscribe(() => this.refresh());
    }
  }

  deleteCategory(id: number) {
    if (confirm("Are you sure you want to delete this category?")) {
      this.categoryService.delete(id)
        .subscribe(() => this.refresh());
    }
  }

  refresh() {
    this.closePopup();
    this.loadCategories(this.page);
  }

  closePopup() {
    this.showPopup = false;
  }

  nextPage() {
    if (this.page < this.totalPages) this.loadCategories(this.page + 1);
  }

  prevPage() {
    if (this.page > 1) this.loadCategories(this.page - 1);
  }
}
