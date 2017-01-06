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
var ConfigurationService = (function () {
    function ConfigurationService(http) {
        this.http = http;
        this.baseUrl = 'http://localhost:4000/configuration';
    }
    ConfigurationService.prototype.extractData = function (res) {
        var body = res.json();
        return body;
    };
    ConfigurationService.prototype.handleError = function (error) {
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
    ConfigurationService.prototype.getTypes = function () {
        return this.http.get(this.baseUrl + '/types')
            .map(this.extractData)
            .catch(this.handleError);
    };
    ConfigurationService.prototype.getConfigurations = function (type) {
        return this.http.get(this.baseUrl + 'types/' + type)
            .map(this.extractData)
            .catch(this.handleError);
    };
    ConfigurationService = __decorate([
        core_1.Injectable()
    ], ConfigurationService);
    return ConfigurationService;
}());
exports.ConfigurationService = ConfigurationService;
