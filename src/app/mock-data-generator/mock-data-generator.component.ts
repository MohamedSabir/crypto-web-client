// components/mock-data-generator/mock-data-generator.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MockSocketService } from './../services/mock-socket.service';
import { BaseMessage } from './../models/base-message.model';

@Component({
  selector: 'app-mock-data-generator',
  templateUrl: './mock-data-generator.component.html',
  styleUrls: ['./mock-data-generator.component.css']
})
export class MockDataGeneratorComponent implements OnInit, OnDestroy {
  private subscription: Subscription = new Subscription();

  constructor(private mockSocketService: MockSocketService) {}

  ngOnInit() {
    // Start generating mock data
  }

  ngOnDestroy() {
    // Stop generating data and clean up subscriptions
//    this.mockSocketService.stopGeneratingData();
    this.subscription.unsubscribe();
  }
}
