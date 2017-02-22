import * as services from "./services";
import * as common from "./common";

export class Sign {
    x: number;
    y: number;
    message: string;
    constructor(public game: services.Game, data: common.SignProtocol) {
        this.x = data.x;
        this.y = data.y;
        this.message = data.message;
    }
    update() {
        // do nothing
    }
    getData(): common.SignProtocol {
        return {
            x: this.x,
            y: this.y,
            message: this.message,
        };
    }
}
