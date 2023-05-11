import * as vscode from "vscode";

import { CommandManager } from "../abstractions";
import { ExportCommand } from "./exportCommand";
import { OpenSourceCommand } from "./openSourceCommand";

export function registerCommands(
    commandManager?: CommandManager
): vscode.Disposable {
    if (!commandManager) {
        commandManager = new CommandManager();
    }

    commandManager.register(new ExportCommand());
    commandManager.register(new OpenSourceCommand());

    return commandManager;
}
