import abstractTransportBuild from 'pino-abstract-transport';
import { debuglog } from 'node:util';

const debug = debuglog("pino-loki");

var LokiLogLevel = /* @__PURE__ */ ((LokiLogLevel2) => {
  LokiLogLevel2["Info"] = "info";
  LokiLogLevel2["Debug"] = "debug";
  LokiLogLevel2["Error"] = "error";
  LokiLogLevel2["Warning"] = "warning";
  LokiLogLevel2["Critical"] = "critical";
  return LokiLogLevel2;
})(LokiLogLevel || {});

var __accessCheck$1 = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet$1 = (obj, member, getter) => {
  __accessCheck$1(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd$1 = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet$1 = (obj, member, value, setter) => {
  __accessCheck$1(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod$1 = (obj, member, method) => {
  __accessCheck$1(obj, member, "access private method");
  return method;
};
var _propsToLabels, _levelMap, _buildTimestamp, buildTimestamp_fn, _stringifyLog, stringifyLog_fn, _buildLabelsFromProps, buildLabelsFromProps_fn, _handleTemplateString, handleTemplateString_fn;
const NANOSECONDS_LENGTH = 19;
class LogBuilder {
  constructor(options) {
    /**
     * Builds a timestamp string from a Pino log object.
     * @returns A string representing the timestamp in nanoseconds.
     */
    __privateAdd$1(this, _buildTimestamp);
    /**
     * Stringify the log object. If convertArrays is true then it will convert
     * arrays to objects with indexes as keys.
     */
    __privateAdd$1(this, _stringifyLog);
    __privateAdd$1(this, _buildLabelsFromProps);
    /**
     * Handles formatting template strings for the last output
     * @returns string
     * @private
     * @param template
     * @param data
     */
    __privateAdd$1(this, _handleTemplateString);
    __privateAdd$1(this, _propsToLabels, void 0);
    __privateAdd$1(this, _levelMap, void 0);
    __privateSet$1(this, _propsToLabels, options?.propsToLabels || []);
    __privateSet$1(this, _levelMap, Object.assign(
      {
        10: LokiLogLevel.Debug,
        20: LokiLogLevel.Debug,
        30: LokiLogLevel.Info,
        40: LokiLogLevel.Warning,
        50: LokiLogLevel.Error,
        60: LokiLogLevel.Critical
      },
      options?.levelMap
    ));
  }
  /**
   * Convert a level to a human readable status
   */
  statusFromLevel(level) {
    return __privateGet$1(this, _levelMap)[level] || LokiLogLevel.Info;
  }
  /**
   * Build a loki log entry from a pino log
   */
  build(options) {
    const status = this.statusFromLevel(options.log.level);
    const time = __privateMethod$1(this, _buildTimestamp, buildTimestamp_fn).call(this, options.log, options.replaceTimestamp);
    const propsLabels = __privateMethod$1(this, _buildLabelsFromProps, buildLabelsFromProps_fn).call(this, options.log);
    const hostname = options.log.hostname;
    options.log.hostname = void 0;
    const structuredMetadata = options.structuredMetaKey ? options.log[options.structuredMetaKey] : void 0;
    const formattedMessage = options.formattingTemplate ? __privateMethod$1(this, _handleTemplateString, handleTemplateString_fn).call(this, options.formattingTemplate, {
      log: {
        ...options.log,
        levelParsed: __privateGet$1(this, _levelMap)[options.log.level],
        timeParsed: new Date(options.log.time ?? 0).toISOString()
      }
    }) : __privateMethod$1(this, _stringifyLog, stringifyLog_fn).call(this, options.log, options.convertArrays);
    return {
      stream: {
        level: status,
        hostname,
        ...options.additionalLabels,
        ...propsLabels
      },
      values: [
        // Make sure to exclude structured metadata from the log object
        // if not present because olders versions of Loki will not accept
        // it and will return an error.
        structuredMetadata ? [time, formattedMessage, structuredMetadata] : [time, formattedMessage]
      ]
    };
  }
}
_propsToLabels = new WeakMap();
_levelMap = new WeakMap();
_buildTimestamp = new WeakSet();
buildTimestamp_fn = function(log, replaceTimestamp) {
  if (replaceTimestamp) {
    return ((/* @__PURE__ */ new Date()).getTime() * 1e6).toString();
  }
  const time = log.time || Date.now();
  const strTime = time.toString();
  if (strTime.length === NANOSECONDS_LENGTH) {
    return strTime;
  }
  const missingFactor = 10 ** (19 - strTime.length);
  return (time * missingFactor).toString();
};
_stringifyLog = new WeakSet();
stringifyLog_fn = function(log, convertArrays) {
  return JSON.stringify(log, (_, value) => {
    if (!convertArrays)
      return value;
    if (Array.isArray(value)) {
      return Object.fromEntries(value.map((value2, index) => [index, value2]));
    }
    return value;
  });
};
_buildLabelsFromProps = new WeakSet();
buildLabelsFromProps_fn = function(log) {
  const labels = {};
  for (const prop of __privateGet$1(this, _propsToLabels)) {
    if (log[prop]) {
      labels[prop] = log[prop];
    }
  }
  return labels;
};
_handleTemplateString = new WeakSet();
handleTemplateString_fn = function(template, data) {
  return template?.replace(/\${([\w.]+)}/g, (_, key) => {
    const value = key.split(".").reduce((acc, part) => acc?.[part], data);
    if (typeof value === "object") {
      return __privateMethod$1(this, _stringifyLog, stringifyLog_fn).call(this, value);
    }
    return value !== void 0 ? value : "";
  });
};

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};
var __privateMethod = (obj, member, method) => {
  __accessCheck(obj, member, "access private method");
  return method;
};
var _options, _logBuilder, _handleFailure, handleFailure_fn;
class RequestError extends Error {
  constructor(message, responseBody) {
    super(message);
    __publicField(this, "responseBody");
    this.name = "RequestError";
    this.responseBody = responseBody;
  }
}
class LogPusher {
  constructor(options) {
    /**
     * Handle push failures
     */
    __privateAdd(this, _handleFailure);
    __privateAdd(this, _options, void 0);
    __privateAdd(this, _logBuilder, void 0);
    __privateSet(this, _options, options);
    __privateSet(this, _logBuilder, new LogBuilder({
      levelMap: options.levelMap,
      propsToLabels: options.propsToLabels
    }));
  }
  /**
   * Push one or multiples logs entries to Loki
   */
  async push(logs) {
    if (!Array.isArray(logs)) {
      logs = [logs];
    }
    const lokiLogs = logs.map(
      (log) => __privateGet(this, _logBuilder).build({
        log,
        replaceTimestamp: __privateGet(this, _options).replaceTimestamp,
        additionalLabels: __privateGet(this, _options).labels,
        convertArrays: __privateGet(this, _options).convertArrays,
        structuredMetaKey: __privateGet(this, _options).structuredMetaKey,
        formattingTemplate: __privateGet(this, _options).formattingTemplate
      })
    );
    debug(`[LogPusher] pushing ${lokiLogs.length} logs to Loki`);
    try {
      const response = await fetch(
        new URL(__privateGet(this, _options).endpoint ?? "loki/api/v1/push", __privateGet(this, _options).host),
        {
          method: "POST",
          signal: AbortSignal.timeout(__privateGet(this, _options).timeout ?? 3e4),
          headers: {
            ...__privateGet(this, _options).headers,
            ...__privateGet(this, _options).basicAuth && {
              Authorization: "Basic " + Buffer.from(
                `${__privateGet(this, _options).basicAuth.username}:${__privateGet(this, _options).basicAuth.password}`
              ).toString("base64")
            },
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ streams: lokiLogs })
        }
      );
      if (!response.ok) {
        throw new RequestError("Got error when trying to send log to loki", await response.text());
      }
    } catch (err) {
      __privateMethod(this, _handleFailure, handleFailure_fn).call(this, err);
    }
    debug(`[LogPusher] pushed ${lokiLogs.length} logs to Loki`, { logs: lokiLogs });
  }
}
_options = new WeakMap();
_logBuilder = new WeakMap();
_handleFailure = new WeakSet();
handleFailure_fn = function(err) {
  if (__privateGet(this, _options).silenceErrors === true) {
    return;
  }
  if (err instanceof RequestError) {
    console.error(err.message + "\n" + err.responseBody);
    return;
  }
  console.error("Got unknown error when trying to send log to Loki, error output:", err);
};

function resolveOptions(options) {
  return {
    ...options,
    endpoint: options.endpoint ?? "loki/api/v1/push",
    timeout: options.timeout ?? 3e4,
    silenceErrors: options.silenceErrors ?? false,
    batching: options.batching ?? true,
    interval: options.interval ?? 5,
    replaceTimestamp: options.replaceTimestamp ?? false,
    propsToLabels: options.propsToLabels ?? [],
    convertArrays: options.convertArrays ?? false,
    structuredMetaKey: options.structuredMetaKey,
    formattingTemplate: options.formattingTemplate
  };
}
function pinoLoki(userOptions) {
  const options = resolveOptions(userOptions);
  const logPusher = new LogPusher(options);
  debug(`[PinoLoki] initialized with options: ${JSON.stringify(options)}`);
  let batchInterval;
  let pinoLogBuffer = [];
  return abstractTransportBuild(
    async (source) => {
      if (options.batching) {
        batchInterval = setInterval(async () => {
          debug(`Batch interval reached, sending ${pinoLogBuffer.length} logs to Loki`);
          if (pinoLogBuffer.length === 0) {
            return;
          }
          logPusher.push(pinoLogBuffer);
          pinoLogBuffer = [];
        }, options.interval * 1e3);
      }
      for await (const obj of source) {
        if (options.batching) {
          pinoLogBuffer.push(obj);
          continue;
        }
        logPusher.push(obj);
      }
    },
    {
      /**
       * When transport is closed, push remaining logs to Loki
       * and clear the interval
       */
      async close() {
        if (options.batching) {
          clearInterval(batchInterval);
          await logPusher.push(pinoLogBuffer);
        }
      }
    }
  );
}

export { LokiLogLevel, pinoLoki as default };
