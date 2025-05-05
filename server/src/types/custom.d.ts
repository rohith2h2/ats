// Type declarations for modules without @types packages

declare module 'pdf-parse' {
  function parse(dataBuffer: Buffer, options?: any): Promise<{
    numpages: number;
    numrender: number;
    info: any;
    metadata: any;
    text: string;
    version: string;
  }>;

  export = parse;
}

declare module 'mammoth' {
  interface Options {
    path?: string;
    buffer?: Buffer;
    arrayBuffer?: ArrayBuffer;
  }

  interface Result {
    value: string;
    messages: any[];
  }

  export function extractRawText(options: Options): Promise<Result>;
}

declare module 'html-pdf' {
  interface Options {
    format?: string;
    orientation?: 'portrait' | 'landscape';
    border?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
    [key: string]: any;
  }

  interface PDF {
    toBuffer(callback: (err: Error | null, buffer: Buffer) => void): void;
    toFile(filePath: string, callback: (err: Error | null, filePath: string) => void): void;
  }

  export function create(html: string, options?: Options): PDF;
}

// If we need to add declarations for other modules without type definitions, add them here 