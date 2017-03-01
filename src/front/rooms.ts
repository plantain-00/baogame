import * as common from "../back/common";

$(".btn-lesson").click((e) => {
    $.get("./createRoom?type=" + $(e.currentTarget).attr("roomtype"), roomId => {
        location.href = "./?roomId=" + roomId;
    });
});
function refresh() {
    $.get("./roomsData", (data) => {
        const roomsData: common.RoomData[] = JSON.parse(data);
        const rooms = [];
        for (const room of roomsData) {
            rooms.push('<a href="/?roomId=' + room.id + '"><div class="room">' + room.name + "[" + room.users + "/" + room.maxUser + "]</div></a>");
        }
        $(".rooms").html("").append(rooms.join(""));
    });
    setTimeout(refresh, 1500);
}
refresh();
