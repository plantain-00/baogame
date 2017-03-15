import * as common from "../back/common";
import * as libs from "./libs";

export function start(app: libs.App, joing: () => void, initDone: () => void) {
    const control: common.Control = {
        upDown: 0,
        downDown: 0,
        leftDown: 0,
        rightDown: 0,
        itemDown: 0,
        itemPress: false,
        leftPress: false,
        rightPress: false,
        upPress: false,
        downPress: false,
    };
    document.ontouchmove = e => e.preventDefault;
    app.showDialog = false;
    app.showMobileControl = true;

    const middle = document.getElementById("middle")!;
    function checkDisplay() {
        if (600 > window.innerHeight) {
            const h = window.innerHeight;
            const w = Math.floor(h / 600 * 1100);
            middle.style.width = `${w}px`;
            middle.style.height = `${h}px`;
        } else {
            middle.style.removeProperty("width");
            middle.style.removeProperty("height");
        }
    }
    checkDisplay();
    window.onresize = checkDisplay;

    if (initDone) {
        initDone();
    }
    return control;
}
