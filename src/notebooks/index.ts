import * as vscode from "vscode";

import { NotebookManager } from "../abstractions";
import { ContentSerializer } from "./content/serializer";

export function registerNotebooks(
    notebookManager?: NotebookManager
): vscode.Disposable {
    if (!notebookManager) {
        notebookManager = new NotebookManager();
    }

    notebookManager.register(new ContentSerializer());

    return notebookManager;
}
