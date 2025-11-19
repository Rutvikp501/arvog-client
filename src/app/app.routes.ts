import { Routes } from '@angular/router';
import { Login } from './login/login';
import { DashboardComponent } from './dashboard/dashboard';
import { CategoryComponent } from './category/category';
import { ProductComponent } from './product/product';
import { AuthGuard } from './auth/auth.guard';

export const routes: Routes = [
    { path: 'login', component: Login },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [AuthGuard],
        children: [
            { path: 'category', component: CategoryComponent },
            { path: 'product', component: ProductComponent },
        ]
    },
    { path: '', redirectTo: 'login', pathMatch: 'full' }
];
