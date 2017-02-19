$(".btn-lesson").click((e) => {
    $.get("./createRoom?type=" + $(e.currentTarget).attr("roomtype"), (roomID) => {
        location.href = "./?roomID=" + roomID;
    });
});
function refresh() {
    $.get("./roomsData", (data) => {
        const roomsData: any[] = JSON.parse(data);
        const rooms = [];
        for (const room of roomsData) {
            rooms.push('<a href="/?roomID=' + room.id + '"><div class="room">' + room.name + "[" + room.users + "/" + room.maxUser + "]</div></a>");
        }
        $(".rooms").html("").append(rooms.join(""));
    });
    setTimeout(refresh, 1500);
}
refresh();
