import { Routes } from '@angular/router';
import { PublicLayout } from './layouts/public-layout/public-layout';
import { PrivateLayout } from './layouts/private-layout/private-layout';
import { authGuard } from './core/guards/auth-guard';
import { noAuthGuard } from './core/guards/no-auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: PublicLayout,
    children: [
      { path: '', loadComponent: () => import('./pages/public/home/home').then(m => m.Home) },
      { path: 'login', canActivate: [noAuthGuard], loadComponent: () => import('./pages/public/login/login').then(m => m.Login) },
      { path: 'cadastro', canActivate: [noAuthGuard],  loadComponent: () => import('./pages/public/register/register').then(m => m.Register) },
      { path: 'esqueci-senha', canActivate: [noAuthGuard], loadComponent: () => import('./pages/public/forgot-password/forgot-password').then(m => m.ForgotPassword)},
    ]
  },
  {
    path: 'app',
    component: PrivateLayout,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', loadComponent: () => import ('./pages/private/dashboard/dashboard').then(m => m.Dashboard )},
      { path: 'simulacoes', loadComponent: () => import('./pages/private/simulations/simulations').then(m => m.Simulations) },
      {path: 'simulacoes/nova', loadComponent: () => import('./pages/private/simulations/new-simulation/new-simulation').then(m => m.NewSimulation)},
      {path: 'simulacoes/:id', loadComponent: () => import('./pages/private/simulations/simulation-details/simulation-details').then(m => m.SimulationDetails)},
      { path: 'recomendacoes', loadComponent: () => import('./pages/private/recommendations/recommendations').then(m => m.Recommendations) },
      { path: 'perfil', loadComponent: () => import('./pages/private/investor-profile/investor-profile').then(m => m.InvestorProfile) },
      { path: 'educacao', loadComponent: () => import('./pages/private/financial-education/financial-education').then(m => m.FinancialEducation) },
      { path: 'configuracoes', loadComponent: () => import('./pages/private/settings/settings').then(m => m.Settings) },
      { path: 'comparar-cenarios', loadComponent: () => import('./pages/private/compare-scenarios/compare-scenarios').then(m => m.CompareScenarios) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  {
    path: 'questionario',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/public/profile-quiz/profile-quiz').then(m => m.ProfileQuiz)
  },
{
  path: '**',
  redirectTo: ''

}
];

