import { NetworkTableEntry } from "node-ntcore";
import LogUtil from "../../../../utils/logging/log-util";
import CustomDevice, { IOInterfaces, RobotHardwareInterfaces } from "../custom-device";
import SimTalonSrx, {ControlMode} from "./sim-talon-srx";

const DEVICE_IDENT: string = "CAN-Talon-SRX";

const logger = LogUtil.getLogger(DEVICE_IDENT);

export default class CanTalonSRX extends CustomDevice {
    private outputValue: number = 0.0;
    private controlMode: ControlMode = ControlMode.Disabled;

    private _simDevice: SimTalonSrx;

    private _ntEntryControlMode: NetworkTableEntry;
    private _ntEntryOutputValue: NetworkTableEntry;

    constructor(robotHW: RobotHardwareInterfaces) {
        super(DEVICE_IDENT, false, robotHW, true);
    }

    public get ioInterfaces(): IOInterfaces {
        // Returning an empty object since this uses SimDevice + NT
        return {
            simDevices: [this._simDevice]
        };
    }
    public update(): void {
        throw new Error("Method not implemented.");
    }

}