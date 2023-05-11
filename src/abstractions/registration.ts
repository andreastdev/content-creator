import * as vscode from "vscode";

export type RegistrationType = "command" | "notebook" | "view";

export type RegistrationAction = (...args: any[]) => vscode.Disposable;

export interface Registration {
    readonly id: string;
    readonly type: RegistrationType;

    handleRegistration?(...args: any[]): void | Promise<void>;
}
