// market-data-deserializer.ts
import { Deserializer } from './deserializer';
import { MarketDataMessage } from '../models/specific-message.model';


export class MarketDataDeserializer implements Deserializer<MarketDataMessage> {
    deserialize(data: Uint8Array): MarketDataMessage {
        const buffer = data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
        const marketDataMessage = MarketDataMessage.deserialize(buffer);

        // Return the instance of MarketDataMessage
        return marketDataMessage;
    }
}
