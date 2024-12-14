import { LoginService, LoginRequestData, LoginResponseData } from "./interface";

export class LoginApiService extends LoginService {
  // the promise of the refresh operation so that concurrent requests can share the result
  private refreshPromise: Promise<LoginResponseData | null> | null = null;

  public async login(payload: LoginRequestData): Promise<LoginResponseData> {
    const response: LoginResponseData = await this.fetchPost(
      "/login/",
      { method: "POST" },
      payload
    );

    this.storeInLocalStorage(response);

    return response;
  }

  public logout() {
    this.removeFromLocalStorage();
  }

  public async getCurrentToken(): Promise<LoginResponseData | null> {
    return this.retrieveFromLocalStorage();
  }

  public async getValidToken(): Promise<LoginResponseData | null> {
    const token = await this.getCurrentToken();
    if (!token || !token.access) {
      this.logout();
      return null;
    }

    try {
      const parsedToken = this.parseJwt(token?.access);

      if (new Date().getTime() / 1000 > parsedToken.exp) {
        // if a refresh is already in progress, return the ongoing promise, otherwise initiate the refreshAccessToken promise
        return (
          this.refreshPromise ??
          (this.refreshPromise = this.refreshAccessToken(token.refresh))
        );
      }
    } catch (e) {
      console.log(e);
      this.logout();
    }
    return null;
  }

  private async refreshAccessToken(
    refreshToken: string
  ): Promise<LoginResponseData | null> {
    try {
      const response: LoginResponseData = await this.fetchPost(
        "/refresh/",
        { method: "POST" },
        { refresh: refreshToken }
      );

      this.storeInLocalStorage(response);
      return this.retrieveFromLocalStorage();
    } catch (error) {
      console.error("Token refresh failed", error);
      throw error;
    } finally {
      // reset state after refresh is complete
      this.refreshPromise = null;
    }
  }

  private loginDataKey = "loginData";

  private storeInLocalStorage = (payload: LoginResponseData) => {
    localStorage.setItem(this.loginDataKey, JSON.stringify(payload));
  };

  private retrieveFromLocalStorage = (): LoginResponseData | null => {
    try {
      const serializedLoginData = localStorage.getItem(this.loginDataKey);
      if (!serializedLoginData) {
        throw new Error("Not logged in");
      }
      return JSON.parse(serializedLoginData);
    } catch {
      return null;
    }
  };

  private removeFromLocalStorage = (): void => {
    localStorage.removeItem(this.loginDataKey);
  };

  // https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
  private parseJwt(token: string) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }
}
