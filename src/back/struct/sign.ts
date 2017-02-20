import * as services from "../services";

export class Sign {
    id: number;
    x: number;
    y: number;
    message: string;
    constructor(public game: services.Game, data: any) {
        this.id = data.id;
        this.x = data.x;
        this.y = data.y;
        this.message = data.message;
    }
    update() {
        // do nothing
    }
    getData() {
        return {
            id: this.id,
            type: "sign",
            x: this.x,
            y: this.y,
            message: this.message,
        };
    }
}
