"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var widgettype_enum_1 = require('./models/widgettype.enum');
var statistictype_enum_1 = require('./models/statistictype.enum');
var metric_enum_1 = require('./models/metric.enum');
var AppComponent = (function () {
    function AppComponent(confServise, widgetService, statisticService) {
        this.confServise = confServise;
        this.widgetService = widgetService;
        this.statisticService = statisticService;
        this.configurations = null;
        this.currentType = null;
        this.types = null;
        this.configuration = null;
        this.statistic = {
            responseTime: [],
            cpuUsage: []
        };
    }
    AppComponent.prototype.onChange = function () {
        this.loadConfigurations();
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.confServise.getTypes().subscribe(function (types) {
            console.log(types);
            _this.types = types;
            _this.currentType = types[0];
            _this.loadConfigurations();
        });
    };
    AppComponent.prototype.loadConfigurations = function () {
        var _this = this;
        this.confServise.getConfigurations(this.currentType).subscribe(function (configurations) {
            _this.configurations = configurations;
            _this.configuration = configurations[0];
            _this.loadStatistic();
        }, function (err) {
            console.log(err);
        });
    };
    AppComponent.prototype.onConfigurationChange = function () {
        // this.drawWidgets();
        this.loadStatistic();
    };
    AppComponent.prototype.loadStatistic = function () {
        var _this = this;
        var period = this.configuration.period;
        this.statisticService.getStatistic(metric_enum_1.Metric.RESPONSE_TIME, period, statistictype_enum_1.StatisticType.AVG).subscribe(function (data) {
            console.log(data);
            _this.statistic = {
                responseTime: data
            };
        }, function (err) {
            console.log(err);
        });
    };
    AppComponent.prototype.drawWidgets = function () {
        var period = this.configuration.period;
        this.widgetService.getWidget(widgettype_enum_1.WidgetType.RESPONSE_TIME, period).subscribe(function (config) {
            console.log(config);
            updateWidget(config, 0);
        }, function (err) {
            console.log(err);
        });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app-root',
            templateUrl: 'app.component.html',
        })
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
