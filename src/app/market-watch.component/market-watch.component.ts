// components/market-watch/market-watch.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from './../services/socket.service';
import { BaseMessage } from './../models/base-message.model';
import { MarketDataMessage } from '../models/specific-message.model';
import { MessageCodes } from '../Constants/message-codes';

@Component({
  selector: 'app-market-watch',
  templateUrl: './market-watch.component.html',
  styleUrls: ['./market-watch.component.css']
})
export class MarketWatchComponent implements OnInit, OnDestroy {
  marketData$: MarketDataMessage[] = []; // Store received MarketDataMessage instances
  private subscription: Subscription = new Subscription();

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.subscription.add(
      this.socketService.getDataStream().subscribe((data: BaseMessage) => {
        // Check if the incoming message is a MarketDataMessage
        if (data.msgCode === MessageCodes.MARKET_DATA) { // Use the constant
          const marketDataMessage = data as MarketDataMessage; // Type assertion
          this.marketData$.push(marketDataMessage); // Add the instance to the array
        }
      })
    );

    // Initialize the socket connections from asset discovery
    this.socketService.initSocketsFromAssetDiscovery();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe(); // Clean up subscriptions
  }
}
