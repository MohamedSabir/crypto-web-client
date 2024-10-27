import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { CompressionService } from './services/compression.service';
import { SocketService } from './services/socket.service';
import { MarketWatchComponent  } from './market-watch.component/market-watch.component';
import { MarketDepthComponent  } from './market-depth/market-depth.component';
import { MockDataGeneratorComponent } from './mock-data-generator/mock-data-generator.component';

@NgModule({
  declarations: [
    AppComponent,
    MarketWatchComponent  ,
    MarketDepthComponent,
    MockDataGeneratorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
