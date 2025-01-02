import { Routes } from '@angular/router';
import { LandingPageComponent } from '../pages/landing-page/landing-page.component';
import { ContactPageComponent } from '../pages/contact-page/contact-page.component';
import { PageNotFoundPageComponent } from '../pages/page-not-found-page/page-not-found-page.component';
import { TermsOfUsePageComponent } from '../pages/terms-of-use-page/terms-of-use-page.component';
import { PrivacyPolicyPageComponent } from '../pages/privacy-policy-page/privacy-policy-page.component';
import { CookiePolicyPageComponent } from '../pages/cookie-policy-page/cookie-policy-page.component';

export const routes: Routes = [
    { path: '', component: LandingPageComponent }, // Default route
    { path: 'contact', component: ContactPageComponent },
    { path: 'terms-of-use', component: TermsOfUsePageComponent },
    { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
    { path: 'cookie-policy', component: CookiePolicyPageComponent },
    { path: '**', component: PageNotFoundPageComponent }
];
