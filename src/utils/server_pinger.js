/**
 * Implementation of the RakNet ping/pong protocol.
 * @see https://wiki.vg/Raknet_Protocol#Unconnected_Ping
 *
 * Data types:
 * @see https://wiki.vg/Raknet_Protocol#Data_types
 */

const dgram = require( "dgram" );
const ByteBuffer = require( "bytebuffer" );
const motdParser = require( "@sfirew/mc-motd-parser" );

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
							clean: motdParser.cleanTags(pong.description),
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

const pingBedrock = (options = {}) => {
	const { hostname, port = 19132, timeout = 8500 } = options;
    if (!hostname) throw new Error( "Host argument is not provided" );
    return new Promise(
		(resolve, reject) => {
        	ping(
				hostname, port, (err, res) => err ? reject(err) : resolve(res), timeout
			);
    	},
	);
};

const bedrockMotd = (motd) => {
	return motd
		.replace( /\ue000/g, `<img src="/src/assets/imgs/fonts/xbox-a.png" alt="\ue000" class="motdUnicode" draggable="false">` )
		.replace( /\ue001/g, `<img src="/src/assets/imgs/fonts/xbox-b.png" alt="\ue001" class="motdUnicode" draggable="false">` )
		.replace( /\ue002/g, `<img src="/src/assets/imgs/fonts/xbox-x.png" alt="\ue002" class="motdUnicode" draggable="false">` )
		.replace( /\ue003/g, `<img src="/src/assets/imgs/fonts/xbox-y.png" alt="\ue003" class="motdUnicode" draggable="false">` )
		.replace( /\ue004/g, `<img src="/src/assets/imgs/fonts/xbox-lb.png" alt="\ue004" class="motdUnicode" draggable="false">` )
		.replace( /\ue005/g, `<img src="/src/assets/imgs/fonts/xbox-rb.png" alt="\ue005" class="motdUnicode" draggable="false">` )
		.replace( /\ue006/g, `<img src="/src/assets/imgs/fonts/xbox-lt.png" alt="\ue006" class="motdUnicode" draggable="false">` )
		.replace( /\ue007/g, `<img src="/src/assets/imgs/fonts/xbox-rt.png" alt="\ue007" class="motdUnicode" draggable="false">` )
		.replace( /\ue008/g, `<img src="/src/assets/imgs/fonts/xbox-select.png" alt="\ue008" class="motdUnicode" draggable="false">` )
		.replace( /\ue009/g, `<img src="/src/assets/imgs/fonts/xbox-start.png" alt="\ue009" class="motdUnicode" draggable="false">` )
		.replace( /\ue00a/g, `<img src="/src/assets/imgs/fonts/xbox-ls.png" alt="\ue00a" class="motdUnicode" draggable="false">` )
		.replace( /\ue00b/g, `<img src="/src/assets/imgs/fonts/xbox-rs.png" alt="\ue00b" class="motdUnicode" draggable="false">` )
		.replace( /\ue00c/g, `<img src="/src/assets/imgs/fonts/xbox-d-up.png" alt="\ue00c" class="motdUnicode" draggable="false">` )
		.replace( /\ue00d/g, `<img src="/src/assets/imgs/fonts/xbox-d-left.png" alt="\ue00d" class="motdUnicode" draggable="false">` )
		.replace( /\ue00e/g, `<img src="/src/assets/imgs/fonts/xbox-d-down.png" alt="\ue00e" class="motdUnicode" draggable="false">` )
		.replace( /\ue00f/g, `<img src="/src/assets/imgs/fonts/xbox-d-right.png" alt="\ue00f" class="motdUnicode" draggable="false">` )
		.replace( /\ue010/g, `<img src="/src/assets/imgs/fonts/xbox-a-bright.png" alt="\ue010" class="motdUnicode" draggable="false">` )
		.replace( /\ue011/g, `<img src="/src/assets/imgs/fonts/xbox-b-bright.png" alt="\ue011" class="motdUnicode" draggable="false">` )
		.replace( /\ue012/g, `<img src="/src/assets/imgs/fonts/xbox-x-bright.png" alt="\ue012" class="motdUnicode" draggable="false">` )
		.replace( /\ue013/g, `<img src="/src/assets/imgs/fonts/xbox-y-bright.png" alt="\ue013" class="motdUnicode" draggable="false">` )
		.replace( /\ue014/g, `<img src="/src/assets/imgs/fonts/jump.png" alt="\ue014" class="motdUnicode" draggable="false">` )
		.replace( /\ue015/g, `<img src="/src/assets/imgs/fonts/attack.png" alt="\ue015" class="motdUnicode" draggable="false">` )
		.replace( /\ue016/g, `<img src="/src/assets/imgs/fonts/joystick.png" alt="\ue016" class="motdUnicode" draggable="false">` )
		.replace( /\ue017/g, `<img src="/src/assets/imgs/fonts/crosshair.png" alt="\ue017" class="motdUnicode" draggable="false">` )
		.replace( /\ue018/g, `<img src="/src/assets/imgs/fonts/interact.png" alt="\ue018" class="motdUnicode" draggable="false">` )
		.replace( /\ue019/g, `<img src="/src/assets/imgs/fonts/crouch.png" alt="\ue019" class="motdUnicode" draggable="false">` )
		.replace( /\ue01a/g, `<img src="/src/assets/imgs/fonts/sprint.png" alt="\ue01a" class="motdUnicode" draggable="false">` )
		.replace( /\ue01b/g, `<img src="/src/assets/imgs/fonts/fly-up.png" alt="\ue01b" class="motdUnicode" draggable="false">` )
		.replace( /\ue01c/g, `<img src="/src/assets/imgs/fonts/fly-down.png" alt="\ue01c" class="motdUnicode" draggable="false">` )
		.replace( /\ue01d/g, `<img src="/src/assets/imgs/fonts/dismount.png" alt="\ue01d" class="motdUnicode" draggable="false">` )
		.replace( /\ue020/g, `<img src="/src/assets/imgs/fonts/ps-x.png" alt="\ue020" class="motdUnicode" draggable="false">` )
		.replace( /\ue021/g, `<img src="/src/assets/imgs/fonts/ps-o.png" alt="\ue021" class="motdUnicode" draggable="false">` )
		.replace( /\ue022/g, `<img src="/src/assets/imgs/fonts/ps-square.png" alt="\ue022" class="motdUnicode" draggable="false">` )
		.replace( /\ue023/g, `<img src="/src/assets/imgs/fonts/ps-triangle.png" alt="\ue023" class="motdUnicode" draggable="false">` )
		.replace( /\ue024/g, `<img src="/src/assets/imgs/fonts/ps-l1.png" alt="\ue024" class="motdUnicode" draggable="false">` )
		.replace( /\ue025/g, `<img src="/src/assets/imgs/fonts/ps-r1.png" alt="\ue025" class="motdUnicode" draggable="false">` )
		.replace( /\ue026/g, `<img src="/src/assets/imgs/fonts/ps-l2.png" alt="\ue026" class="motdUnicode" draggable="false">` )
		.replace( /\ue027/g, `<img src="/src/assets/imgs/fonts/ps-r2.png" alt="\ue027" class="motdUnicode" draggable="false">` )
		.replace( /\ue028/g, `<img src="/src/assets/imgs/fonts/ps-select.png" alt="\ue028" class="motdUnicode" draggable="false">` )
		.replace( /\ue029/g, `<img src="/src/assets/imgs/fonts/ps-start.png" alt="\ue029" class="motdUnicode" draggable="false">` )
		.replace( /\ue02a/g, `<img src="/src/assets/imgs/fonts/ps-l3.png" alt="\ue02a" class="motdUnicode" draggable="false">` )
		.replace( /\ue02b/g, `<img src="/src/assets/imgs/fonts/ps-r3.png" alt="\ue02b" class="motdUnicode" draggable="false">` )
		.replace( /\ue02c/g, `<img src="/src/assets/imgs/fonts/ps-d-up.png" alt="\ue02c" class="motdUnicode" draggable="false">` )
		.replace( /\ue02d/g, `<img src="/src/assets/imgs/fonts/ps-d-left.png" alt="\ue02d" class="motdUnicode" draggable="false">` )
		.replace( /\ue02e/g, `<img src="/src/assets/imgs/fonts/ps-d-down.png" alt="\ue02e" class="motdUnicode" draggable="false">` )
		.replace( /\ue02f/g, `<img src="/src/assets/imgs/fonts/ps-d-right.png" alt="\ue02f" class="motdUnicode" draggable="false">` )
		.replace( /\ue040/g, `<img src="/src/assets/imgs/fonts/nintendo-a.png" alt="\ue040" class="motdUnicode" draggable="false">` )
		.replace( /\ue041/g, `<img src="/src/assets/imgs/fonts/nintendo-b.png" alt="\ue041" class="motdUnicode" draggable="false">` )
		.replace( /\ue042/g, `<img src="/src/assets/imgs/fonts/nintendo-x.png" alt="\ue042" class="motdUnicode" draggable="false">` )
		.replace( /\ue043/g, `<img src="/src/assets/imgs/fonts/nintendo-y.png" alt="\ue043" class="motdUnicode" draggable="false">` )
		.replace( /\ue044/g, `<img src="/src/assets/imgs/fonts/nintendo-l.png" alt="\ue044" class="motdUnicode" draggable="false">` )
		.replace( /\ue045/g, `<img src="/src/assets/imgs/fonts/nintendo-r.png" alt="\ue045" class="motdUnicode" draggable="false">` )
		.replace( /\ue046/g, `<img src="/src/assets/imgs/fonts/nintendo-zl.png" alt="\ue046" class="motdUnicode" draggable="false">` )
		.replace( /\ue047/g, `<img src="/src/assets/imgs/fonts/nintendo-zr.png" alt="\ue047" class="motdUnicode" draggable="false">` )
		.replace( /\ue048/g, `<img src="/src/assets/imgs/fonts/nintendo-minus.png" alt="\ue048" class="motdUnicode" draggable="false">` )
		.replace( /\ue049/g, `<img src="/src/assets/imgs/fonts/nintendo-plus.png" alt="\ue049" class="motdUnicode" draggable="false">` )
		.replace( /\ue04a/g, `<img src="/src/assets/imgs/fonts/nintendo-ls.png" alt="\ue04a" class="motdUnicode" draggable="false">` )
		.replace( /\ue04b/g, `<img src="/src/assets/imgs/fonts/nintendo-rs.png" alt="\ue04b" class="motdUnicode" draggable="false">` )
		.replace( /\ue04c/g, `<img src="/src/assets/imgs/fonts/nintendo-d-up.png" alt="\ue04c" class="motdUnicode" draggable="false">` )
		.replace( /\ue04d/g, `<img src="/src/assets/imgs/fonts/nintendo-d-left.png" alt="\ue04d" class="motdUnicode" draggable="false">` )
		.replace( /\ue04e/g, `<img src="/src/assets/imgs/fonts/nintendo-d-down.png" alt="\ue04e" class="motdUnicode" draggable="false">` )
		.replace( /\ue04f/g, `<img src="/src/assets/imgs/fonts/nintendo-d-right.png" alt="\ue04f" class="motdUnicode" draggable="false">` )
		.replace( /\ue060/g, `<img src="/src/assets/imgs/fonts/left-mouse.png" alt="\ue060" class="motdUnicode" draggable="false">` )
		.replace( /\ue061/g, `<img src="/src/assets/imgs/fonts/right-mouse.png" alt="\ue061" class="motdUnicode" draggable="false">` )
		.replace( /\ue062/g, `<img src="/src/assets/imgs/fonts/middle-mouse.png" alt="\ue062" class="motdUnicode" draggable="false">` )
		.replace( /\ue063/g, `<img src="/src/assets/imgs/fonts/mouse.png" alt="\ue063" class="motdUnicode" draggable="false">` )
		.replace( /\ue065/g, `<img src="/src/assets/imgs/fonts/forward-arrow-new.png" alt="\ue065" class="motdUnicode" draggable="false">` )
		.replace( /\ue066/g, `<img src="/src/assets/imgs/fonts/right-arrow-new.png" alt="\ue066" class="motdUnicode" draggable="false">` )
		.replace( /\ue067/g, `<img src="/src/assets/imgs/fonts/down-arrow-new.png" alt="\ue067" class="motdUnicode" draggable="false">` )
		.replace( /\ue068/g, `<img src="/src/assets/imgs/fonts/left-arrow-new.png" alt="\ue068" class="motdUnicode" draggable="false">` )
		.replace( /\ue069/g, `<img src="/src/assets/imgs/fonts/jump-button-new.png" alt="\ue069" class="motdUnicode" draggable="false">` )
		.replace( /\ue06a/g, `<img src="/src/assets/imgs/fonts/crouch-button-new.png" alt="\ue06a" class="motdUnicode" draggable="false">` )
		.replace( /\ue06b/g, `<img src="/src/assets/imgs/fonts/inventory-button-new.png" alt="\ue06b" class="motdUnicode" draggable="false">` )
		.replace( /\ue06c/g, `<img src="/src/assets/imgs/fonts/fly-up-button-new.png" alt="\ue06c" class="motdUnicode" draggable="false">` )
		.replace( /\ue06d/g, `<img src="/src/assets/imgs/fonts/fly-down-button-new.png" alt="\ue06d" class="motdUnicode" draggable="false">` )
		.replace( /\ue070/g, `<img src="/src/assets/imgs/fonts/left-mouse-new.png" alt="\ue070" class="motdUnicode" draggable="false">` )
		.replace( /\ue071/g, `<img src="/src/assets/imgs/fonts/right-mouse-new.png" alt="\ue071" class="motdUnicode" draggable="false">` )
		.replace( /\ue072/g, `<img src="/src/assets/imgs/fonts/middle-mouse-new.png" alt="\ue072" class="motdUnicode" draggable="false">` )
		.replace( /\ue073/g, `<img src="/src/assets/imgs/fonts/mouse-new.png" alt="\ue073" class="motdUnicode" draggable="false">` )
		.replace( /\ue080/g, `<img src="/src/assets/imgs/fonts/forward-arrow.png" alt="\ue080" class="motdUnicode" draggable="false">` )
		.replace( /\ue081/g, `<img src="/src/assets/imgs/fonts/left-arrow.png" alt="\ue081" class="motdUnicode" draggable="false">` )
		.replace( /\ue082/g, `<img src="/src/assets/imgs/fonts/down-arrow.png" alt="\ue082" class="motdUnicode" draggable="false">` )
		.replace( /\ue083/g, `<img src="/src/assets/imgs/fonts/right-arrow.png" alt="\ue083" class="motdUnicode" draggable="false">` )
		.replace( /\ue084/g, `<img src="/src/assets/imgs/fonts/jump-button.png" alt="\ue084" class="motdUnicode" draggable="false">` )
		.replace( /\ue085/g, `<img src="/src/assets/imgs/fonts/crouch-button.png" alt="\ue085" class="motdUnicode" draggable="false">` )
		.replace( /\ue086/g, `<img src="/src/assets/imgs/fonts/fly-up-button.png" alt="\ue086" class="motdUnicode" draggable="false">` )
		.replace( /\ue087/g, `<img src="/src/assets/imgs/fonts/fly-down-button.png" alt="\ue087" class="motdUnicode" draggable="false">` )
		.replace( /\ue0a0/g, `<img src="/src/assets/imgs/fonts/craftable-on.png" alt="\ue0a0" class="motdUnicode" draggable="false">` )
		.replace( /\ue0a1/g, `<img src="/src/assets/imgs/fonts/craftable-off.png" alt="\ue0a1" class="motdUnicode" draggable="false">` )
		.replace( /\ue100/g, `<img src="/src/assets/imgs/fonts/food.png" alt="\ue100" class="motdUnicode" draggable="false">` )
		.replace( /\ue101/g, `<img src="/src/assets/imgs/fonts/armour.png" alt="\ue101" class="motdUnicode" draggable="false">` )
		.replace( /\ue102/g, `<img src="/src/assets/imgs/fonts/minecoin.png" alt="\ue102" class="motdUnicode" draggable="false">` )
		.replace( /\ue103/g, `<img src="/src/assets/imgs/fonts/code-builder.png" alt="\ue103" class="motdUnicode" draggable="false">` )
		.replace( /\ue104/g, `<img src="/src/assets/imgs/fonts/immersive-reader-button.png" alt="\ue104" class="motdUnicode" draggable="false">` )
		.replace( /\ue105/g, `<img src="/src/assets/imgs/fonts/token.png" alt="\ue105" class="motdUnicode" draggable="false">` )
		.replace( /\ue106/g, `<img src="/src/assets/imgs/fonts/hollow-star.png" alt="\ue106" class="motdUnicode" draggable="false"></img>` )
		.replace( /\ue107/g, `<img src="/src/assets/imgs/fonts/solid-star.png" alt="\ue107" class="motdUnicode" draggable="false"></img>` )
		.replace( /\ue0c0/g, `<img src="/src/assets/imgs/fonts/mr-lg.png" alt="\ue0c0" class="motdUnicode" draggable="false">` )
		.replace( /\ue0c1/g, `<img src="/src/assets/imgs/fonts/mr-rg.png" alt="\ue0c1" class="motdUnicode" draggable="false">` )
		.replace( /\ue0c2/g, `<img src="/src/assets/imgs/fonts/mr-menu.png" alt="\ue0c2" class="motdUnicode" draggable="false">` )
		.replace( /\ue0c3/g, `<img src="/src/assets/imgs/fonts/mr-ls.png" alt="\ue0c3" class="motdUnicode" draggable="false">` )
		.replace( /\ue0c4/g, `<img src="/src/assets/imgs/fonts/mr-rs.png" alt="\ue0c4" class="motdUnicode" draggable="false">` )
		.replace( /\ue0c5/g, `<img src="/src/assets/imgs/fonts/mr-left-touchpad.png" alt="\ue0c5" class="motdUnicode" draggable="false">` )
		.replace( /\ue0c6/g, `<img src="/src/assets/imgs/fonts/mr-left-touchpad-horizontal.png" alt="\ue0c6" class="motdUnicode" draggable="false">` )
		.replace( /\ue0c7/g, `<img src="/src/assets/imgs/fonts/mr-left-touchpad-vertical.png" alt="\ue0c7" class="motdUnicode" draggable="false">` )
		.replace( /\ue0c8/g, `<img src="/src/assets/imgs/fonts/mr-right-touchpad.png" alt="\ue0c8" class="motdUnicode" draggable="false">` )
		.replace( /\ue0c9/g, `<img src="/src/assets/imgs/fonts/mr-right-touchpad-horizontal.png" alt="\ue0c9" class="motdUnicode" draggable="false">` )
		.replace( /\ue0ca/g, `<img src="/src/assets/imgs/fonts/mr-right-touchpad-vertical.png" alt="\ue0ca" class="motdUnicode" draggable="false">` )
		.replace( /\ue0cb/g, `<img src="/src/assets/imgs/fonts/mr-lt.png" class="motdUnicode" alt="\ue0cb" draggable="false">` )
		.replace( /\ue0cc/g, `<img src="/src/assets/imgs/fonts/mr-rt.png" class="motdUnicode" alt="\ue0cc" draggable="false">` )
		.replace( /\ue0cd/g, `<img src="/src/assets/imgs/fonts/mr-windows.png" class="motdUnicode" alt="\ue0cd" draggable="false">` )
		.replace( /\ue0e0/g, `<img src="/src/assets/imgs/fonts/rift-zero.png" class="motdUnicode" alt="\ue0e0" draggable="false">` )
		.replace( /\ue0e1/g, `<img src="/src/assets/imgs/fonts/rift-a.png" class="motdUnicode" alt="\ue0e1" draggable="false">` )
		.replace( /\ue0e2/g, `<img src="/src/assets/imgs/fonts/rift-b.png" class="motdUnicode" alt="\ue0e2" draggable="false">` )
		.replace( /\ue0e3/g, `<img src="/src/assets/imgs/fonts/rift-lg.png" class="motdUnicode" alt="\ue0e3" draggable="false">` )
		.replace( /\ue0e4/g, `<img src="/src/assets/imgs/fonts/rift-rg.png" class="motdUnicode" alt="\ue0e4" draggable="false">` )
		.replace( /\ue0e5/g, `<img src="/src/assets/imgs/fonts/rift-ls.png" class="motdUnicode" alt="\ue0e5" draggable="false">` )
		.replace( /\ue0e6/g, `<img src="/src/assets/imgs/fonts/rift-rs.png" class="motdUnicode" alt="\ue0e6" draggable="false">` )
		.replace( /\ue0e7/g, `<img src="/src/assets/imgs/fonts/rift-lt.png" class="motdUnicode" alt="\ue0e7" draggable="false">` )
		.replace( /\ue0e8/g, `<img src="/src/assets/imgs/fonts/rift-rt.png" class="motdUnicode" alt="\ue0e8" draggable="false">` )
		.replace( /\ue0e9/g, `<img src="/src/assets/imgs/fonts/rift-x.png" class="motdUnicode" alt="\ue0e9" draggable="false">` )
		.replace( /\ue0ea/g, `<img src="/src/assets/imgs/fonts/rift-y.png" class="motdUnicode" alt="\ue0ea" draggable="false">` );
};