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
  public tableData: {headers: Array<string>; values: Array<string[]>} = {
    headers: [],
    values: []
  };
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
    let tableData: {headers: Array<string>; values: Array<string[]>} = {
      headers: [],
      values: []
    };

    tableData.headers.push('Statistic type');
    for (let conf of this.configurations) {
      tableData.headers.push(conf.options);
      this.statisticService.getStatistic(Metric.RESPONSE_TIME, conf.period, StatisticType.ALL).subscribe(
        data => {
          console.log(data);
          if (tableData.values.length === 0) {
            for (let stat of data) {
              let row: string[] = [];
              row.push(stat.statistic);
              tableData.values.push(row);
            }
          }
          for (let stat of data) {
            let row = this.getRowFromTableData(stat.statistic, tableData);
            row.push(stat.value.toString());
          }
        },
        err => {
          console.log(err);
        }
      );
    }
    this.tableData = tableData;
  }

  private getRowFromTableData(type: string, tableData: {headers: Array<string>; values: Array<string[]>}) {
    for (let row of tableData.values) {
      let rowType = row[0];
      if (rowType === type) {
        return row;
      }
    }
    return null;
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
