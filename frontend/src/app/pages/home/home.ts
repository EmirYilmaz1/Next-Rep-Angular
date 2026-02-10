import { Component, ViewChild, HostListener } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

import 'chart.js/auto';

import { AuthService } from '../../services/auth';
import { TeamsService } from '../../services/teams';
import { User } from '../../models/user';
import { CommonModule } from '@angular/common';
import { ExerciseListsComponent } from '../../components/exercise-lists/exercise-lists';
import { MuscleDistributionComponent } from '../../components/muscle-distribution/muscle-distribution';



@Component({
  selector: 'home-page',
  imports: [CommonModule, BaseChartDirective, ExerciseListsComponent, MuscleDistributionComponent],
  templateUrl: './home.html',
  styleUrls: ['./home.scss'],
  standalone: true
})
export class HomePage {

  user: User | null = null;

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  @HostListener('window:resize')
    onResize() {
    this.chart?.chart?.resize();
  }
  
  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Number of members',
        data: [],
        backgroundColor: [],
        borderWidth: 1
      }
    ]
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        title: { display: true, text: 'Number of members' },
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    },
    plugins: {
      title: { display: true, text: 'Teams chart', font: { size: 24 }, },
      legend: { display: false }
    }
  };

  constructor(private authService: AuthService, private teamsService: TeamsService) {
    this.authService.currentUser$.subscribe(user => {
      this.user = user;    });
  }

  isInRole(roles: number[]) {
    return this.authService.isInRole(this.user, roles);
  }
}
