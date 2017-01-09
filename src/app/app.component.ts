import {Component, OnInit} from '@angular/core';
import {Configuration} from './models/configuration.interface';
import {ConfigurationService} from './services/configuration.service';
import {WidgetService} from './services/widget.service';
import {Period} from './models/period.interface';
import {WidgetType} from  './models/widgettype.enum';
import {StatisticService} from './services/statistic.service';
import {StatisticType} from './models/statistictype.enum';
import {Metric} from './models/metric.enum';


declare function updateWidget(widget: any, element: any): void;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [
    ConfigurationService,
    StatisticService,
    WidgetService
  ]
})
export class AppComponent implements OnInit {
  public configurations: Configuration[] = null;
  public currentType: string = null;
  public types: string [] = null;
  public configuration: any = null;
  public statistic: any = {
    responseTime: [],
    cpuUsage: []
  };


  constructor(private confServise: ConfigurationService,
              private widgetService: WidgetService,
              private statisticService: StatisticService) {
  }


  ngOnInit(): void {
    this.confServise.getTypes().subscribe(
      types => {
        this.types = types;
        this.currentType = types[0];
        this.loadConfigurations();
      }
    );
  }

  private loadConfigurations() {
    this.confServise.getConfigurations(this.currentType).subscribe(
      configurations => {
        console.log(configurations);
        this.configurations = configurations;
        this.configuration = configurations[0];
        this.loadStatistic();
      },
      err => {
        console.log(err);
      }
    );
  }

  onConfigurationChange() {
    // this.drawWidgets();
    this.loadStatistic();
  }

  private loadStatistic() {
    let period: Period = this.configuration.period;
    this.statisticService.getStatistic(Metric.RESPONSE_TIME, period, StatisticType.ALL).subscribe(
      data => {
        console.log(data);
        this.statistic = {
          responseTime: data
        };
      },
      err => {
        console.log(err);
      }
    );
  }

  private drawWidgets() {
    let period: Period = this.configuration.period;
    this.widgetService.getWidget(WidgetType.RESPONSE_TIME, period).subscribe(
      config => {
        updateWidget(config, 0);
      },
      err => {
        console.log(err);
      }
    );
  }
}
