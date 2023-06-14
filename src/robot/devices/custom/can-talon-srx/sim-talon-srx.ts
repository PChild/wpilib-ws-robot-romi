import { SimDevice, FieldDirection } from "@wpilib/wpilib-ws-robot";

export enum ControlMode {
    PercentOutput = 0,
	Position = 1,
	Velocity = 2,
	Current = 3,
	Follower = 5,
	MotionProfile = 6,
	MotionMagic = 7,
	MotionProfileArc = 10,
	MusicTone = 13,
	Disabled = 15
}


export default class SimTalonSrx extends SimDevice {
    constructor(canID: number) {
        super("CAN-Talon-SRX", canID);

        this.registerField("controlMode", FieldDirection.OUTPUT_FROM_ROBOT_CODE, ControlMode.Disabled);
        this.registerField("outputValue", FieldDirection.OUTPUT_FROM_ROBOT_CODE, 0.0);

    }

    public set controlMode(value: number) {
        this.setValue("controlMode", value);
    }

    public set outputValue(value: number) {
        this.setValue("outputValue", value);
    }

}