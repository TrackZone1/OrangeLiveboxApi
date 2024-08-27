<img src="https://c.woopic.com/logo-orange.png" width="100px">
<h1>Orange Livebox Api (30%)</h1>

Get Device Info

```typescript
import { ClientOrange } from "orangeliveboxapi";

const client = new ClientOrange(
    process.env.ORANGE_HOSTNAME ?? "192.168.1.1",
    process.env.ORANGE_USERNAME ?? "admin",
    process.env.ORANGE_PASSWORD ?? ""
);

console.log(await client.getSystemInfoDevice());
/*
{
  status: {
    Manufacturer: "x",
    ManufacturerOUI: "xxxxxxx",
    ModelName: "xxxxxxx",
    Description: "x",
    ProductClass: "x",
    SerialNumber: "xxxxxxxx",
    HardwareVersion: "xxxxxxx",
    SoftwareVersion: "xxxxx",
    RescueVersion: "xxxxxxxxxxx",
    ModemFirmwareVersion: "",
    EnabledOptions: "",
    AdditionalHardwareVersion: "",
    AdditionalSoftwareVersion: "xxxxxxxxxxxxxxxx",
    SpecVersion: "x.x",
    ProvisioningCode: "xxxx.xxxx.xxxx",
    UpTime: xxxx,
    FirstUseDate: "0001-01-01T00:00:00Z",
    DeviceLog: "",
    VendorConfigFileNumberOfEntries: 1,
    ManufacturerURL: "http://www.xxxxxx.xxxx/",
    Country: "xx",
    ExternalIPAddress: "xxx.xxx.xxx.xxx",
    DeviceStatus: "Up",
    NumberOfReboots: xxx,
    UpgradeOccurred: false,
    ResetOccurred: false,
    RestoreOccurred: false,
    StandbyOccurred: false,
    "X_SOFTATHOME-COM_AdditionalSoftwareVersions": "",
    BaseMAC: "xx:xx:xx:xx:xx:xx",
  },
}
*/
```

Retrieve advanced parameters such as temperature, voltage, signal power

```typescript
const systemInfo = await client.getSystemInfoONT();
console.log(systemInfo.status.gpon.veip0);
/*
{
  RegistrationID: "",
  RegistrationIDIsInHexFormat: false,
  VeipPptpUni: true,
  MaxBitRateSupported: 10000,
  SignalRxPower: -17099,
  SignalTxPower: 4291,
  Temperature: 44,
  Voltage: 33028,
  Bias: 23712,
  PonMode: "GPON",
  SerialNumber: "xxxxxxxxxxxx",
  HardwareVersion: "xxxxxxxxxx",
  EquipmentId: "xxxxxxxxxxxxx",
  VendorId: "xxx",
  VendorProductCode: 0,
  ONTSoftwareVersion0: "xxxxxxxxxxxxxx",
  ONTSoftwareVersion1: "xxxxxxxxxxx",
  ONTSoftwareVersionActive: 0,
  LowerOpticalThreshold: -127500,
  UpperOpticalThreshold: -127500,
  LowerTransmitPowerThreshold: -63500,
  UpperTransmitPowerThreshold: -63500,
  Mode: "Normal",
  CustomVendorID: "",
  CustomEquipmentID: "",
  VLANs: "832,2800,851,852,840,838,835",
  RogueOnu: false,
  RogueOnuCount: 0,
  RogueOnuLastOccurence: "0001-01-01T00:00:00Z",
  OnuState: "O5_Operation",
  OnuId: 81,
  PonId: "",
  DownstreamMaxRate: 2488320,
  UpstreamMaxRate: 1244160,
  DownstreamCurrRate: 2488320,
  UpstreamCurrRate: 1244160,
}
*/
```

Creates your port forwarding rules with advanced settings

```typescript
console.log(await client.getPortForwarding());
/*
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
    )
*/
console.log(await client.setPortForwarding("123", 80, 80, "123Server"));
console.log(await client.deletePortForwarding("123"));
```
