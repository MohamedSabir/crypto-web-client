import { Injectable } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { CompressionService } from './compression.service';
import { SocketService } from './socket.service';
import { DeserializerFactory } from '../deserializers/deserializer-factory';
import { BaseMessage } from '../models/base-message.model';
import { MessageCodes } from '../Constants/message-codes';

@Injectable({
  providedIn: 'root'
})
export class MockSocketService {
  private dataSubject: Subject<BaseMessage> = new Subject();

  constructor(
    private socketService: SocketService,
    private compressionService: CompressionService
  ) {
    this.startMockSocketConnections();
  }

  private startMockSocketConnections() {
    // Start emitting mock data at regular intervals
    interval(3000).pipe(
      map(() => this.generateMockData())
    ).subscribe(mockData => {
      this.handleMockData(mockData);
    });
  }

  // Generate mock data to simulate WebSocket message
  private generateMockData(): { socketName: string,  data: any } {
    const mockData = [
      { msgCode: MessageCodes.MARKET_DATA, symbol: 'BTC', lastPrice: this.randomPrice(29000, 30000), change: this.randomChange(), volume: this.randomVolume() },
      { msgCode: MessageCodes.MARKET_DATA, symbol: 'ETH', lastPrice: this.randomPrice(1800, 2000), change: this.randomChange(), volume: this.randomVolume() },
      { msgCode: MessageCodes.MARKET_DATA, symbol: 'XRP', lastPrice: this.randomPrice(0.5, 0.6), change: this.randomChange(), volume: this.randomVolume() }
    ];

    return {
      socketName: 'base_n', // Example socket name, should match with entry in socket-config.json
               // Example message code, to be used by DeserializerFactory
      data: mockData
    };
  }

  private handleMockData({ socketName,  data }: { socketName: string,  data: any }) {
    const compressionMethod = this.socketService.getCompressionMethod(socketName); // Obtain compression method from the main service
    let processedData: Uint8Array;

    if (compressionMethod) {
      const jsonData = JSON.stringify(data);
      const inputBuffer = new TextEncoder().encode(jsonData);
      processedData = this.compressionService.compress(inputBuffer, compressionMethod);
    } else {
      // If no compression, treat as uncompressed data
      processedData = new TextEncoder().encode(JSON.stringify(data));
    }

    // Forward the compressed data to the main service's factory method
    this.socketService.handleIncomingData(processedData,  socketName);
  }

  // Random data generators
  private randomPrice(min: number, max: number): number {
    return parseFloat((Math.random() * (max - min) + min).toFixed(2));
  }

  private randomChange(): number {
    return parseFloat((Math.random() * 10 - 5).toFixed(2));
  }

  private randomVolume(): number {
    return Math.floor(Math.random() * 100000);
  }
}
