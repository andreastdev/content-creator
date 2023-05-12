import * as vscode from "vscode";

export enum Language {
    html = "html",
    markdown = "markdown",
    yaml = "yaml"
}

export type ContentCellCollection = {
    cells: ContentCell[];
};

type ContentCellBase = {
    kind: vscode.NotebookCellKind;
    language: string;
    value: string;
};

export type ContentCell = ContentCellBase & {
    flag: ContentFlag;
};

export type ContentFlag = "content" | "code" | "metadata";
