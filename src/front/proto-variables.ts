// tslint:disable:object-literal-key-quotes trailing-comma
export const staticProtocolProto = {
    "nested": {
        "ItemType": {
            "values": {
                "power": 0,
                "gun": 1,
                "mine": 2,
                "drug": 3,
                "hide": 4,
                "bomb": 5,
                "doublejump": 6,
                "flypack": 7,
                "grenade": 8
            }
        },
        "RequestProtocolKind": {
            "values": {
                "join": 2,
                "control": 4
            }
        },
        "ResponseProtocolKind": {
            "values": {
                "tick": 0,
                "initSuccess": 1,
                "joinSuccess": 3,
                "explode": 5,
                "userDead": 6
            }
        },
        "UserStatus": {
            "values": {
                "dieing": 0,
                "climbing": 1,
                "rolling2": 2,
                "standing": 3,
                "rolling": 4,
                "mining": 5,
                "crawling": 6,
                "falling": 7
            }
        },
        "Item": {
            "fields": {
                "x": {
                    "type": "uint32",
                    "id": 1
                },
                "y": {
                    "type": "uint32",
                    "id": 2
                },
                "type": {
                    "type": "ItemType",
                    "id": 3
                },
                "dead": {
                    "type": "bool",
                    "id": 4
                }
            }
        },
        "Mine": {
            "fields": {
                "x": {
                    "type": "uint32",
                    "id": 1
                },
                "y": {
                    "type": "uint32",
                    "id": 2
                },
                "dead": {
                    "type": "bool",
                    "id": 3
                }
            }
        },
        "Grenade": {
            "fields": {
                "x": {
                    "type": "uint32",
                    "id": 1
                },
                "y": {
                    "type": "uint32",
                    "id": 2
                },
                "r": {
                    "type": "uint32",
                    "id": 3
                }
            }
        },
        "User": {
            "fields": {
                "itemType": {
                    "type": "ItemType",
                    "id": 1
                },
                "itemCount": {
                    "type": "uint32",
                    "id": 2
                },
                "nearLadder": {
                    "type": "Ladder",
                    "id": 3
                },
                "faceing": {
                    "type": "int32",
                    "id": 4
                },
                "fireing": {
                    "type": "uint32",
                    "id": 5
                },
                "grenadeing": {
                    "type": "uint32",
                    "id": 6
                },
                "danger": {
                    "type": "bool",
                    "id": 7
                },
                "status": {
                    "type": "UserStatus",
                    "id": 8
                },
                "name": {
                    "type": "string",
                    "id": 9
                },
                "id": {
                    "type": "uint32",
                    "id": 10
                },
                "x": {
                    "type": "uint32",
                    "id": 11
                },
                "y": {
                    "type": "uint32",
                    "id": 12
                },
                "vy": {
                    "type": "uint32",
                    "id": 13
                },
                "score": {
                    "type": "uint32",
                    "id": 14
                },
                "dead": {
                    "type": "bool",
                    "id": 15
                },
                "doubleJumping": {
                    "type": "bool",
                    "id": 16
                },
                "flying": {
                    "type": "uint32",
                    "id": 17
                }
            }
        },
        "Door": {
            "fields": {
                "x": {
                    "type": "uint32",
                    "id": 1
                },
                "y": {
                    "type": "uint32",
                    "id": 2
                }
            }
        },
        "ItemGate": {
            "fields": {
                "x": {
                    "type": "uint32",
                    "id": 1
                },
                "y": {
                    "type": "float",
                    "id": 2
                }
            }
        },
        "Tick": {
            "fields": {
                "users": {
                    "rule": "repeated",
                    "type": "User",
                    "id": 1
                },
                "items": {
                    "rule": "repeated",
                    "type": "Item",
                    "id": 2
                },
                "mines": {
                    "rule": "repeated",
                    "type": "Mine",
                    "id": 3
                },
                "grenades": {
                    "rule": "repeated",
                    "type": "Grenade",
                    "id": 4
                }
            }
        },
        "MapData": {
            "fields": {
                "w": {
                    "type": "uint32",
                    "id": 1
                },
                "h": {
                    "type": "uint32",
                    "id": 2
                },
                "floors": {
                    "rule": "repeated",
                    "type": "uint32",
                    "id": 3
                },
                "ladders": {
                    "rule": "repeated",
                    "type": "Ladder",
                    "id": 4
                },
                "doors": {
                    "rule": "repeated",
                    "type": "Door",
                    "id": 5
                },
                "itemGates": {
                    "rule": "repeated",
                    "type": "ItemGate",
                    "id": 6
                }
            }
        },
        "InitSuccess": {
            "fields": {
                "map": {
                    "type": "MapData",
                    "id": 1
                }
            }
        },
        "Join": {
            "fields": {
                "userName": {
                    "type": "string",
                    "id": 1
                }
            }
        },
        "JoinSuccess": {
            "fields": {
                "userId": {
                    "type": "uint32",
                    "id": 1
                }
            }
        },
        "Control": {
            "fields": {
                "leftDown": {
                    "type": "uint32",
                    "id": 1
                },
                "rightDown": {
                    "type": "uint32",
                    "id": 2
                },
                "upDown": {
                    "type": "uint32",
                    "id": 3
                },
                "downDown": {
                    "type": "uint32",
                    "id": 4
                },
                "itemDown": {
                    "type": "uint32",
                    "id": 5
                },
                "leftPress": {
                    "type": "bool",
                    "id": 6
                },
                "rightPress": {
                    "type": "bool",
                    "id": 7
                },
                "upPress": {
                    "type": "bool",
                    "id": 8
                },
                "downPress": {
                    "type": "bool",
                    "id": 9
                },
                "itemPress": {
                    "type": "bool",
                    "id": 10
                }
            }
        },
        "Explode": {
            "fields": {
                "x": {
                    "type": "uint32",
                    "id": 1
                },
                "y": {
                    "type": "uint32",
                    "id": 2
                },
                "power": {
                    "type": "uint32",
                    "id": 3
                }
            }
        },
        "UserDead": {
            "fields": {
                "user": {
                    "type": "User",
                    "id": 1
                },
                "killer": {
                    "type": "User",
                    "id": 2
                }
            }
        },
        "RequestProtocol": {
            "fields": {
                "kind": {
                    "type": "uint32",
                    "id": 1
                },
                "join": {
                    "type": "Join",
                    "id": 2
                },
                "control": {
                    "type": "Control",
                    "id": 3
                }
            }
        },
        "ResponseProtocol": {
            "fields": {
                "kind": {
                    "type": "uint32",
                    "id": 1
                },
                "initSuccess": {
                    "type": "InitSuccess",
                    "id": 2
                },
                "joinSuccess": {
                    "type": "JoinSuccess",
                    "id": 3
                },
                "tick": {
                    "type": "Tick",
                    "id": 4
                },
                "explode": {
                    "type": "Explode",
                    "id": 5
                },
                "userDead": {
                    "type": "UserDead",
                    "id": 6
                }
            }
        },
        "Ladder": {
            "fields": {
                "x": {
                    "type": "float",
                    "id": 1
                },
                "y1": {
                    "type": "uint32",
                    "id": 2
                },
                "y2": {
                    "type": "uint32",
                    "id": 3
                }
            }
        }
    }
};
export const srcFrontTemplateHtml = `<div><div v-if="showDialog" class="joining"><div class="center"><h4 class="message">{{showFail ? locale.ui.youAreDead : locale.ui.joinGame}}</h4>{{locale.ui.yourName}} <input class="txt-input" v-model="userName" @keydown="stopPropagation($event)" @keyup="stopPropagation($event)"><div><a href="javascript:void(0)" class="btn joinBtn" @click="join()">{{locale.ui.joinByPressE}}</a></div></div></div><div v-if="showMobileControl" class="mobileController"><div class="left"><div data-act="l" class="moreBtn l" @touchstart="touchstart($event)" @touchend="touchend($event)">{{locale.ui.left}}</div><div data-act="r" class="moreBtn r" @touchstart="touchstart($event)" @touchend="touchend($event)">{{locale.ui.right}}</div></div><div class="right"><div data-act="a" class="moreBtn item" @touchstart="touchstart($event)" @touchend="touchend($event)">{{locale.ui.item}}</div><div data-act="u" class="moreBtn up" @touchstart="touchstart($event)" @touchend="touchend($event)">{{locale.ui.up}}</div><div data-act="d" class="moreBtn down" @touchstart="touchstart($event)" @touchend="touchend($event)">{{locale.ui.down}}</div></div></div><div class="notice"><div class="noticeFix"><div class="noticeItem">{{locale.ui.notice}}</div></div></div><div class="fps">fps: {{fps}}</div></div>`;
// tslint:enable:object-literal-key-quotes trailing-comma
