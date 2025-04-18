declare enum LokiLogLevel {
    Info = "info",
    Debug = "debug",
    Error = "error",
    Warning = "warning",
    Critical = "critical"
}
interface PinoLog {
    level: number;
    msg?: string;
    levelParsed?: string;
    time?: number;
    timeParsed?: string;
    [key: string]: any;
}
interface LokiOptions {
    host: string;
    endpoint?: string;
    timeout?: number;
    silenceErrors?: boolean;
    batching?: boolean;
    interval?: number;
    replaceTimestamp?: boolean;
    labels?: {
        [key: string]: string;
    };
    levelMap?: {
        [key: number]: LokiLogLevel;
    };
    basicAuth?: {
        username: string;
        password: string;
    };
    headers?: Record<string, string>;
    propsToLabels?: string[];
    convertArrays?: boolean;
    structuredMetaKey?: string;
    formattingTemplate?: string;
}

export { LokiLogLevel as a };
export type { LokiOptions as L, PinoLog as P };
