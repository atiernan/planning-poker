import { UserType } from "~/server/Poker/UserType";

export const usePokerStore = defineStore('poker', {
    state: () => ({
        name: '',
        userId: '',
        userType: UserType.Player,
    }),
    persist: {
      storage: persistedState.localStorage,
    },
});