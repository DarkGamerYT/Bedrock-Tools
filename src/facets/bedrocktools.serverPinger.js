/**
 * Implementation of the RakNet ping/pong protocol.
 * @see https://wiki.vg/Raknet_Protocol#Unconnected_Ping
 *
 * Data types:
 * @see https://wiki.vg/Raknet_Protocol#Data_types
 */

const dgram = require( "dgram" );
const ByteBuffer = require( "bytebuffer" );
const motdParser = require( "@sfirew/minecraft-motd-parser" );

const START_TIME = new Date().getTime();

/**
 * Decode Unconnected Ping
 * @param {number} pingId
 * @returns {import('bytebuffer')}
 * @see https://wiki.vg/Raknet_Protocol#Unconnected_Ping
 */
const UNCONNECTED_PING = (pingId) => {
    // 0x01
    const bb = new ByteBuffer();
    bb.buffer[0] = 0x01;
    bb.offset = 1;
    return bb.writeLong(pingId).append( "00ffff00fefefefefdfdfdfd12345678", "hex").writeLong(0).flip().compact();
};

/**
 * Decode Unconnected Pong
 * @param {import('bytebuffer')} buffer
 * @see https://wiki.vg/Raknet_Protocol#Unconnected_Pong
 */
const UNCONNECTED_PONG = (buffer) => {
    // 0x1c
    buffer.offset = 1;
    const pingId = buffer.readLong();
    const serverId = buffer.readLong();
    const offset = buffer.offset += 16;
    const nameLength = buffer.readShort();
    let advertiseStr;

    try {
        advertiseStr = buffer.readUTF8String(nameLength);
    } catch (err) {
        advertiseStr = buffer.readUTF8String(parseInt(err.message.substr(err.message.indexOf( "," ) + 2, 3)));
    };

    advertiseStr = advertiseStr.split(/;/g);
    const gameId = advertiseStr[0];
    const description = advertiseStr[1];
    const protocolVersion = advertiseStr[2];
    const gameVersion = advertiseStr[3];
    const currentPlayers = advertiseStr[4];
    const maxPlayers = advertiseStr[5];
	const gameServerId = advertiseStr[6];
    const name = advertiseStr[7];
    const mode = advertiseStr[8];

    return {
        advertiseStr,
        serverId: gameServerId,
        offset,
        gameId,
        description,
        protocolVersion,
        gameVersion,
        currentPlayers,
        maxPlayers,
        name,
        mode,
    };
};

const ping = (host, port = 19132, cb, timeout = 1000) => {
    const socket = dgram.createSocket( "udp4" );

    // Set manual timeout interval.
    // This ensures the connection will NEVER hang regardless of internal state
    const timeoutTask = setTimeout(
		() => socket.emit("error", new Error("Socket timeout")), timeout
	);

    const closeSocket = () => {
        try {
            socket.close();
        } catch(e) {};
        clearTimeout(timeoutTask);
    };

    // Generic error handler
    // This protects multiple error callbacks given the complex socket state
    // This is mostly dangerous since it can swallow errors
    let didFireError = false;
    const handleError = (err) => {
        if (!didFireError) {
            didFireError = true;
            cb(null, { ip: "127.0.0.1", hostname: host, port, online: false });
        };

        closeSocket();
    };

	const START_PING = Date.now();
    try {
        const ping = UNCONNECTED_PING(new Date().getTime() - START_TIME);
        socket.send(ping.buffer, 0, ping.buffer.length, port, host);
    } catch (err) {
        handleError(err);
    };

    socket.on(
		"message", (msg, rinfo) => {
			const buffer = new ByteBuffer().append(msg, "hex").flip();
			const id = buffer.buffer[0];

			switch (id) {
				// https://wiki.vg/Raknet_Protocol#Unconnected_Ping
				case 0x1c: {
					const pong = UNCONNECTED_PONG( buffer );
					const clientData = {
						ip: rinfo.address,
						hostname: host,
						port: port,
						online: true,
						serverId: pong.serverId,
						ping: Date.now() - START_PING,
						players: {
							online: Number(pong.currentPlayers),
							max: Number(pong.maxPlayers),
						},
						motd: {
							raw: pong.description,
							clean: motdParser.cleanCodes(pong.description),
							html: bedrockMotd(motdParser.textToHTML(pong.description)),
						},
						protocol: Number(pong.protocolVersion),
						version: pong.gameVersion,
						gameId: pong.gameId,
						map: pong.name,
						gamemode: pong.mode,
					};

					// Close the socket and clear the timeout task
					// This is a general cleanup for success conditions
					closeSocket();
					cb(null, clientData);
					break;
				};

				default: {
					handleError(new Error( "Received unexpected packet" ));
					break;
				};
			}
    	},
	);

    socket.on("error", (err) => handleError(err));
};

