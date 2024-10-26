import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { CompressionService } from './compression.service';
import { DeserializerFactory } from '../deserializers/deserializer-factory';
import { BaseMessage } from '../models/base-message.model';

interface SocketConfig {
  name: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private sockets: Map<string, WebSocket> = new Map();
  private compressionMap: { [socketName: string]: string } = {};
  private dataSubject: Subject<BaseMessage> = new Subject();

  constructor(private http: HttpClient, private compressionService: CompressionService) {}

  public initSocketsFromAssetDiscovery(): void {
    this.http.get<{ [socketName: string]: string }>('/assets/socket-config.json')
      .pipe(
        switchMap(configMap => {
          this.compressionMap = configMap;
          return this.http.get<{ configUrl: string }>('/assets/discovery-config.json');
        }),
        switchMap(discoveryData => this.http.get<{ sockets: SocketConfig[] }>(discoveryData.configUrl))
      )
      .subscribe(
        config => {
          config.sockets.forEach(socketConfig => {
            if (!this.sockets.has(socketConfig.url)) {
              this.createSocketConnection(socketConfig);
            } else {
              console.warn(`Socket already exists for URL: ${socketConfig.url}`);
            }
          });
        },
        error => console.error('Failed to load socket or compression configuration', error)
      );
  }

  private createSocketConnection(socketConfig: SocketConfig): void {
    const socket = new WebSocket(socketConfig.url);
    socket.binaryType = 'arraybuffer';

    socket.onmessage = (event: MessageEvent) => {
      const rawData = new Uint8Array(event.data);
      const compressionMethod = this.compressionMap[socketConfig.name];

      this.handleIncomingData(rawData ,compressionMethod);
      // const data = compressionMethod
      //   ? this.compressionService.decompress(rawData, compressionMethod)
      //   : rawData; // If no entry exists, treat as uncompressed

      //    let msgCode: number = 0 ;
      //   if (compressionMethod)
      //     msgCode = new DataView(data.buffer).getInt32(0, true);
      //   else
      //   {
      //     const jsonString = new TextDecoder().decode(data);
      //     const parsedData = JSON.parse(jsonString);
      //     msgCode = parsedData.msgCode;
      //   }

        

    //const msgCode = parsedData.msgCode;

      //  this.forwardToFactory(data, msgCode);
    };

    this.sockets.set(socketConfig.url, socket);
  }

  public handleIncomingData(data: Uint8Array,  socketName: string): void {
    const compressionMethod = this.compressionMap[socketName];
    const decompressedData = compressionMethod ? this.compressionService.decompress(data, compressionMethod) : data;
    let msgCode: number = 0 ;
    if (compressionMethod)
    {
      msgCode = new DataView(data.buffer).getInt32(0, true);
      this.forwardToFactory(decompressedData, msgCode);
    }
    else
    {
      const jsonString = new TextDecoder().decode(data);
      const parsedData = JSON.parse(jsonString);
      msgCode = parsedData.msgCode;
      this.forwardToFactory(parsedData, msgCode);
    }

    //this.forwardToFactory(decompressedData, msgCode);
  }

  private forwardToFactory(data: Uint8Array, msgCode: number): void {
    // const jsonString = new TextDecoder().decode(data);
    // const parsedData = JSON.parse(jsonString);

    const deserializer = DeserializerFactory.getDeserializer(msgCode);
    const message = deserializer.deserialize(data);
    this.dataSubject.next(message);
  }

  public getCompressionMethod(socketName: string): string | undefined {
    return this.compressionMap[socketName];
  }

  public getDataStream(): Subject<BaseMessage> {
    return this.dataSubject;
  }
}
