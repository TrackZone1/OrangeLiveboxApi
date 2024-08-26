export class Client {
    hostname: string;
    username: string;
    password: string;
    constructor(hostname:string, username: string, password: string) {
        this.hostname = hostname;
        this.username = username;
        this.password = password;
    }

    async login() {
        const response = await fetch(`http://${this.hostname}/ws`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-sah-ws-4-call+json",
                "Authorization": "X-Sah-Login"
               },
            body: JSON.stringify({
                "service": "sah.Device.Information",
                "method": "createContext",
                "parameters": {
                    "applicationName": "webui",
                    "username": this.username,
                    "password": this.password
                }
            })
        });

        const json = await response.json();
        const cookie = response.headers.get('set-cookie');
        if (!json.data.contextID || !cookie) {
            throw new Error('Login failed');
        }
        
        return JSON.stringify({ cookie: cookie?.split(";")[0], authorization: `X-Sah ${json.data.contextID}` });
    }

    async getSystemInfo() {
        const login = JSON.parse(await this.login());
        const response = await fetch(`http://${this.hostname}/ws`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/x-sah-ws-4-call+json",
                "Authorization": login.authorization,
                "Cookie": login.cookie
               },
            body: JSON.stringify({
                "service":"DeviceInfo",
                "method":"get",
                "parameters":{}
            })
        });

        const json = await response.json();

        console.log(json);
    }
}