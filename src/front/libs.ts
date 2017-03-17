import * as Vue from "vue";
import { Reconnector } from "reconnection/browser";

export { Vue, Reconnector };

export type App = {
    userName: string;
    showDialog: boolean;
    showFail: boolean;
    showMobileControl: boolean;
    join: () => void;
    close: () => void;
} & Vue;
