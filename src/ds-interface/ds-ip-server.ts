import { Server, Socket } from "net";
import { Address4 } from "ip-address";

const DS_IP_INTERFACE_PORT: number = 1742;

export default class DSServer {
    private _ipAddrString: string = "";
    private _ipAddrNum: number = 0;

    private _server: Server;

    private _activeSockets: Socket[] = [];

    public updateRobotCodeIpV4Addr(newIp: string | null): void {
        if (newIp !== this._ipAddrString) {
            if (newIp === null) {
                this._ipAddrString = "";
                this._ipAddrNum = 0;
            }
            else {
                if (!Address4.isValid(newIp)) {
                    console.log("[DS-INTERFACE] Invalid IP address provided");
                    return;
                }

                this._ipAddrString = newIp;
                const addr = new Address4(newIp);
                const addrArray = addr.toArray();
                const addrBuf: Buffer = Buffer.alloc(4);
                for (let i = 0; i < 4; i++) {
                    addrBuf[i] = addrArray[i];
                }
                this._ipAddrNum = addrBuf.readUInt32BE();
            }

            console.log(`[DS-INTERFACE] Advertised NT Server address updated to: ${this._ipAddrString}`);

            this._informAllClients();
        }
    }

    public start() {
        this._server = new Server((socket) => {
            this._activeSockets.push(socket);
            this._informClient(socket);

            console.log(`[DS-INTERFACE] New DS Server connection. Total number of connections: ${this._activeSockets.length}`);

            socket.once("close", (hadError) => {
                for (let i = 0; i < this._activeSockets.length; i++) {
                    if (this._activeSockets[i] === socket) {
                        console.log("[DS-INTERFACE] Socket removed");
                        this._activeSockets.splice(i, 1);
                        break;
                    }
                }
            });
        });

        this._server.listen(DS_IP_INTERFACE_PORT);
        console.log(`[DS-INTERFACE] Server Ready on port ${DS_IP_INTERFACE_PORT}`);
    }

    public stop() {
        if (this._server && this._server.listening) {
            console.log("[DS-INTERFACE] Server Closing");
            this._server.close();
            this._server = undefined;
        }
    }

    private _informAllClients() {
        console.log(`[DS-INTERFACE] Informing ${this._activeSockets.length} client(s) of updated NT Server IP`);
        this._activeSockets.forEach(socket => {
            this._informClient(socket);
        });
    }

    private _informClient(socket: Socket) {
        socket.write(`{"robotIP":${this._ipAddrNum}}\n`);
    }
}
