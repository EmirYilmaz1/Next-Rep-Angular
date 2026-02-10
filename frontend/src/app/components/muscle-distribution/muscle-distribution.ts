import { Component, ElementRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-muscle-distribution',
  standalone: true,
  imports: [HttpClientModule],
  templateUrl: './muscle-distribution.html',
})
export class MuscleDistributionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('myChart', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;

  private chart?: Chart;
  private readonly url = 'http://localhost:3000/api/analytics/muscle-distribution';

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.http.get<any>(this.url, { withCredentials: true }).subscribe({
      next: (res) => {
        const { labels, values } = this.normalizeResponse(res);
        if (!labels.length) {
          console.error('No data returned from API:', res);
          return;
        }
        this.renderPie(labels, values);
      },
      error: (err) => {
        console.error('API ERROR:', err);
      }
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private normalizeResponse(res: any): { labels: string[]; values: number[] } {
    const raw = res?.data ?? res?.rows ?? res;

    if (raw && !Array.isArray(raw) && typeof raw === 'object') {
      const labels = Object.keys(raw);
      const values = labels.map(k => Number(raw[k]) || 0);
      return { labels, values };
    }

    if (Array.isArray(raw)) {
      const labels: string[] = [];
      const values: number[] = [];

      for (const item of raw) {
        const label = item.muscle ?? item.muscle_group_name ?? item.name ?? item.label;
        const val = item.count ?? item.value ?? item.total ?? item.y;

        if (label != null) {
          labels.push(String(label));
          values.push(Number(val) || 0);
        }
      }
      return { labels, values };
    }

    return { labels: [], values: [] };
  }

  private renderPie(labels: string[], values: number[]): void {
    this.chart?.destroy();

    this.chart = new Chart(this.canvas.nativeElement, {
      type: 'pie',
      data: {
        labels,
        datasets: [
          {
            label: 'Muscle Distribution',
            data: values,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'right' },
        },
      },
    });
  }
}