module.exports = {
    /**
     * @typedef { { hostname: string; port?: number; timeout?: number } } PingOptions
     * @param { PingOptions } options
     */
    pingServer: (options = {}) => {
        const { hostname, port = 19132, timeout = 8500 } = options;
        if (!hostname) throw new Error( "Host argument is not provided" );
        return new Promise(
            (resolve, reject) => {
                ping(
                    hostname, port, (err, res) => err ? reject(err) : resolve(res), timeout
                );
            },
        );
    },
};

const motdUnicode = (image, unicode) => (`<img src="assets/fonts/${image}.png" alt="${unicode}" class="motdUnicode" draggable="false">`);
const bedrockMotd = (motd) => {
	return motd
		.replace( /\ue000/g, motdUnicode( "xbox-a", "\ue000" ) )
		.replace( /\ue001/g, motdUnicode( "xbox-b", "\ue001" ) )
		.replace( /\ue002/g, motdUnicode( "xbox-x", "\ue002" ) )
		.replace( /\ue003/g, motdUnicode( "xbox-y", "\ue003" ) )
		.replace( /\ue004/g, motdUnicode( "xbox-lb", "\ue004" ) )
		.replace( /\ue005/g, motdUnicode( "xbox-rb", "\ue005" ) )
		.replace( /\ue006/g, motdUnicode( "xbox-lt", "\ue006" ) )
		.replace( /\ue007/g, motdUnicode( "xbox-rt", "\ue007" ) )
		.replace( /\ue008/g, motdUnicode( "xbox-select", "\ue008" ) )
		.replace( /\ue009/g, motdUnicode( "xbox-start", "\ue009" ) )
		.replace( /\ue00a/g, motdUnicode( "xbox-ls", "\ue00a" ) )
		.replace( /\ue00b/g, motdUnicode( "xbox-rs", "\ue00b" ) )
		.replace( /\ue00c/g, motdUnicode( "xbox-d-up", "\ue00c" ) )
		.replace( /\ue00d/g, motdUnicode( "xbox-d-left", "\ue00d" ) )
		.replace( /\ue00e/g, motdUnicode( "xbox-d-down", "\ue00e" ) )
		.replace( /\ue00f/g, motdUnicode( "xbox-d-right", "\ue00f" ) )
		.replace( /\ue010/g, motdUnicode( "xbox-a-bright", "\ue010" ) )
		.replace( /\ue011/g, motdUnicode( "xbox-b-bright", "\ue011" ) )
		.replace( /\ue012/g, motdUnicode( "xbox-x-bright", "\ue012" ) )
		.replace( /\ue013/g, motdUnicode( "xbox-y-bright", "\ue013" ) )
		.replace( /\ue014/g, motdUnicode( "jump", "\ue014" ) )
		.replace( /\ue015/g, motdUnicode( "attack", "\ue015" ) )
		.replace( /\ue016/g, motdUnicode( "joystick", "\ue016" ) )
		.replace( /\ue017/g, motdUnicode( "crosshair", "\ue017" ) )
		.replace( /\ue018/g, motdUnicode( "interact", "\ue018" ) )
		.replace( /\ue019/g, motdUnicode( "crouch", "\ue019" ) )
		.replace( /\ue01a/g, motdUnicode( "sprint", "\ue01a" ) )
		.replace( /\ue01b/g, motdUnicode( "fly-up", "\ue01b" ) )
		.replace( /\ue01c/g, motdUnicode( "fly-down", "\ue01c" ) )
		.replace( /\ue01d/g, motdUnicode( "dismount", "\ue01d" ) )
		.replace( /\ue020/g, motdUnicode( "ps-x", "\ue020" ) )
		.replace( /\ue021/g, motdUnicode( "ps-o", "\ue021" ) )
		.replace( /\ue022/g, motdUnicode( "ps-square", "\ue022" ) )
		.replace( /\ue023/g, motdUnicode( "ps-triangle", "\ue023" ) )
		.replace( /\ue024/g, motdUnicode( "ps-l1", "\ue024" ) )
		.replace( /\ue025/g, motdUnicode( "ps-r1", "\ue025" ) )
		.replace( /\ue026/g, motdUnicode( "ps-l2", "\ue026" ) )
		.replace( /\ue027/g, motdUnicode( "ps-r2", "\ue027" ) )
		.replace( /\ue028/g, motdUnicode( "ps-select", "\ue028" ) )
		.replace( /\ue029/g, motdUnicode( "ps-start", "\ue029" ) )
		.replace( /\ue02a/g, motdUnicode( "ps-l3", "\ue02a" ) )
		.replace( /\ue02b/g, motdUnicode( "ps-r3", "\ue02b" ) )
		.replace( /\ue02c/g, motdUnicode( "ps-d-up", "\ue02c" ) )
		.replace( /\ue02d/g, motdUnicode( "ps-d-left", "\ue02d" ) )
		.replace( /\ue02e/g, motdUnicode( "ps-d-down", "\ue02e" ) )
		.replace( /\ue02f/g, motdUnicode( "ps-d-right", "\ue02f" ) )
		.replace( /\ue040/g, motdUnicode( "nintendo-a", "\ue040" ) )
		.replace( /\ue041/g, motdUnicode( "nintendo-b", "\ue041" ) )
		.replace( /\ue042/g, motdUnicode( "nintendo-x", "\ue042" ) )
		.replace( /\ue043/g, motdUnicode( "nintendo-y", "\ue043" ) )
		.replace( /\ue044/g, motdUnicode( "nintendo-l", "\ue044" ) )
		.replace( /\ue045/g, motdUnicode( "nintendo-r", "\ue045" ) )
		.replace( /\ue046/g, motdUnicode( "nintendo-zl", "\ue046" ) )
		.replace( /\ue047/g, motdUnicode( "nintendo-zr", "\ue047" ) )
		.replace( /\ue048/g, motdUnicode( "nintendo-minus", "\ue048" ) )
		.replace( /\ue049/g, motdUnicode( "nintendo-plus", "\ue049" ) )
		.replace( /\ue04a/g, motdUnicode( "nintendo-ls", "\ue04a" ) )
		.replace( /\ue04b/g, motdUnicode( "nintendo-rs", "\ue04b" ) )
		.replace( /\ue04c/g, motdUnicode( "nintendo-d-up", "\ue04c" ) )
		.replace( /\ue04d/g, motdUnicode( "nintendo-d-left", "\ue04d" ) )
		.replace( /\ue04e/g, motdUnicode( "nintendo-d-down", "\ue04e" ) )
		.replace( /\ue04f/g, motdUnicode( "nintendo-d-right", "\ue04f" ) )
		.replace( /\ue060/g, motdUnicode( "left-mouse", "\ue060" ) )
		.replace( /\ue061/g, motdUnicode( "right-mouse", "\ue061" ) )
		.replace( /\ue062/g, motdUnicode( "middle-mouse", "\ue062" ) )
		.replace( /\ue063/g, motdUnicode( "mouse", "\ue063" ) )
		.replace( /\ue065/g, motdUnicode( "forward-arrow-new", "\ue065" ) )
		.replace( /\ue066/g, motdUnicode( "right-arrow-new", "\ue066" ) )
		.replace( /\ue067/g, motdUnicode( "down-arrow-new", "\ue067" ) )
		.replace( /\ue068/g, motdUnicode( "left-arrow-new", "\ue068" ) )
		.replace( /\ue069/g, motdUnicode( "jump-button-new", "\ue069" ) )
		.replace( /\ue06a/g, motdUnicode( "crouch-button-new", "\ue06a" ) )
		.replace( /\ue06b/g, motdUnicode( "inventory-button-new", "\ue06b" ) )
		.replace( /\ue06c/g, motdUnicode( "fly-up-button-new", "\ue06c" ) )
		.replace( /\ue06d/g, motdUnicode( "fly-down-button-new", "\ue06d" ) )
		.replace( /\ue070/g, motdUnicode( "left-mouse-new", "\ue070" ) )
		.replace( /\ue071/g, motdUnicode( "right-mouse-new", "\ue071" ) )
		.replace( /\ue072/g, motdUnicode( "middle-mouse-new", "\ue072" ) )
		.replace( /\ue073/g, motdUnicode( "mouse-new", "\ue073" ) )
		.replace( /\ue080/g, motdUnicode( "forward-arrow", "\ue080" ) )
		.replace( /\ue081/g, motdUnicode( "left-arrow", "\ue081" ) )
		.replace( /\ue082/g, motdUnicode( "down-arrow", "\ue082" ) )
		.replace( /\ue083/g, motdUnicode( "right-arrow", "\ue083" ) )
		.replace( /\ue084/g, motdUnicode( "jump-button", "\ue084" ) )
		.replace( /\ue085/g, motdUnicode( "crouch-button", "\ue085" ) )
		.replace( /\ue086/g, motdUnicode( "fly-up-button", "\ue086" ) )
		.replace( /\ue087/g, motdUnicode( "fly-down-button", "\ue087" ) )
		.replace( /\ue0a0/g, motdUnicode( "craftable-on", "\ue0a0" ) )
		.replace( /\ue0a1/g, motdUnicode( "craftable-off", "\ue0a1" ) )
		.replace( /\ue100/g, motdUnicode( "food", "\ue100" ) )
		.replace( /\ue101/g, motdUnicode( "armour", "\ue101" ) )
		.replace( /\ue102/g, motdUnicode( "minecoin", "\ue102" ) )
		.replace( /\ue103/g, motdUnicode( "code-builder", "\ue103" ) )
		.replace( /\ue104/g, motdUnicode( "immersive-reader-button", "\ue104" ) )
		.replace( /\ue105/g, motdUnicode( "token", "\ue105" ) )
		.replace( /\ue106/g, motdUnicode( "hollow-star", "\ue106" ) )
		.replace( /\ue107/g, motdUnicode( "solid-star", "\ue107" ) )
		.replace( /\ue0c0/g, motdUnicode( "mr-lg", "\ue0c0" ) )
		.replace( /\ue0c1/g, motdUnicode( "mr-rg", "\ue0c1" ) )
		.replace( /\ue0c2/g, motdUnicode( "mr-menu", "\ue0c2" ) )
		.replace( /\ue0c3/g, motdUnicode( "mr-ls", "\ue0c3" ) )
		.replace( /\ue0c4/g, motdUnicode( "mr-rs", "\ue0c4" ) )
		.replace( /\ue0c5/g, motdUnicode( "mr-left-touchpad", "\ue0c5" ) )
		.replace( /\ue0c6/g, motdUnicode( "mr-left-touchpad-horizontal", "\ue0c6" ) )
		.replace( /\ue0c7/g, motdUnicode( "mr-left-touchpad-vertical", "\ue0c7" ) )
		.replace( /\ue0c8/g, motdUnicode( "mr-right-touchpad", "\ue0c8" ) )
		.replace( /\ue0c9/g, motdUnicode( "mr-right-touchpad-horizontal", "\ue0c9" ) )
		.replace( /\ue0ca/g, motdUnicode( "mr-right-touchpad-vertical", "\ue0ca" ) )
		.replace( /\ue0cb/g, motdUnicode( "mr-lt.png", "\ue0cb" ) )
		.replace( /\ue0cc/g, motdUnicode( "mr-rt.png", "\ue0cc" ) )
		.replace( /\ue0cd/g, motdUnicode( "mr-windows.png", "\ue0cd" ) )
		.replace( /\ue0e0/g, motdUnicode( "rift-zero.png", "\ue0e0" ) )
		.replace( /\ue0e1/g, motdUnicode( "rift-a.png", "\ue0e1" ) )
		.replace( /\ue0e2/g, motdUnicode( "rift-b.png", "\ue0e2" ) )
		.replace( /\ue0e3/g, motdUnicode( "rift-lg.png", "\ue0e3" ) )
		.replace( /\ue0e4/g, motdUnicode( "rift-rg.png", "\ue0e4" ) )
		.replace( /\ue0e5/g, motdUnicode( "rift-ls.png", "\ue0e5" ) )
		.replace( /\ue0e6/g, motdUnicode( "rift-rs.png", "\ue0e6" ) )
		.replace( /\ue0e7/g, motdUnicode( "rift-lt.png", "\ue0e7" ) )
		.replace( /\ue0e8/g, motdUnicode( "rift-rt.png", "\ue0e8" ) )
		.replace( /\ue0e9/g, motdUnicode( "rift-x.png", "\ue0e9" ) )
		.replace( /\ue0ea/g, motdUnicode( "rift-y.png", "\ue0ea" ) );
};