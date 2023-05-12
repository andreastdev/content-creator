import * as vscode from "vscode";
import { ContentFlag, Language } from "./types";

const METADATA_CELL_IDENTIFIER = "# metadata";

export function generateCellFlag(
    cellData: vscode.NotebookCellData
): ContentFlag {
    if (!Object.values<string>(Language).includes(cellData.languageId)) {
        return "code";
    }

    if (cellData.languageId === Language.yaml) {
        return cellData.value.split("\r")[0] === METADATA_CELL_IDENTIFIER
            ? "metadata"
            : "code";
    }

    return "content";
}
