export const constant = {
    tileWidth: 40,
    tileHeight: 40,
    itemSize: 15,
};

export type InProtocol =
    {
        name: "init";
        data: {
            code?: string;
            userName?: string;
        };
    }
    |
    {
        name: "join";
        data: {
            p1: any;
            p2?: any;
            userName: string;
        };
    }
    |
    {
        name: "control";
        data: any[];
    }
    |
    {
        name: "createItem";
        data: number;
    }
    |
    {
        name: "ban";
        data: number;
    }
    |
    {
        name: "unban";
        data: number;
    };

export type OutProtocol =
    {
        name: "initFail";
        data?: undefined;
    }
    |
    {
        name: "init";
        data: {
            props: any;
            map: {
                floor: any;
                pilla: any;
                structs: {
                    id: number;
                    type: string,
                    x: number;
                    y: number;
                }[];
            }
            bodies: any[];
        }
    }
    |
    {
        name: "joinFail";
        data: string;
    }
    |
    {
        name: "joinSuccess";
        data: {
            p1: any;
        };
    }
    |
    {
        name: "tick";
        data: {
            users: any[];
            items: any[];
            mines: any[];
            clients?: any[];
            entitys?: any[];
            p1?: number | null | undefined;
            onStruct?: number | null | undefined;
            p2?: number | null | undefined;
        };
    }
    |
    {
        name: "explode";
        data: {
            x: number;
            y: number;
            power: number;
        };
    }
    |
    {
        name: "win";
        data: number;
    }
    |
    {
        name: "userDead";
        data: {
            user: any[];
            killer: any[] | undefined;
            message: string;
        };
    };
