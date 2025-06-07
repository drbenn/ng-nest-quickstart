import { Routes } from '@angular/router';

// PUBLIC Routes accessible by all
import { LandingPageComponent } from './pages/public/landing-page/landing-page.component';
import { AboutUsComponent } from './pages/public/about-us/about-us.component';
import { PageNotFoundPageComponent } from './pages/public/page-not-found-page/page-not-found-page.component';
import { ContactPageComponent } from './pages/public/contact-page/contact-page.component';
import { TermsOfUsePageComponent } from './pages/public/terms-of-use-page/terms-of-use-page.component';
import { PrivacyPolicyPageComponent } from './pages/public/privacy-policy-page/privacy-policy-page.component';
import { CookiePolicyPageComponent } from './pages/public/cookie-policy-page/cookie-policy-page.component';
import { ChatPageComponent } from './pages/guarded/chat-page/chat-page.component';
import { ShoppingCartPageComponent } from './pages/public/shopping-cart-page/shopping-cart-page.component';

// AUTH Routes for login/register/callback
import { LogInPageComponent } from './pages/auth/log-in-page/log-in-page.component';
import { RegisterPageComponent } from './pages/auth/register-page/register-page.component';
import { RegistrationSuccessPendingComponent } from './pages/auth/registration-success-pending/registration-success-pending.component';
import { ConfirmEmailComponent } from './pages/auth/confirm-email/confirm-email.component';
import { RequestPassswordResetPageComponent } from './pages/auth/request-password-reset-page/request-password-reset-page.component';
import { ResetPasswordPageComponent } from './pages/auth/reset-password-page/reset-password-page.component';
import { OauthCallbackComponent } from './pages/auth/oauth-callback/oauth-callback.component';
import { ExistingUserPageComponent } from './pages/auth/existing-user-page/existing-user-page.component';
import { FailedLoginPageComponent } from './pages/auth/failed-login-page/failed-login-page.component';

// GUARDED Routes accessible by logged in users only
import { HomePageComponent } from './pages/guarded/home-page/home-page.component';
import { TodoPageComponent } from './pages/guarded/todo-page/todo-page.component';

// Guards
import { authGuard } from './guards/auth.guard';

// Resolvers

export const routes: Routes = [
  // PUBLIC Routes accessible by all
  { path: '', component: LandingPageComponent },         // Default route
  {
    path: 'about-us',
    loadComponent: () => import('./pages/public/about-us/about-us.component').then(m => m.AboutUsComponent)
  },
  {
    path: 'contact',
    loadComponent: () => import('./pages/public/contact-page/contact-page.component').then(m => m.ContactPageComponent)
  },
  {
    path: 'terms-of-use',
    loadComponent: () => import('./pages/public/terms-of-use-page/terms-of-use-page.component').then(m => m.TermsOfUsePageComponent)
  },
  {
    path: 'privacy-policy',
    loadComponent: () => import('./pages/public/privacy-policy-page/privacy-policy-page.component').then(m => m.PrivacyPolicyPageComponent)
  },
  {
    path: 'cookie-policy',
    loadComponent: () => import('./pages/public/cookie-policy-page/cookie-policy-page.component').then(m => m.CookiePolicyPageComponent)
  },
  {
    path: 'store',
    loadComponent: () => import('./pages/public/store-page/store-page.component').then(m => m.StorePageComponent)
  },
  {
    path: 'shopping-cart',
    loadComponent: () => import('./pages/public/shopping-cart-page/shopping-cart-page.component').then(m => m.ShoppingCartPageComponent)
  },

  // AUTH Routes for login/register/callback
  {
    path: 'log-in',
    component: LogInPageComponent
  },
  {
    path: 'register-account',
    component: RegisterPageComponent
  },
  {
    path: 'confirm-email',
    loadComponent: () => import('./pages/auth/confirm-email/confirm-email.component').then(m => m.ConfirmEmailComponent)
  },
  {
    path: 'request-password-reset',
    loadComponent: () => import('./pages/auth/request-password-reset-page/request-password-reset-page.component').then(m => m.RequestPassswordResetPageComponent)
  },
  {
    path: 'reset-password',
    loadComponent: () => import('./pages/auth/reset-password-page/reset-password-page.component').then(m => m.ResetPasswordPageComponent)
  },
  {
    path: 'oauth/callback',
    loadComponent: () => import('./pages/auth/oauth-callback/oauth-callback.component').then(m => m.OauthCallbackComponent)
  },
  {
    path: 'auth/registration-success-pending',
    loadComponent: () => import('./pages/auth/registration-success-pending/registration-success-pending.component').then(m => m.RegistrationSuccessPendingComponent)
  },
  {
    path: 'auth/existing-user',
    loadComponent: () => import('./pages/auth/existing-user-page/existing-user-page.component').then(m => m.ExistingUserPageComponent)
  },
  {
    path: 'auth/failed-login',
    loadComponent: () => import('./pages/auth/failed-login-page/failed-login-page.component').then(m => m.FailedLoginPageComponent)
  },

  

  // GUARDED Routes accessible by logged in users only
  { 
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/guarded/home-page/home-page.component').then(m => m.HomePageComponent)
  },
  {
    path: 'todo',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/guarded/todo-page/todo-page.component').then(m => m.TodoPageComponent)
  },
  {
    path: 'chat',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/guarded/chat-page/chat-page.component').then(m => m.ChatPageComponent)
  },
  {
    path: 'account-settings',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/auth/user-settings/user-settings.component').then(m => m.UserSettingsComponent)
  },

  // Page not found catch all
  {
    path: '**',
    loadComponent: () => import('./pages/public/page-not-found-page/page-not-found-page.component').then(m => m.PageNotFoundPageComponent)
  }
];