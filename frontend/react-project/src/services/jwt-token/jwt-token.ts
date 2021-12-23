import { FailToast } from "components/React/ToastNotifier/ToastNotifier";
import { getTextByLanguage } from "i18n/i18n";

interface AuthTokenService {
    setToken: Function;
    getAccessToken: Function;
    getRefreshToken: Function;
    clearToken: Function;
}


const [at, rt] = [btoa(btoa("access_token")), btoa(btoa("refresh_token"))]

const encodeToken = (token: string) => {
    try {
        const tokenWithBrowserData = JSON.stringify(token);
        return tokenWithBrowserData;

    } catch (e) {
        console.log("Error encoding token", e);
        return token;
    }
}
const decodeToken = (token: string) => {
    if (!token) return "";


    try { 
        const tkams = JSON.parse(token);
        return tkams;

    } catch (e) {
        console.log("Error decoding token", e);

        clearToken();
        FailToast(getTextByLanguage("Your session has expired.", "तपाईको सत्रको समयावधि सकियो।"))
        return token;
    }
}


function setToken(tokenObj: any) {
    try {
        localStorage.setItem(at, encodeToken(tokenObj));
    }
    catch (e) {
        console.log("Local Store error", e);
    }
}

function getAccessToken(): string {
    let accessToken = "";
    try {
        accessToken = decodeToken(localStorage.getItem(at) || "");
    }
    catch (e) {
        console.log("Local Store error", e);
    }
    return accessToken;
}

function getRefreshToken(): string {
    let refreshToken = "";
    try {
        refreshToken = localStorage.getItem(rt) || "";
    }
    catch (e) {
        console.log("Local Store error", e);
    }
    return refreshToken;
}

function clearToken() {
    localStorage.removeItem(at);
    localStorage.removeItem(rt);
}

const TokenService: AuthTokenService = {
    setToken: setToken,
    getAccessToken: getAccessToken,
    getRefreshToken: getRefreshToken,
    clearToken: clearToken,
};
export default TokenService;
