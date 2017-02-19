import { Packs } from "../back/Jpack";
export { Packs };


export function run(this: any) {
    (window as any).Packs = Packs;
}

run();
