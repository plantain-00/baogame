import { connect, emit, getUrlParameter } from "./socket";

const code = getUrlParameter("code");
const roomId = +getUrlParameter("roomId");

connect(roomId, () => {
    emit({ kind: "adminInit", adminInit: { code } });
}, protocol => {
    if (protocol.kind === "adminInitFail") {
        alert("wrong admin code.");
    } else if (protocol.kind === "adminTick") {
        let html = '<div class="clients">';
        if (protocol.adminTick.clients) {
            for (const client of protocol.adminTick.clients) {
                let p1: any = null;
                protocol.adminTick.users.forEach(user => {
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
            }
        }
        $(".users").html(html);
    }
});

$(".users").on("click", ".btn.ban", (e) => {
    const $t = $(e.currentTarget);
    const clientId = +$t.data("clientid");
    if ($t.is(".banned")) {
        emit({ kind: "unban", unban: { clientId } });
        $t.removeClass("banned");
    } else {
        emit({ kind: "ban", ban: { clientId } });
        $t.addClass("banned");
    }
});
$(".items .btn").click((e) => {
    const type = $(e.currentTarget).data("type");
    emit({ kind: "createItem", createItem: { type } });
});

$.ajax({
    url: "/roomsData",
    dataType: "json",
    success(roomsData: any[]) {
        const roomElement = $(".rooms");
        for (let i = 0; i < roomsData.length; i++) {
            roomElement.append(`<span>${i + 1}</span>`);
        }
    },
});
