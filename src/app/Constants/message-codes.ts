// constants/message-codes.ts

export class MessageCodes {
    // Define your message codes here
    static readonly ORDER_BOOK: number = 1001; // Example code for OrderBookMessage
    static readonly MARKET_DATA: number = 1002; // Example code for MarketDataMessage
    
    static readonly HEADER_LENGTH: number = 18;

    // Add other message codes as needed
    static readonly ORDER_BOOK_LENGTH: number = 18+  
    4 +  // Length for orderId
    20 +  // Assuming max length for string orderId
    4 +   // Side length (4 bytes for the string value)
    8 +   // Price (8 bytes for a float)
    
    8;    // Quantity (8 bytes for a float)

    static readonly MARKET_DATA_LENGTH: number = 18+ 
    4 +  // Length for symbol (assumed max length)
    20 +  // Assuming max length for string symbol
    8 +   // Last price (8 bytes for a float)
    8 +   // Change (8 bytes for a float)
    8;
        //
    // You can also add a method to get message names if necessary
    static getMessageName(msgCode: number): string {
      switch (msgCode) {
        case MessageCodes.ORDER_BOOK:
          return 'OrderBookMessage';
        case MessageCodes.MARKET_DATA:
          return 'MarketDataMessage';
        // Add other cases as needed
        default:
          return 'Unknown Message Code';
      }
    }
  }
  