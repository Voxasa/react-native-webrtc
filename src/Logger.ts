import debug from 'debug';


export default class Logger {
    static ROOT_PREFIX = 'rn-webrtc';

    // Static default log functions (customizable for Sentry integration)
    static defaultDebugLog: (...args: any[]) => void = console.log.bind(console);
    static defaultInfoLog: (...args: any[]) => void = console.log.bind(console);
    static defaultWarnLog: (...args: any[]) => void = console.log.bind(console);
    static defaultErrorLog: (...args: any[]) => void = console.log.bind(console);

    private _debug: debug.Debugger;
    private _info: debug.Debugger;
    private _warn: debug.Debugger;
    private _error: debug.Debugger;

    /**
     * Static setter for debug logger
     * @param fn Custom logger function for debug level
     */
    static setDefaultDebugLog(fn: (...args: any[]) => void): void {
        Logger.defaultDebugLog = fn;
    }

    /**
     * Static setter for info logger
     * @param fn Custom logger function for info level
     */
    static setDefaultInfoLog(fn: (...args: any[]) => void): void {
        Logger.defaultInfoLog = fn;
    }

    /**
     * Static setter for warn logger
     * @param fn Custom logger function for warn level
     */
    static setDefaultWarnLog(fn: (...args: any[]) => void): void {
        Logger.defaultWarnLog = fn;
    }

    /**
     * Static setter for error logger
     * @param fn Custom logger function for error level
     */
    static setDefaultErrorLog(fn: (...args: any[]) => void): void {
        Logger.defaultErrorLog = fn;
    }

    static enable(ns: string): void {
        debug.enable(ns);
    }

    constructor(prefix: string) {
        const _prefix = `${Logger.ROOT_PREFIX}:${prefix}`;

        this._debug = debug(`${_prefix}:DEBUG`);
        this._info = debug(`${_prefix}:INFO`);
        this._warn = debug(`${_prefix}:WARN`);
        this._error = debug(`${_prefix}:ERROR`);

        // Use static default loggers (can be customized via setters)
        this._debug.log = (...args: any[]) => Logger.defaultDebugLog(...args);
        this._info.log = (...args: any[]) => Logger.defaultInfoLog(...args);
        this._warn.log = (...args: any[]) => Logger.defaultWarnLog(...args);
        this._error.log = (...args: any[]) => Logger.defaultErrorLog(...args);
    }

    debug(msg: string): void {
        this._debug(msg);
    }

    info(msg: string): void {
        this._info(msg);
    }

    warn(msg: string): void {
        this._warn(msg);
    }

    error(msg: string, err?: Error): void {
        const trace = err?.stack ?? 'N/A';

        this._error(`${msg} Trace: ${trace}`);
    }
}
