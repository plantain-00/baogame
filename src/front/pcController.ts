// pc的控制器
import * as common from "../back/common";

export function start(joing: (p: any) => void, initDone: () => void) {
    const p1 = {
        data: undefined as common.UserProtocol | undefined,
        id: undefined as number | null | undefined,
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

    document.addEventListener("keydown", (e) => {
        if (e.keyCode === 87) {
            if (!p1.upDown) { p1.upPress = true; }
            p1.upDown = 2000;
        } else if (e.keyCode === 83) {
            if (!p1.downDown) { p1.downPress = true; }
            p1.downDown = 2000;
        } else if (e.keyCode === 65) {
            if (!p1.leftDown) { p1.leftPress = true; }
            p1.leftDown = 2000;
        } else if (e.keyCode === 68) {
            if (!p1.rightDown) { p1.rightPress = true; }
            p1.rightDown = 2000;
        } else if (e.keyCode === 81) {
            if (!p1.itemDown) { p1.itemPress = true; }
            p1.itemDown = 2000;
        }
    });
    document.addEventListener("keyup", (e) => {
        if (e.keyCode === 87) {
            p1.upDown = 0;
        } else if (e.keyCode === 83) {
            p1.downDown = 0;
        } else if (e.keyCode === 65) {
            p1.leftDown = 0;
        } else if (e.keyCode === 68) {
            p1.rightDown = 0;
        } else if (e.keyCode === 81) {
            p1.itemDown = 0;
        }
        if (e.keyCode === 69) {
            if ($(".joining").css("display") !== "none") {
                joing(p1);
            }
        }
        e.preventDefault();
    });

    $(".txt-input").on("keydown", (e) => { e.stopPropagation(); });
    $(".txt-input").on("keyup", (e) => { e.stopPropagation(); });
    $(".joining .joinBtn").click(() => { joing(true); });
    $(".joining .dismissBtn").click(() => {
        $(".joining").hide();
    });
    $(".joining .joinBtn").text("按e加入");

    if (initDone) {
        initDone();
    }
    return p1;
}
