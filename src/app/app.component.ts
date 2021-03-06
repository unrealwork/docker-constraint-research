import {Component, OnInit} from '@angular/core';
import {Configuration} from './models/configuration.interface';
import {ConfigurationService} from './services/configuration.service';
import {WidgetService} from './services/widget.service';
import {Period} from './models/period.interface';
import {WidgetType} from './models/widgettype.enum';
import {StatisticService} from './services/statistic.service';
import {StatisticType} from './models/statistictype.enum';
import {Metric} from './models/metric.enum';
import {RateService} from './services/rate.serivice';
import {Rate} from './models/rate.interface';

declare function updateWidget(widget: any, element: any): void;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  providers: [
    ConfigurationService,
    StatisticService,
    WidgetService,
    RateService
  ]
})
export class AppComponent implements OnInit {
  public configurations: Configuration[] = null;
  public currentType: string = null;
  public types: string [] = null;
  public configuration: any = null;
  public responseTableData: {headers: Array<string>; values: Array<string[]>} = {
    headers: [],
    values: []
  };
  public cpuUsageTableData: {headers: Array<string>; values: Array<string[]>} = {
    headers: [],
    values: []
  };
  public statistic: any = {
    responseTime: [],
    cpuUsage: []
  };


  constructor(private confServise: ConfigurationService,
              private widgetService: WidgetService,
              private statisticService: StatisticService,
              private rateService: RateService) {
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
    this.drawWidgets();
    this.loadStatistic();
  }

  private loadStatistic() {
    let tableData: {headers: Array<string>; values: Array<string[]>} = {
      headers: [],
      values: []
    };

    tableData.headers.push('Statistic type');
    this.cpuUsageTableData.headers.push('Process');
    this.responseTableData = this.loadResponseOverallTable();
    this.cpuUsageTableData = this.loadCpuUsageOverallTable();
  }

  private loadResponseOverallTable(): {headers: Array<string>; values: Array<string[]>} {
    let tableData: {headers: Array<string>; values: Array<string[]>} = {
      headers: [],
      values: []
    };
    tableData.headers.push('Statistic Type');
    for (let conf of this.configurations) {
      tableData.headers.push(conf.options);
      this.statisticService.getStatistic(Metric.RESPONSE_TIME, conf.period, StatisticType.ALL).subscribe(
        data => {
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
    return tableData;
  }

  private loadCpuUsageOverallTable(): {headers: Array<string>; values: Array<string[]>} {
    let tableData: {headers: Array<string>; values: Array<string[]>} = {
      headers: [],
      values: []
    };
    tableData.headers.push('Process');
    for (let conf of this.configurations) {
      tableData.headers.push(conf.options);
      this.rateService.getHostRate('cpu-usage', conf.period).subscribe(
        data => {
          this.ratesToTable(tableData, data);
        },
        err => {
          console.log(err);
        }
      );
      this.rateService.getPriorityRate('cpu-usage', conf.period).subscribe(
        data => {
          this.ratesToTable(tableData, data);
        },
        err => {
          console.log(err);
        }
      );
    }
    return tableData;
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

  private ratesToTable(tableData: {headers: Array<string>; values: Array<string[]>}, data: Rate[]) {
    for (let stat of data) {
      let row = this.getRowFromTableData(stat.process, tableData);
      if (row == null) {
        row = [stat.process];
        tableData.values.push(row);
      }
      row.push(stat.value.toString());
    }
  }

  private drawWidgets() {
    let period: Period = this.configuration.period;
    this.widgetService.getWidget(WidgetType.RESPONSE_TIME, period).subscribe(
      config => {
        console.log(config);
        updateWidget(config, 0);
      },
      err => {
        console.log(err);
      }
    );
  }
}
