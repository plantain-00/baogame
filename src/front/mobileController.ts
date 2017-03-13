import * as common from "../back/common";

export function start(joing: () => void, initDone: () => void) {
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
    $("body").on("touchmove", e => {
        e.preventDefault();
    });
    $(".notice").hide();
    $(".mobileController").show();

    $(".mobileController .moreBtn").on("touchstart", e => {
        const t = $(e.currentTarget).data("act");
        if (t === "a") {
            if (!control.itemDown) {
                control.itemPress = true;
            }
            control.itemDown = 20000;
        } else if (t === "l") {
            if (!control.leftDown) {
                control.leftPress = true;
            }
            control.leftDown = 20000;
        } else if (t === "r") {
            if (!control.rightDown) {
                control.rightPress = true;
            }
            control.rightDown = 20000;
        } else if (t === "u") {
            if (!control.upDown) {
                control.upPress = true;
            }
            control.upDown = 20000;
        } else if (t === "d") {
            if (!control.downDown) {
                control.downPress = true;
            }
            control.downDown = 20000;
        }
    });

    $(".mobileController .moreBtn").on("touchend", e => {
        const t = $(e.currentTarget).data("act");
        if (t === "a") {
            control.itemDown = 0;
        } else if (t === "l") {
            control.leftDown = 0;
        } else if (t === "r") {
            control.rightDown = 0;
        } else if (t === "u") {
            control.upDown = 0;
        } else if (t === "d") {
            control.downDown = 0;
        }
    });

    $(".joining .joinBtn").click(() => { joing(); });
    $(".joining .dismissBtn").click(() => {
        $(".joining").hide();
    });

    function checkDisplay() {
        if (600 > window.innerHeight) {
            const h = window.innerHeight;
            const w = Math.floor(h / 600 * 1100);
            $(".middle").css("width", w).css("height", h);
        } else {
            $(".middle").css("width", "").css("height", "");
        }
    }
    checkDisplay();
    $(window).resize(checkDisplay);

    if (initDone) {
        initDone();
    }
    return control;
}
