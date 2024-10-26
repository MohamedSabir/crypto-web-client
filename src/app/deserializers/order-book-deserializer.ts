// order-book-deserializer.ts
import { Deserializer } from './deserializer';
import { OrderBookMessage } from '../models/specific-message.model';

export class OrderBookDeserializer implements Deserializer<OrderBookMessage> {
    deserialize(data: Uint8Array): OrderBookMessage {
        const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
        const orderBookMessage = OrderBookMessage.deserialize(buffer);

        // Return the instance of OrderBookMessage
        return orderBookMessage;
    }
}


