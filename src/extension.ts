import * as vscode from "vscode";

import { registerCommands } from "./commands";
import { registerNotebooks } from "./notebooks";

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(registerCommands(), registerNotebooks());
}

export function deactivate() {}
