import { Route } from '@angular/router';
import { HomePage } from './pages/home/home';
import { ExercisesPage } from './pages/exercises/exercises';
import { WorkoutsPage } from './pages/workouts-page/workouts-page';
import { EquipmentsPage } from './pages/equipments-page/equipments-page';
import { Profile } from './pages/profile/profile';
import { Members } from './pages/members/members';
import { HistoryOfExercises } from './pages/history-of-exercises/history-of-exercises';

export interface AppRoute extends Route {
  icon?: string;
  roles?: number[];
}

export const routes: AppRoute[] = [
  { path: '', redirectTo: 'home', pathMatch: 'full' , roles:[0,1,2,3]},
  { path: 'home',  component: HomePage, title: 'Analytics' , roles:[0,1,2,3]},
  {path: 'history', component:HistoryOfExercises, title: 'History' , roles:[0,1,2,3]},
  {path: 'exercices', component:ExercisesPage, title: 'Exercises' , roles:[0,1,2,3]},
  { path: 'workouts', component:WorkoutsPage, title: 'Workouts' , roles: [0,1,2,3]},
  { path: 'equipments', component:EquipmentsPage, title: 'Equipments' , roles: [1]},
  {path: 'profile', component:Profile, title: 'My Profile - (Form)' , roles: [0,1,2,3]},
  {path: 'members', component: Members, title:'Members', roles:[0]},

   { path: '**', redirectTo: 'home' }
];

