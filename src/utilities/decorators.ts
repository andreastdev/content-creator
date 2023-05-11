import * as vscode from "vscode";

import { Logger } from "../logging";

const logger = new Logger();

export function tryCatch<TReturn>(
    onError?: (error?: any) => TReturn
): MethodDecorator {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: PropertyDescriptor
    ) {
        const original = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            try {
                const result = original.call(this, ...args);

                if (result && result instanceof Promise) {
                    return await result;
                }

                return result;
            } catch (error: any) {
                if (error instanceof Error) {
                    vscode.window.showErrorMessage(error.message);
                    logger.logError(error.message, {
                        message: error.message,
                        type: error.name,
                        stackTrace: error.stack
                    });
                } else {
                    vscode.window.showErrorMessage(String(error));
                    logger.logError(String(error), {
                        className: target.constructor.name,
                        methodName: propertyKey
                    });
                }

                if (onError) {
                    return await onError(error);
                }
            }
        };
    };
}
