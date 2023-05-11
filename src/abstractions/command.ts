import { DisposableManager } from "./disposableManager";
import { Registration } from "./registration";

export interface Command extends Registration {
    readonly type: "command";
}

export class CommandManager extends DisposableManager<Command> {}
