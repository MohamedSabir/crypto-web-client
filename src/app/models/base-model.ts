import "reflect-metadata";

const fieldMetadataKey = Symbol("fieldMetadata");

export function Field(type: "int" | "float" | "string" | "uint") {
    return function (target: any, propertyKey: string) {
        const metadata = Reflect.getMetadata(fieldMetadataKey, target) || [];
        metadata.push({ propertyKey, type });
        Reflect.defineMetadata(fieldMetadataKey, metadata, target);
    };
}

export abstract class BaseModel {
    // Abstract method for subclasses to implement
    protected abstract getBufferSize(): number;

    serialize(): Uint8Array {
        const metadata = Reflect.getMetadata(fieldMetadataKey, this) || [];
        const buffer = this.getBufferSize();
        const arrayBuffer = new ArrayBuffer(buffer);
        const view = new DataView(arrayBuffer);
        let offset = 0;

        for (const { propertyKey, type } of metadata) {
            switch (type) {
                case "int":
                    view.setInt32(offset, (this as any)[propertyKey], true);
                    offset += 4; // 4 bytes for int
                    break;
                case "float":
                    view.setFloat64(offset, (this as any)[propertyKey], true);
                    offset += 8; // 8 bytes for float
                    break;
                case "uint":
                    view.setUint8(offset, (this as any)[propertyKey]);
                    offset += 1; // 1 byte for uint8
                    break;
                case "string":
                    const strBytes = new TextEncoder().encode((this as any)[propertyKey]);
                    view.setUint8(offset++, strBytes.length); // Write length
                    for (let byte of strBytes) {
                        view.setUint8(offset++, byte); // Write string bytes
                    }
                    break;
            }
        }

        return new Uint8Array(arrayBuffer);;
    }

    static deserialize<T>(this: new (...args: any[]) => T, buffer: ArrayBuffer): T {
        const metadata = Reflect.getMetadata(fieldMetadataKey, this.prototype) || [];
        const view = new DataView(buffer);
        const instance = new this();
        let offset = 0;

        for (const { propertyKey, type } of metadata) {
            switch (type) {
                case "int":
                    (instance as any)[propertyKey] = view.getInt32(offset, true);
                    offset += 4; // 4 bytes for int
                    break;
                case "float":
                    (instance as any)[propertyKey] = view.getFloat64(offset, true);
                    offset += 8; // 8 bytes for float
                    break;
                case "uint":
                    (instance as any)[propertyKey] = view.getUint8(offset);
                    offset += 1; // 1 byte for uint8
                    break;
                case "string":
                    const length = view.getUint8(offset++);
                    const strBytes = new Uint8Array(buffer, offset, length);
                    (instance as any)[propertyKey] = new TextDecoder().decode(strBytes);
                    offset += length;
                    break;
            }
        }

        return instance;
    }
}
