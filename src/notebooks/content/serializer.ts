import * as vscode from "vscode";
import { TextDecoder, TextEncoder } from "util";

import { NotebookSerializer } from "../../abstractions";
import { ContentCellCollection, ContentFlag } from "./types";
import { tryCatch } from "../../utilities";

enum Language {
    css = "css",
    html = "html",
    markdown = "markdown",
    yaml = "yaml"
}

export class ContentSerializer implements NotebookSerializer {
    public readonly id = "creator.content";
    public readonly type = "notebook";

    private readonly _metadataCellIdentifier = "# metadata";

    @tryCatch(() => new vscode.NotebookData([]))
    public async deserializeNotebook(
        data: Uint8Array,
        _: vscode.CancellationToken
    ): Promise<vscode.NotebookData> {
        const decodedData = new TextDecoder().decode(data);
        if (!decodedData) {
            return new vscode.NotebookData([]);
        }

        const contentNotebookData = <ContentCellCollection>(
            JSON.parse(decodedData)
        );

        const cells = contentNotebookData.cells.map(
            (cell) =>
                new vscode.NotebookCellData(
                    cell.kind,
                    cell.value,
                    cell.language
                )
        );

        return new vscode.NotebookData(cells);
    }

    @tryCatch()
    public async serializeNotebook(
        data: vscode.NotebookData,
        _: vscode.CancellationToken
    ): Promise<Uint8Array> {
        const contentNotebookData: ContentCellCollection = { cells: [] };

        for (const cell of data.cells) {
            contentNotebookData.cells.push({
                kind: cell.kind,
                language: cell.languageId,
                value: cell.value,
                flag: this.generateCellFlag(cell)
            });
        }

        return new TextEncoder().encode(
            JSON.stringify(contentNotebookData, null, 4)
        );
    }

    private generateCellFlag(cellData: vscode.NotebookCellData): ContentFlag {
        if (!Object.values<string>(Language).includes(cellData.languageId)) {
            return "code";
        }

        if (cellData.languageId === Language.yaml) {
            return cellData.value.split("\r")[0] ===
                this._metadataCellIdentifier
                ? "metadata"
                : "code";
        }

        return "content";
    }
}
