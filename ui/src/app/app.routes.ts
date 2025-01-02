import { Routes } from '@angular/router';
import { LandingPageComponent } from '../pages/landing-page/landing-page.component';
import { ContactPageComponent } from '../pages/contact-page/contact-page.component';
import { PageNotFoundPageComponent } from '../pages/page-not-found-page/page-not-found-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent }, // Default route
    { path: 'contact', component: ContactPageComponent },
    { path: '**', component: PageNotFoundPageComponent }
];
