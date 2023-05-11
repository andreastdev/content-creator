import * as vscode from "vscode";

import { Command } from "../abstractions";
import { tryCatch } from "../utilities";

export class OpenSourceCommand implements Command {
    public readonly id = "creator.content.openSource";
    public readonly type = "command";

    @tryCatch()
    async handleRegistration?(data: {
        notebookEditor: {
            notebookUri: vscode.Uri;
        };
        ui: boolean;
    }): Promise<void> {
        await vscode.commands.executeCommand(
            "vscode.openWith",
            data.notebookEditor.notebookUri,
            "default"
        );

        await vscode.window.showWarningMessage(
            "Editing this document might negatively affect its notebook view!"
        );
    }
}
