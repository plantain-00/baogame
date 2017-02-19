import { connect, emit } from "./socket";
import { Packs } from "./JPack";

const code = localStorage.getItem("code");

connect(undefined, () => {
    emit("init", { code });
}, (name, data) => {
    if (name === "initFail") {
        alert("fail");
    } else if (name === "tick") {
        for (let i = 0; i < data.users.length; i++) {
            data.users[i] = Packs.userPack.decode(data.users[i]);
        }
        for (let i = 0; i < data.items.length; i++) {
            data.items[i] = Packs.itemPack.decode(data.items[i]);
        }
        for (let i = 0; i < data.mines.length; i++) {
            data.mines[i] = Packs.minePack.decode(data.mines[i]);
        }
        let html = '<div class="clients">';
        if (data.clients) {
            data.clients.forEach((client: any) => {
                let p1: any = null;
                data.users.forEach((user: any) => {
                    if (client.p1 === user.id) {
                        p1 = user;
                        return;
                    }
                });
                let playerData: string;
                if (p1) {
                    playerData = `<div class="player">
					${p1.status},${p1.score}<br/>
					${p1.carry || "空"} : ${p1.carryCount}
				</div>`;
                } else if (client.admin) {
                    playerData = '<div class="player">admin</div>';
                } else {
                    playerData = '<div class="player">ob</div>';
                }
                let banBtn: string;
                if (client.banned) {
                    banBtn = '<a data-clientid="' + client.id + '" class="btn ban banned">取消ban</a>';
                } else {
                    banBtn = '<a data-clientid="' + client.id + '" class="btn ban">ban</a>';
                }
                html += `<div class="user">
				<div class="client">
					名称: ${client.name}<br>
					IP: ${client.ip}<br>
					KDH: ${client.kill},${client.death},${client.highestKill}
				</div>
				${playerData}
				<div class="action">${banBtn}</div>
			</div>`;
            });
        }
        $(".users").html(html);
    }
});

$(".users").on("click", ".btn.ban", (e) => {
    const $t = $(e.currentTarget);
    const clientid = $t.data("clientid");
    if ($t.is(".banned")) {
        emit("unban", clientid);
        $t.removeClass("banned");
    } else {
        emit("ban", clientid);
        $t.addClass("banned");
    }
});
$(".items .btn").click((e) => {
    const type = $(e.currentTarget).data("type");
    emit("createItem", type);
});
$(".btn-heap").click(() => {
    emit("heapdump");
});

$.ajax({
    url: "/roomsData",
    success(t) {
        const count = JSON.parse(t).length;
        if (count < 2) { return; }
        $(".rooms").append('<span class="active">1</span>');
        for (let i = 1; i < count; i++) {
            $(".rooms").append("<span>" + (i + 1) + "</span>");
        }
    },
});
