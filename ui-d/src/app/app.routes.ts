import { Routes } from '@angular/router';

// PUBLIC Routes accessible by all
import { LandingPageComponent } from '../pages/public/landing-page/landing-page.component';
import { ContactPageComponent } from '../pages/public/contact-page/contact-page.component';
import { PageNotFoundPageComponent } from '../pages/public/page-not-found-page/page-not-found-page.component';
import { TermsOfUsePageComponent } from '../pages/public/terms-of-use-page/terms-of-use-page.component';
import { PrivacyPolicyPageComponent } from '../pages/public/privacy-policy-page/privacy-policy-page.component';
import { CookiePolicyPageComponent } from '../pages/public/cookie-policy-page/cookie-policy-page.component';

// AUTH Routes for login/register/callback
import { SignInPageComponent } from '../pages/auth/sign-in-page/sign-in-page.component';
import { RegisterPageComponent } from '../pages/auth/register-page/register-page.component';
import { ResetPasswordPageComponent } from '../pages/auth/reset-password-page/reset-password-page.component';
import { OauthCallbackComponent } from '../pages/auth/oauth-callback/oauth-callback.component';
import { FailedLoginPageComponent } from '../pages/auth/failed-login-page/failed-login-page.component';
import { RequestPassswordResetPageComponent } from '../pages/auth/request-password-reset-page/request-password-reset-page.component';
import { ExistingUserPageComponent } from '../pages/auth/existing-user-page/existing-user-page.component';

// GUARDED Routes accessible by logged in users only
import { TodoPageComponent } from '../pages/guarded/todo-page/todo-page.component';
import { HomePageComponent } from '../pages/guarded/home-page/home-page.component';

export const routes: Routes = [
    // PUBLIC Routes accessible by all
    { path: '', component: LandingPageComponent }, // Default route
    { path: 'contact', component: ContactPageComponent },
    { path: 'terms-of-use', component: TermsOfUsePageComponent },
    { path: 'privacy-policy', component: PrivacyPolicyPageComponent },
    { path: 'cookie-policy', component: CookiePolicyPageComponent },
    // AUTH Routes for login/register/callback
    { path: 'sign-in', component: SignInPageComponent },
    { path: 'register-account', component: RegisterPageComponent },
    { path: 'request-password-reset', component: RequestPassswordResetPageComponent },
    { path: 'reset-password', component: ResetPasswordPageComponent },
    { path: 'oauth/callback', component: OauthCallbackComponent },
    { path: 'auth/existing-user', component: ExistingUserPageComponent },
    { path: 'auth/failed-login', component: FailedLoginPageComponent },
    // GUARDED Routes accessible by logged in users only
    { path: 'home', component: HomePageComponent },
    { path: 'todo', component: TodoPageComponent },

    // Page not found
    { path: '**', component: PageNotFoundPageComponent },
];