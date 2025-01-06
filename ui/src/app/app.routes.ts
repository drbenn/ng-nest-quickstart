import { Routes } from '@angular/router';
import { LandingPageComponent } from '../pages/landing-page/landing-page.component';
import { ContactPageComponent } from '../pages/contact-page/contact-page.component';
import { PageNotFoundPageComponent } from '../pages/page-not-found-page/page-not-found-page.component';
import { TermsOfUsePageComponent } from '../pages/terms-of-use-page/terms-of-use-page.component';
import { PrivacyPolicyPageComponent } from '../pages/privacy-policy-page/privacy-policy-page.component';
import { CookiePolicyPageComponent } from '../pages/cookie-policy-page/cookie-policy-page.component';
import { SigninPageComponent } from '../pages/signin-page/signin-page.component';
import { HomePageComponent } from '../pages/home-page/home-page.component';
import { RegisterPageComponent } from '../pages/register-page/register-page.component';
import { TodoPageComponent } from '../pages/todo-page/todo-page.component';

export const routes: Routes = [
    // Routes accessible by all
    { path: '', component: LandingPageComponent }, // Default route
    { path: 'sign-in', component: SigninPageComponent },
    { path: 'register', component: RegisterPageComponent },
    { path: 'contact', component: ContactPageComponent },
    { path: 'terms-of-use', component: TermsOfUsePageComponent },
    { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
    { path: 'cookie-policy', component: CookiePolicyPageComponent },
    // Routes accessible by logged in users only
    { path: 'home', component: HomePageComponent },
    { path: 'todo', component: TodoPageComponent },
    { path: '**', component: PageNotFoundPageComponent }
];
