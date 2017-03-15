import * as common from "../back/common";
import * as libs from "./libs";

export function start(app: libs.App, initDone: () => void) {
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

    document.addEventListener("keydown", e => {
        if (e.keyCode === 87) {
            if (!control.upDown) {
                control.upPress = true;
            }
            control.upDown = 2000;
        } else if (e.keyCode === 83) {
            if (!control.downDown) {
                control.downPress = true;
            }
            control.downDown = 2000;
        } else if (e.keyCode === 65) {
            if (!control.leftDown) {
                control.leftPress = true;
            }
            control.leftDown = 2000;
        } else if (e.keyCode === 68) {
            if (!control.rightDown) {
                control.rightPress = true;
            }
            control.rightDown = 2000;
        } else if (e.keyCode === 81) {
            if (!control.itemDown) {
                control.itemPress = true;
            }
            control.itemDown = 2000;
        }
    });
    document.addEventListener("keyup", e => {
        if (e.keyCode === 87) {
            control.upDown = 0;
        } else if (e.keyCode === 83) {
            control.downDown = 0;
        } else if (e.keyCode === 65) {
            control.leftDown = 0;
        } else if (e.keyCode === 68) {
            control.rightDown = 0;
        } else if (e.keyCode === 81) {
            control.itemDown = 0;
        }
        if (e.keyCode === 69) {
            if (app.showDialog) {
                app.join();
            }
        }
        e.preventDefault();
    });

    if (initDone) {
        initDone();
    }
    return control;
}
