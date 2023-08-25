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
	const { hostname, port = 19132, timeout = 5000 } = options;
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
	return motd.toString()
		.replaceAll( "\ue000", `<img src="/assets/fonts/xbox-a.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue001", `<img src="/assets/fonts/xbox-b.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue002", `<img src="/assets/fonts/xbox-x.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue003", `<img src="/assets/fonts/xbox-y.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue004", `<img src="/assets/fonts/xbox-lb.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue005", `<img src="/assets/fonts/xbox-rb.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue006", `<img src="/assets/fonts/xbox-lt.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue007", `<img src="/assets/fonts/xbox-rt.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue008", `<img src="/assets/fonts/xbox-select.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue009", `<img src="/assets/fonts/xbox-start.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue00a", `<img src="/assets/fonts/xbox-ls.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue00b", `<img src="/assets/fonts/xbox-rs.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue00c", `<img src="/assets/fonts/xbox-d-up.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue00d", `<img src="/assets/fonts/xbox-d-left.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue00e", `<img src="/assets/fonts/xbox-d-down.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue00f", `<img src="/assets/fonts/xbox-d-right.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue020", `<img src="/assets/fonts/ps-x.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue021", `<img src="/assets/fonts/ps-o.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue022", `<img src="/assets/fonts/ps-square.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue023", `<img src="/assets/fonts/ps-triangle.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue024", `<img src="/assets/fonts/ps-l1.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue025", `<img src="/assets/fonts/ps-r1.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue026", `<img src="/assets/fonts/ps-l2.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue027", `<img src="/assets/fonts/ps-r2.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue028", `<img src="/assets/fonts/ps-select.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue029", `<img src="/assets/fonts/ps-start.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue02a", `<img src="/assets/fonts/ps-l3.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue02b", `<img src="/assets/fonts/ps-r3.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue02c", `<img src="/assets/fonts/ps-d-up.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue02d", `<img src="/assets/fonts/ps-d-left.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue02e", `<img src="/assets/fonts/ps-d-down.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue02f", `<img src="/assets/fonts/ps-d-right.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue040", `<img src="/assets/fonts/nintendo-a.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue041", `<img src="/assets/fonts/nintendo-b.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue042", `<img src="/assets/fonts/nintendo-x.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue043", `<img src="/assets/fonts/nintendo-y.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue044", `<img src="/assets/fonts/nintendo-l.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue045", `<img src="/assets/fonts/nintendo-r.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue046", `<img src="/assets/fonts/nintendo-zl.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue047", `<img src="/assets/fonts/nintendo-zr.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue049", `<img src="/assets/fonts/nintendo-plus.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue048", `<img src="/assets/fonts/nintendo-minus.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue04a", `<img src="/assets/fonts/nintendo-ls.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue04b", `<img src="/assets/fonts/nintendo-rs.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue04c", `<img src="/assets/fonts/nintendo-d-up.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue04d", `<img src="/assets/fonts/nintendo-d-left.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue04e", `<img src="/assets/fonts/nintendo-d-down.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue04f", `<img src="/assets/fonts/nintendo-d-right.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue060", `<img src="/assets/fonts/left-mouse.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue061", `<img src="/assets/fonts/right-mouse.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue062", `<img src="/assets/fonts/middle-mouse.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue080", `<img src="/assets/fonts/forward-arrow.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue081", `<img src="/assets/fonts/left-arrow.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue082", `<img src="/assets/fonts/down-arrow.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue083", `<img src="/assets/fonts/right-arrow.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue084", `<img src="/assets/fonts/jump-button.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue085", `<img src="/assets/fonts/crouch-button.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue086", `<img src="/assets/fonts/fly-up-button.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue087", `<img src="/assets/fonts/fly-down-button.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue0a0", `<img src="/assets/fonts/craftable-on.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue0a1", `<img src="/assets/fonts/craftable-off.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue100", `<img src="/assets/fonts/food.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue101", `<img src="/assets/fonts/armour.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue102", `<img src="/assets/fonts/minecoin.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue103", `<img src="/assets/fonts/code-builder.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue104", `<img src="/assets/fonts/immersive-reader-button.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue105", `<img src="/assets/fonts/token.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue106", `<img src="/assets/fonts/hollow-star.png" alt="" class="motdUnicode" draggable="false"></img>` )
		.replaceAll( "\ue107", `<img src="/assets/fonts/solid-star.png" alt="" class="motdUnicode" draggable="false"></img>` )
		.replaceAll( "\ue0c0", `<img src="/assets/fonts/mr-lg.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue0c1", `<img src="/assets/fonts/mr-rg.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue0c2", `<img src="/assets/fonts/mr-menu.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue0c3", `<img src="/assets/fonts/mr-ls.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue0c4", `<img src="/assets/fonts/mr-rs.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue0c5", `<img src="/assets/fonts/mr-left-touchpad.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue0c6", `<img src="/assets/fonts/mr-left-touchpad-horizontal.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue0c7", `<img src="/assets/fonts/mr-left-touchpad-vertical.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue0c8", `<img src="/assets/fonts/mr-right-touchpad.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue0c9", `<img src="/assets/fonts/mr-right-touchpad-horizontal.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue0ca", `<img src="/assets/fonts/mr-right-touchpad-vertical.png" alt="" class="motdUnicode" draggable="false">` )
		.replaceAll( "\ue0cb", `<img src="/assets/fonts/mr-lt.png" class="motdUnicode" alt="" draggable="false">` )
		.replaceAll( "\ue0cc", `<img src="/assets/fonts/mr-rt.png" class="motdUnicode" alt="" draggable="false">` )
		.replaceAll( "\ue0cd", `<img src="/assets/fonts/mr-windows.png" class="motdUnicode" alt="" draggable="false">` )
		.replaceAll( "\ue0e0", `<img src="/assets/fonts/rift-zero.png" class="motdUnicode" alt="" draggable="false">` )
		.replaceAll( "\ue0e1", `<img src="/assets/fonts/rift-a.png" class="motdUnicode" alt="" draggable="false">` )
		.replaceAll( "\ue0e2", `<img src="/assets/fonts/rift-b.png" class="motdUnicode" alt="" draggable="false">` )
		.replaceAll( "\ue0e3", `<img src="/assets/fonts/rift-lg.png" class="motdUnicode" alt="" draggable="false">` )
		.replaceAll( "\ue0e4", `<img src="/assets/fonts/rift-rg.png" class="motdUnicode" alt="" draggable="false">` )
		.replaceAll( "\ue0e5", `<img src="/assets/fonts/rift-ls.png" class="motdUnicode" alt="" draggable="false">` )
		.replaceAll( "\ue0e6", `<img src="/assets/fonts/rift-rs.png" class="motdUnicode" alt="" draggable="false">` )
		.replaceAll( "\ue0e7", `<img src="/assets/fonts/rift-lt.png" class="motdUnicode" alt="" draggable="false">` )
		.replaceAll( "\ue0e8", `<img src="/assets/fonts/rift-rt.png" class="motdUnicode" alt="" draggable="false">` )
		.replaceAll( "\ue0e9", `<img src="/assets/fonts/rift-x.png" class="motdUnicode" alt="" draggable="false">` )
		.replaceAll( "\ue0ea", `<img src="/assets/fonts/rift-y.png" class="motdUnicode" alt="" draggable="false">` );
};