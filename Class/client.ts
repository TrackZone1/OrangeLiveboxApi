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

    async getUsers() {
        return await this.requestAuthentificated({
            service: "UserManagement",
            method: "getUsers",
            parameters: {},
        });
    }

    async getSystemInfoDevice() {
        return await this.requestAuthentificated({
            service: "DeviceInfo",
            method: "get",
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

    getIPv6() {
        return this.requestAuthentificated({
            service: "NMC.IPv6",
            method: "get",
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

    async CloudflareIPS() {
        return (
            (await fetch("https://www.cloudflare.com/ips-v4").then((res) =>
                res.text()
            )) +
            (await fetch("https://www.cloudflare.com/ips-v6").then((res) =>
                res.text()
            ))
        );
    }

    async setPortForwarding(
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
        sourcePrefix: string | null = null
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

        const ips = await this.CloudflareIPS();

        if (sourcePrefix) {
            parameters.sourcePrefix =
                sourcePrefix === "cloudflare"
                    ? ips
                          .split("\n")
                          .map((ip: string) => {
                              return ip;
                          })
                          .join(",")
                    : sourcePrefix;
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

    rebootLivebox() {
        return this.requestAuthentificated({
            service: "NMC",
            method: "reboot",
            parameters: { reason: "GUI_Reboot" },
        });
    }

    reloadConnection() {
        this.requestAuthentificated({
            service: "NeMo.Intf.data",
            method: "setFirstParameter",
            parameters: {
                name: "Enable",
                value: 0,
                flag: "dhcp",
                traverse: "down",
            },
        });

        this.requestAuthentificated({
            service: "NeMo.Intf.data",
            method: "setFirstParameter",
            parameters: {
                name: "Enable",
                value: 1,
                flag: "dhcp",
                traverse: "down",
            },
        });

        return JSON.stringify({ status: null });
    }
}
