import * as stream from 'stream';
import abstractTransportBuild from 'pino-abstract-transport';
import { L as LokiOptions } from './shared/pino-loki.c1dac0aa.js';
export { a as LokiLogLevel, P as PinoLog } from './shared/pino-loki.c1dac0aa.js';

declare function pinoLoki(userOptions: LokiOptions): stream.Transform & abstractTransportBuild.OnUnknown;

export { LokiOptions, pinoLoki as default };
