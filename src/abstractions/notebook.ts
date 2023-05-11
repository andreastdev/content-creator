import * as vscode from "vscode";

import { Registration } from "./registration";
import { DisposableManager } from "./disposableManager";

export interface NotebookSerializer
    extends Registration,
        vscode.NotebookSerializer {
    readonly type: "notebook";
}

export class NotebookManager extends DisposableManager<NotebookSerializer> {}
