import * as common from "./common";
import * as core from "./core";

export function getData(data: core.ItemGate): common.ItemGate {
    return {
        x: data.x,
        y: data.y,
    };
}
