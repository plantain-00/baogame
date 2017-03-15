import * as Vue from "vue";

export { Vue };

export type App = {
    notices: string[];
    userName: string;
    showDialog: boolean;
    showFail: boolean;
    showMobileControl: boolean;
    join: () => void;
    close: () => void;
} & Vue;
