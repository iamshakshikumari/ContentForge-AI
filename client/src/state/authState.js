import { atom } from "recoil";

export const authState = atom({
    key: "authStateKey",
    default: {
        isLoggedIn: false,
        username: "",
        userId: null,
        loading: true,
    },
});
