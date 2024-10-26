import { BaseMessage } from "../models/base-message.model";

export interface Deserializer<T extends BaseMessage> {
    deserialize(data: any): T;
  }