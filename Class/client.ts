export class ClientOrange {
    hostname: string;
    username: string;
    password: string;
    constructor(hostname: string, username: string, password: string) {
        this.hostname = hostname;
        this.username = username;
        this.password = password;
    }

    async login() {
        const response = await fetch(`http://${this.hostname}/ws`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-sah-ws-4-call+json",
                Authorization: "X-Sah-Login",
            },
            body: JSON.stringify({
                service: "sah.Device.Information",
                method: "createContext",
                parameters: {
                    applicationName: "webui",
                    username: this.username,
                    password: this.password,
                },
            }),
        });

        const json = await response.json();
        const cookie = response.headers.get("set-cookie");
        if (!json.data.contextID || !cookie) {
            throw new Error("Login failed");
        }

        return JSON.stringify({
            cookie: cookie?.split(";")[0],
            authorization: `X-Sah ${json.data.contextID}`,
        });
    }

    async requestAuthentificated(body: any) {
        const login = JSON.parse(await this.login());
        const response = await fetch(`http://${this.hostname}/ws`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-sah-ws-4-call+json",
                Authorization: login.authorization,
                Cookie: login.cookie,
            },
            body: JSON.stringify(body),
        });

        return response.json();
    }

    async getDeviceInfo() {
        return await this.requestAuthentificated({
            service: "DeviceInfo",
            method: "get",
            parameters: {},
        });
    }

    async getCurrentUser() {
        return await this.requestAuthentificated({
            service: "HTTPService",
            method: "getCurrentUser",
            parameters: {},
        });
    }

    async getSystemInfoVoIPConfig() {
        return await this.requestAuthentificated({
            service: "NMC",
            method: "getVoIPConfig",
            parameters: {},
        });
    }

    async getSystemInfoVoiIP() {
        return await this.requestAuthentificated({
            service: "VoiceService.VoiceApplication",
            method: "listTrunks",
            parameters: {},
        });
    }

    async getSystemInfoUSB() {
        return await this.requestAuthentificated({
            service: "Devices",
            method: "get",
            parameters: { expression: "usb", flags: "down" },
        });
    }

    async getSystemInfoIPTVStatus() {
        return await this.requestAuthentificated({
            service: "NMC.OrangeTV",
            method: "getIPTVStatus",
            parameters: {},
        });
    }

    async getSystemInfoIPTVConfig() {
        return await this.requestAuthentificated({
            service: "NMC.OrangeTV",
            method: "getIPTVConfig",
            parameters: {},
        });
    }

    async getSystemInfoONT() {
        return await this.requestAuthentificated({
            service: "NeMo.Intf.veip0",
            method: "getMIBs",
            parameters: { mibs: "gpon" },
        });
    }

    getStaticLeases() {
        return this.requestAuthentificated({
            service: "DHCPv4.Server.Pool.default",
            method: "getStaticLeases",
            parameters: {},
        });
    }

    getOnlineDevices() {
        return this.requestAuthentificated({
            service: "Devices",
            method: "get",
            parameters: {
                expression: {
                    ETHERNET:
                        "not interface and not self and eth and .Active==true",
                    WIFI: "not interface and not self and wifi and .Active==true",
                },
            },
        });
    }

    getPortForwarding() {
        return this.requestAuthentificated({
            service: "Firewall",
            method: "getPortForwarding",
            parameters: {},
        });
    }

    setPortForwarding(
        id: string,
        internalPort: number,
        externalPort: number,
        destinationIPAddress: string,
        enable = true,
        persistent = true,
        protocol = "6,17", // Allow 6 = TCP & 17 = UDP
        description = "", // Name Equipment
        sourceInterface = "data",
        destinationMACAddress = "",
        sourcePrefix = false
    ) {
        const parameters: any = {
            id,
            internalPort,
            externalPort,
            destinationIPAddress,
            enable,
            persistent,
            protocol,
            description,
            sourceInterface,
            destinationMACAddress,
            origin: "webui",
        };

        if (sourcePrefix) {
            parameters.sourcePrefix = sourcePrefix;
        }

        return this.requestAuthentificated({
            service: "Firewall",
            method: "setPortForwarding",
            parameters,
        });
    }

    deletePortForwarding(id: string) {
        return this.requestAuthentificated({
            service: "Firewall",
            method: "deletePortForwarding",
            parameters: {
                id,
                origin: "webui",
            },
        });
    }
}
