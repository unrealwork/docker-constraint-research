/* tslint:disable:no-unused-variable */
"use strict";
var testing_1 = require('@angular/core/testing');
var testing_2 = require('@angular/router/testing');
var http_1 = require('@angular/http');
var core_1 = require('@angular/core');
var app_component_1 = require('./app.component');
var store_1 = require('@ngrx/store');
var shared_module_1 = require('./shared/shared.module');
var component;
var fixture;
describe('App: Tmp', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            imports: [http_1.HttpModule, testing_2.RouterTestingModule, store_1.StoreModule.provideStore({}), shared_module_1.SharedModule],
            declarations: [app_component_1.AppComponent],
            providers: [],
            schemas: [core_1.NO_ERRORS_SCHEMA]
        }).compileComponents();
        fixture = testing_1.TestBed.createComponent(app_component_1.AppComponent);
        component = fixture.debugElement.componentInstance;
    });
    it('should create the app', function () {
        expect(component).toBeTruthy();
    });
});
