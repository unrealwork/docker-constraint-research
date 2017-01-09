import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {HttpModule, JsonpModule} from '@angular/http';
import {AppComponent}   from './app.component';
import {MaterialModule} from '@angular/material';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    JsonpModule,
    MaterialModule.forRoot()
  ], // import forms module
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})

export class AppModule {
}
