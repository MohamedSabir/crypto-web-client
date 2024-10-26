// deserializer-factory.ts
import { MarketDataDeserializer } from './market-data-deserializer';
import { OrderBookDeserializer } from './order-book-deserializer';
import { Deserializer } from './deserializer';
import { BaseMessage } from '../models/base-message.model';

export class DeserializerFactory {
  static getDeserializer(msgCode: number): Deserializer<BaseMessage> {
    switch (msgCode) {
      case 101: // msgCode for Market Data
        return new MarketDataDeserializer();
      case 202: // msgCode for Order Book
        return new OrderBookDeserializer();
      default:
        throw new Error(`No deserializer found for msgCode: ${msgCode}`);
    }
  }
}
