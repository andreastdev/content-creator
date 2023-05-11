import * as vscode from "vscode";

import {
    Registration,
    RegistrationAction,
    RegistrationType
} from "./registration";

export class DisposableManager<TItem extends Registration>
    implements vscode.Disposable
{
    private readonly _factory = new RegistrationActionFactory();
    private readonly _disposablesMap = new Map<string, vscode.Disposable>();

    public dispose() {
        for (const disposable of this._disposablesMap.values()) {
            disposable.dispose();
        }
        this._disposablesMap.clear();
    }

    public register<T extends TItem>(...items: T[]): T[] {
        const registered: T[] = [];

        for (const item of items) {
            if (this._disposablesMap.has(item.id)) {
                registered.push(item);
                continue;
            }

            const registrationAction = this._factory.getAction(item.type);
            if (item.type === "command") {
                this._disposablesMap.set(
                    item.id,
                    registrationAction(item.id, item.handleRegistration, item)
                );
            } else {
                this._disposablesMap.set(
                    item.id,
                    registrationAction(item.id, item)
                );
            }

            registered.push(item);
        }

        return registered;
    }
}

class RegistrationActionFactory {
    private static readonly _registrationMap = new Map<
        RegistrationType,
        RegistrationAction
    >();

    static {
        RegistrationActionFactory._registrationMap.set(
            "command",
            vscode.commands.registerCommand
        );
        RegistrationActionFactory._registrationMap.set(
            "notebook",
            vscode.workspace.registerNotebookSerializer
        );
        RegistrationActionFactory._registrationMap.set(
            "view",
            vscode.window.registerWebviewViewProvider
        );
    }

    public getAction(type: RegistrationType): RegistrationAction {
        if (!RegistrationActionFactory._registrationMap.has(type)) {
            throw Error(
                `The registration type "${type}" has not been mapped to an action (${RegistrationActionFactory.name})`
            );
        }

        return RegistrationActionFactory._registrationMap.get(
            type
        ) as RegistrationAction;
    }
}
