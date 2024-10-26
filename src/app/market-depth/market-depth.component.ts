// components/market-depth/market-depth.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from './../services/socket.service';
import { BaseMessage } from './../models/base-message.model'; // Importing BaseMessage interface
import { OrderBookMessage } from './../models/specific-message.model'; // Importing OrderBookMessage interface
import { MessageCodes } from '../Constants/message-codes';

@Component({
  selector: 'app-market-depth',
  templateUrl: './market-depth.component.html',
  styleUrls: ['./market-depth.component.css']
})
export class MarketDepthComponent implements OnInit, OnDestroy {
  marketDepthData$: OrderBookMessage[] = []; // Store received OrderBookMessage instances
  private subscription: Subscription = new Subscription();

  constructor(private socketService: SocketService) {}

  ngOnInit() {
    this.subscription.add(
      this.socketService.getDataStream().subscribe((data: BaseMessage) => {
        
        // Check if the incoming message is an OrderBookMessage
        if (data.msgCode === MessageCodes.ORDER_BOOK/* your specific msgCode for OrderBookMessage */) {
          // Cast data to OrderBookMessage
          const orderBookMessage = data as OrderBookMessage; // Type assertion
          this.marketDepthData$.push(orderBookMessage); // Add the instance to the array
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
