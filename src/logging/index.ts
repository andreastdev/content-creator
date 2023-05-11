type LogLevel = "info" | "warn" | "error";

type LogData = {
    [key: string]: any;
};

type LogErrorData = {
    message?: string;
    stackTrace?: string | string[];
    type?: string;
} & LogData;

export class Logger {
    public logInfo(message: string, data?: LogData): void {
        this.log("info", message, data);
    }

    public logWarn(message: string, data?: LogData): void {
        this.log("warn", message, data);
    }

    public logError(message: string, data?: LogErrorData): void {
        this.log("error", message, data);
    }

    private log(
        logLevel: LogLevel,
        message: string,
        data?: LogData | LogErrorData
    ): void {
        const msg = `[${logLevel.toLocaleUpperCase()}]: ${message}`;

        switch (logLevel) {
            case "info":
                data ? console.log(msg, data) : console.log(msg);
                break;
            case "warn":
                data ? console.warn(msg, data) : console.warn(msg);
                break;
            case "error":
                if (!data) {
                    console.error(msg);
                    break;
                }

                if (!data.message) {
                    data.message = "N/A";
                }
                if (data.stackTrace && !Array.isArray(data.stackTrace)) {
                    const stackTraces = data.stackTrace.split(/\n\s+/gm);
                    data.stackTrace = stackTraces;
                }
                if (!data.type) {
                    data.type = "N/A";
                }
                console.error(msg, data);
                break;
            default:
                data ? console.log(msg, data) : console.log(msg);
        }
    }
}
