import { Packs } from "../back/JPack";
export { Packs };

export function run(this: any) {
    (window as any).Packs = Packs;
}

run();
