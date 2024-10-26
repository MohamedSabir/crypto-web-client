// services/compression.service.ts
import { Injectable } from '@angular/core';
import * as lz4 from 'lz4js'; // Make sure lz4js is installed

@Injectable({
  providedIn: 'root'
})
export class CompressionService {
  // Compress data using LZ4
  compress(data: Uint8Array ,  method: string): Uint8Array {
    const compressedData = lz4.compress(data);
    return compressedData;
  }

  // Decompress data using LZ4
  decompress(data: Uint8Array, method: string): Uint8Array {
    if (method === 'LZ4') {
      return lz4.decompress(data);
    }
    throw new Error(`Unsupported compression method: ${method}`);
  }
}
