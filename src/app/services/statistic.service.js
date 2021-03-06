"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Rx_1 = require('rxjs/Rx');
require('rxjs/add/operator/map');
require('rxjs/add/operator/catch');
var StatisticService = (function () {
    function StatisticService(http) {
        this.http = http;
        this.baseUrl = 'http://localhost:4000/statistic';
    }
    StatisticService.prototype.getStatistic = function (metric, period, type) {
        return this.http.post(this.baseUrl + '/' + metric + '/' + type, period)
            .map(this.extractData)
            .catch(this.handleError);
    };
    StatisticService.prototype.extractData = function (res) {
        var body = res.json();
        return body;
    };
    StatisticService.prototype.handleError = function (error) {
        // In a real world app, we might use a remote logging infrastructure
        var errMsg;
        if (error instanceof http_1.Response) {
            var body = error.json() || '';
            var err = body.error || JSON.stringify(body);
            errMsg = error.status + " - " + (error.statusText || '') + " " + err;
        }
        else {
            errMsg = error.message ? error.message : error.toString();
        }
        console.error(errMsg);
        return Rx_1.Observable.throw(errMsg);
    };
    StatisticService = __decorate([
        core_1.Injectable()
    ], StatisticService);
    return StatisticService;
}());
exports.StatisticService = StatisticService;
