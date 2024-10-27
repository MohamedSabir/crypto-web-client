// deserializer-factory.ts
import { MarketDataDeserializer } from './market-data-deserializer';
import { OrderBookDeserializer } from './order-book-deserializer';
import { Deserializer } from './deserializer';
import { BaseMessage } from '../models/base-message.model';
import { MessageCodes } from '../Constants/message-codes';

export class DeserializerFactory {
  static getDeserializer(msgCode: number): Deserializer<BaseMessage> {
    switch (msgCode) {
      case MessageCodes.MARKET_DATA: // msgCode for Market Data
        return new MarketDataDeserializer();
      case MessageCodes.ORDER_BOOK: // msgCode for Order Book
        return new OrderBookDeserializer();
      default:
        throw new Error(`No deserializer found for msgCode: ${msgCode}`);
    }
  }
}
