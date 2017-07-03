// tslint:disable:object-literal-key-quotes trailing-comma
export const staticProtocolProto = {
    "nested": {
        "protocolPackage": {
            "nested": {
                "Protocol": {
                    "fields": {
                        "kind": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 1
                        },
                        "tick": {
                            "type": "Tick",
                            "id": 2
                        },
                        "initSuccess": {
                            "type": "InitSuccess",
                            "id": 3
                        },
                        "join": {
                            "type": "Join",
                            "id": 4
                        },
                        "joinSuccess": {
                            "type": "JoinSuccess",
                            "id": 5
                        },
                        "control": {
                            "type": "Control",
                            "id": 6
                        },
                        "explode": {
                            "type": "Explode",
                            "id": 7
                        },
                        "userDead": {
                            "type": "UserDead",
                            "id": 8
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
                "InitSuccess": {
                    "fields": {
                        "map": {
                            "rule": "required",
                            "type": "MapData",
                            "id": 1
                        }
                    }
                },
                "Join": {
                    "fields": {
                        "userName": {
                            "rule": "required",
                            "type": "string",
                            "id": 1
                        }
                    }
                },
                "JoinSuccess": {
                    "fields": {
                        "userId": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 1
                        }
                    }
                },
                "Control": {
                    "fields": {
                        "leftDown": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 1
                        },
                        "rightDown": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 2
                        },
                        "upDown": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 3
                        },
                        "downDown": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 4
                        },
                        "itemDown": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 5
                        },
                        "leftPress": {
                            "rule": "required",
                            "type": "bool",
                            "id": 6
                        },
                        "rightPress": {
                            "rule": "required",
                            "type": "bool",
                            "id": 7
                        },
                        "upPress": {
                            "rule": "required",
                            "type": "bool",
                            "id": 8
                        },
                        "downPress": {
                            "rule": "required",
                            "type": "bool",
                            "id": 9
                        },
                        "itemPress": {
                            "rule": "required",
                            "type": "bool",
                            "id": 10
                        }
                    }
                },
                "Explode": {
                    "fields": {
                        "x": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 1
                        },
                        "y": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 2
                        },
                        "power": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 3
                        }
                    }
                },
                "UserDead": {
                    "fields": {
                        "user": {
                            "rule": "required",
                            "type": "User",
                            "id": 1
                        },
                        "killer": {
                            "type": "User",
                            "id": 2
                        }
                    }
                },
                "MapData": {
                    "fields": {
                        "w": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 1
                        },
                        "h": {
                            "rule": "required",
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
                "Ladder": {
                    "fields": {
                        "x": {
                            "rule": "required",
                            "type": "float",
                            "id": 1
                        },
                        "y1": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 2
                        },
                        "y2": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 3
                        }
                    }
                },
                "Door": {
                    "fields": {
                        "x": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 1
                        },
                        "y": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 2
                        }
                    }
                },
                "ItemGate": {
                    "fields": {
                        "x": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 1
                        },
                        "y": {
                            "rule": "required",
                            "type": "float",
                            "id": 2
                        }
                    }
                },
                "User": {
                    "fields": {
                        "itemType": {
                            "type": "uint32",
                            "id": 1
                        },
                        "itemCount": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 2
                        },
                        "nearLadder": {
                            "type": "Ladder",
                            "id": 3
                        },
                        "faceing": {
                            "rule": "required",
                            "type": "int32",
                            "id": 4
                        },
                        "fireing": {
                            "type": "uint32",
                            "id": 5
                        },
                        "grenadeing": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 6
                        },
                        "danger": {
                            "rule": "required",
                            "type": "bool",
                            "id": 7
                        },
                        "status": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 8
                        },
                        "name": {
                            "rule": "required",
                            "type": "string",
                            "id": 9
                        },
                        "id": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 10
                        },
                        "x": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 11
                        },
                        "y": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 12
                        },
                        "vy": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 13
                        },
                        "score": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 14
                        },
                        "dead": {
                            "rule": "required",
                            "type": "bool",
                            "id": 15
                        },
                        "doubleJumping": {
                            "rule": "required",
                            "type": "bool",
                            "id": 16
                        },
                        "flying": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 17
                        }
                    }
                },
                "Item": {
                    "fields": {
                        "x": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 1
                        },
                        "y": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 2
                        },
                        "type": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 3
                        },
                        "dead": {
                            "rule": "required",
                            "type": "bool",
                            "id": 4
                        }
                    }
                },
                "Mine": {
                    "fields": {
                        "x": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 1
                        },
                        "y": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 2
                        },
                        "dead": {
                            "rule": "required",
                            "type": "bool",
                            "id": 3
                        }
                    }
                },
                "Grenade": {
                    "fields": {
                        "x": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 1
                        },
                        "y": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 2
                        },
                        "r": {
                            "rule": "required",
                            "type": "uint32",
                            "id": 3
                        }
                    }
                }
            }
        }
    }
};
export const srcFrontTemplateHtml = `<div><div v-if="showDialog" class="joining"><div class="center"><h4 class="message">{{showFail ? ui.youAreDead : ui.joinGame}}</h4>{{ui.yourName}} <input class="txt-input" v-model="userName" @keydown="stopPropagation($event)" @keyup="stopPropagation($event)"><div><a href="javascript:void(0)" class="btn joinBtn" @click="join()">{{ui.joinByPressE}}</a></div></div></div><div v-if="showMobileControl" class="mobileController"><div class="left"><div data-act="l" class="moreBtn l" @touchstart="touchstart($event)" @touchend="touchend($event)">{{ui.left}}</div><div data-act="r" class="moreBtn r" @touchstart="touchstart($event)" @touchend="touchend($event)">{{ui.right}}</div></div><div class="right"><div data-act="a" class="moreBtn item" @touchstart="touchstart($event)" @touchend="touchend($event)">{{ui.item}}</div><div data-act="u" class="moreBtn up" @touchstart="touchstart($event)" @touchend="touchend($event)">{{ui.up}}</div><div data-act="d" class="moreBtn down" @touchstart="touchstart($event)" @touchend="touchend($event)">{{ui.down}}</div></div></div><div class="notice"><div class="noticeFix"><div class="noticeItem">{{ui.notice}}</div></div></div><div class="fps">fps: {{fps}}</div></div>`;
// tslint:enable:object-literal-key-quotes trailing-comma
