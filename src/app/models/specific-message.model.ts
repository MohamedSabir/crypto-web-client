// models/specific-message.model.ts
import { BaseMessage } from './base-message.model';
import { BaseModel, Field } from './base-model'; // Adjust the import path
import { MessageCodes } from '../Constants/message-codes';


export class MarketDataMessage extends BaseModel implements BaseMessage {
    @Field("string") symbol: string = "";   // Default value for symbol
    @Field("float") lastPrice: number = 0;  // Default value for lastPrice
    @Field("float") change: number = 0;      // Default value for change
    @Field("float") volume: number = 0;      // Default value for volume
    msgCode: number;                         // Message code for the message type

    constructor() {
        super();
        this.msgCode = MessageCodes.MARKET_DATA; // Set appropriate message code
    }

    protected getBufferSize(): number {
        // Return the constant size defined in MessageCodes
        return MessageCodes.MARKET_DATA_LENGTH; 
    }
}

// export interface OrderBookMessage extends BaseMessage {
//   orderId: string;  // Unique identifier for the order
//   side: 'buy' | 'sell'; // Order side
//   price: number;    // Order price
//   quantity: number; // Quantity of the order
// }

//import { BaseMessage } from './base-message'; // Adjust the import path

export class OrderBookMessage extends BaseModel implements BaseMessage {
    @Field("string") orderId: string = "";     // Default value for orderId
    @Field("string") side: 'buy' | 'sell' = 'buy'; // Default value for side
    @Field("float") price: number = 0;         // Default value for price
    @Field("float") quantity: number = 0;      // Default value for quantity
    msgCode: number;                     
    
    constructor() {
        super();
        this.msgCode = MessageCodes.ORDER_BOOK; // Set appropriate message code
    }

    protected getBufferSize(): number {
        // Return the constant size defined in MessageCodes
        return MessageCodes.ORDER_BOOK_LENGTH; 
    }
}
