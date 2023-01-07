import {Context} from "@nuxt/types";

export default function (context: Context) {
    const players = context.store.getters["game/getPlayers"];

    if (!players.length) {
        return context.redirect('/');
    }
}
