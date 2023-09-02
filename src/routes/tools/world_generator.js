const jszip = require( "jszip" );
window.router.routes.push({
    name: "World Generator",
    route: "/world_generator",
    rpc: "world_gen",
    component: () => {
        const isRight = window.settings.get( "right" );
        return (
            Components.createHeader({ text: "World Generator", back: true, settings: true })
            + (
                `<div style="margin-top: 25px;margin-left: auto;margin-right: auto;width: 50%;">
                    ${Components.createElements(
                        {
                            elements: [
                                Components.createElement(
                                    {
                                        type: "dropdown",
                                        title: "World type:",
                                        id: "worldType",
                                        items: [
                                            "Flat World",
                                            "Void World",
                                            "Old World",
                                            "Single Biome",
                                        ],
                                        onChange: (e) => GenType( e.value ),
                                    },
                                ),
                            ],
                        },
                    )}
                    <div id="genElement"></div>
                    ${Components.createElement(
                        {
                            type: "button",
                            text: "Generate",
                            id: "generatePack",
                            style: "hero",
                            onClick: async () => {
                                window.sound.play( "ui.release" );
                                const worldType = document.getElementById( "worldType" ).value;
                                worldData.value.RandomSeed.value = randomSeed();
                                worldData.value.FlatWorldLayers.value = JSON.stringify(
                                    worldType == 1
                                    ? voidWorld
                                    : flatWorldLayers
                                );

                                console.log(worldData);

                                zip.file( "level.dat", datHandler.fix(NBT.writeUncompressed(worldData, "little")) );
                                const blob = await zip.generateAsync({ type: "nodebuffer" });
                                const handle = await electron.dialog.showSaveDialog(
                                    electron.getCurrentWindow(), {
                                        defaultPath: "World.mcworld",
                                        filters: [{ name: "Generated World", extensions: [ "mcworld" ] }]
                                    },
                                );
                                
                                if(handle.filePath.length == 0) return;
                                const file = fs.createWriteStream( handle.filePath );
                                file.on("finish", () => file.close());
                                file.write(blob);
                            },
                        },
                    )}
                    <div style="height: 16px;"></div>
                </div>`
            )
        );
    },
    extra: () => GenType( "0" ),
});

const Biomes = [
    { "identifier": "ocean", "biome_id": 0 },
    { "identifier": "plains", "biome_id": 1 },
    { "identifier": "desert", "biome_id": 2 },
    { "identifier": "windswept_hills", "biome_id": 3 },
    { "identifier": "forest", "biome_id": 4 },
    { "identifier": "taiga", "biome_id": 5 },
    { "identifier": "swampland", "biome_id": 6 },
    { "identifier": "river", "biome_id": 7 },
    { "identifier": "hell", "biome_id": 8 },
    { "identifier": "the_end", "biome_id": 9 },
    { "identifier": "frozen_ocean", "biome_id": 10 },
    { "identifier": "frozen_river", "biome_id": 11 },
    { "identifier": "ice_plains", "biome_id": 12 },
    { "identifier": "ice_mountains", "biome_id": 13 },
    { "identifier": "mushroom_island", "biome_id": 14 },
    { "identifier": "mushroom_island_shore", "biome_id": 15 },
    { "identifier": "beach", "biome_id": 16 },
    { "identifier": "desert_hills", "biome_id": 17 },
    { "identifier": "forest_hills", "biome_id": 18 },
    { "identifier": "taiga_hills", "biome_id": 19 },
    { "identifier": "extreme_hills_edge", "biome_id": 20 },
    { "identifier": "jungle", "biome_id": 21 },
    { "identifier": "jungle_hills", "biome_id": 22 },
    { "identifier": "jungle_edge", "biome_id": 23 },
    { "identifier": "deep_ocean", "biome_id": 24 },
    { "identifier": "stone_beach", "biome_id": 25 },
    { "identifier": "cold_beach", "biome_id": 26 },
    { "identifier": "birch_forest", "biome_id": 27 },
    { "identifier": "birch_forest_hills", "biome_id": 28 },
    { "identifier": "roofed_forest", "biome_id": 29 },
    { "identifier": "cold_taiga", "biome_id": 30 },
    { "identifier": "cold_taiga_hills", "biome_id": 31 },
    { "identifier": "mega_taiga", "biome_id": 32 },
    { "identifier": "mega_taiga_hills", "biome_id": 33 },
    { "identifier": "windswept_forest", "biome_id": 34 },
    { "identifier": "savanna", "biome_id": 35 },
    { "identifier": "savanna_plateau", "biome_id": 36 },
    { "identifier": "mesa", "biome_id": 37 },
    { "identifier": "mesa_plateau", "biome_id": 38 },
    { "identifier": "mesa_plateau_stone", "biome_id": 39 },
    { "identifier": "warm_ocean", "biome_id": 40 },
    { "identifier": "lukewarm_ocean", "biome_id": 41 },
    { "identifier": "cold_ocean", "biome_id": 42 },
    { "identifier": "deep_warm_ocean", "biome_id": 43 },
    { "identifier": "deep_lukewarm_ocean", "biome_id": 44 },
    { "identifier": "deep_cold_ocean", "biome_id": 45 },
    { "identifier": "deep_frozen_ocean", "biome_id": 46 },
    { "identifier": "legacy_frozen_ocean", "biome_id": 47 },
    { "identifier": "sunflower_plains", "biome_id": 129 },
    { "identifier": "desert_mutated", "biome_id": 130 },
    { "identifier": "windswept_gravelly_hills", "biome_id": 131 },
    { "identifier": "flower_forest", "biome_id": 132 },
    { "identifier": "taiga_mutated", "biome_id": 133 },
    { "identifier": "swampland_mutated", "biome_id": 134 },
    { "identifier": "ice_plains_spikes", "biome_id": 140 },
    { "identifier": "jungle_mutated", "biome_id": 149 },
    { "identifier": "jungle_edge_mutated", "biome_id": 151 },
    { "identifier": "birch_forest_mutated", "biome_id": 155 },
    { "identifier": "birch_forest_hills_mutated", "biome_id": 156 },
    { "identifier": "roofed_forest_mutated", "biome_id": 157 },
    { "identifier": "cold_taiga_mutated", "biome_id": 158 },
    { "identifier": "redwood_taiga_mutated", "biome_id": 160 },
    { "identifier": "redwood_taiga_hills_mutated", "biome_id": 161 },
    { "identifier": "extreme_hills_plus_trees_mutated", "biome_id": 162 },
    { "identifier": "savanna_mutated", "biome_id": 163 },
    { "identifier": "savanna_plateau_mutated", "biome_id": 164 },
    { "identifier": "mesa_bryce", "biome_id": 165 },
    { "identifier": "mesa_plateau_mutated", "biome_id": 166 },
    { "identifier": "mesa_plateau_stone_mutated", "biome_id": 167 },
    { "identifier": "bamboo_jungle", "biome_id": 168 },
    { "identifier": "bamboo_jungle_hills", "biome_id": 169 },
    { "identifier": "soulsand_valley", "biome_id": 178 },
    { "identifier": "crimson_forest", "biome_id": 179 },
    { "identifier": "warped_forest", "biome_id": 180 },
    { "identifier": "basalt_deltas", "biome_id": 181 },
    { "identifier": "jagged_peaks", "biome_id": 182 },
    { "identifier": "frozen_peaks", "biome_id": 183 },
    { "identifier": "snowy_slopes", "biome_id": 184 },
    { "identifier": "grove", "biome_id": 185 },
    { "identifier": "meadow", "biome_id": 186 },
    { "identifier": "lush_caves", "biome_id": 187 },
    { "identifier": "dripstone_caves", "biome_id": 188 },
    { "identifier": "stony_peaks", "biome_id": 189 },
    { "identifier": "deep_dark", "biome_id": 190 },
    { "identifier": "mangrove_swamp", "biome_id": 191 },
    { "identifier": "cherry_grove", "biome_id": 192 }
];

let flatWorldLayers = {
    biome_id: 1,
    block_layers: [
        {
            block_name: "minecraft:bedrock",
            count: 1,
        },
        {
            block_name: "minecraft:dirt",
            count: 2,
        },
        {
            block_name: "minecraft:grass",
            count: 1,
        },
    ],
    encoding_version: 6,
    structure_options: null,
    world_version: "version.post_1_18"
};

let voidWorld = {
    biome_id: 1,
    block_layers: [{ block_name: "minecraft:air", count: 256 }],
    encoding_version: 6,
    structure_options: null,
};

const updateFlatLayers = () => {
    document.getElementById( "flatLayers" ).innerHTML = flatWorldLayers.block_layers.map(
        (layer, index) => (
            `${Components.createElement({ type: "element", title: `Layer - #${index + 1}` })}
            ${Components.createElement(
                {
                    type: "input",
                    title: "Block:",
                    id: "block-" + index,
                    value: layer.block_name,
                    onChange: (e) => {
                        const layer = flatWorldLayers.block_layers.find((layer, i) => i == parseInt(e.id.replace( "block-", "" )));
                        layer.block_name = e.value;
                    },
                },
            )}
            ${Components.createElement(
                {
                    type: "input",
                    title: "Count:",
                    id: "blockCount-" + index,
                    input: {
                        type: "number",
                        min: 0,
                        max: 64,
                    },
                    value: layer.count,
                    onChange: (e) => {
                        const layer = flatWorldLayers.block_layers.find((layer, i) => i == parseInt(e.id.replace( "blockCount-", "" )));
                        e.value = parseInt(e.value);
                        layer.count = parseInt(e.value);
                    },
                },
            )}
            <div class="element" style="padding: 12px;">
                ${
                    Components.createElement(
                        {
                            type: "button",
                            text: "Remove Layer",
                            id: "removeLayer-" + index,
                            style: "destructive",
                            onClick: () => {
                                window.sound.play( "ui.click" );
                                flatWorldLayers.block_layers = flatWorldLayers.block_layers.filter((l, i) => i != `${index}`)
                                updateFlatLayers();
                            },
                        },
                    )
                }
            </div>`
        )
    ).reverse().join( "" );
};

const addFlatLayer = () => {
    flatWorldLayers.block_layers.push({ block_name: "minecraft:dirt", count: 1 });
    updateFlatLayers();
};

let zip;
let worldData;
const GenType = async (selection = "0") => {
    const fs = require( "node:fs" );
    const genElement = document.getElementById( "genElement" );
    switch(selection) {
        case "0":
        {
            fs.readFile(
                __dirname + "/data/World.mcworld",
                null,
                async (error, buffer) => {
                    await jszip.loadAsync(Buffer.from( buffer ))
                    .then(
                        (result) => {
                            zip = result;
                            result.file( "level.dat" )
                            .async( "arrayBuffer" )
                            .then((res) => NBT.parse(Buffer.from( res )))
                            .then(
                                (result) => {
                                    worldData = result.parsed;
                                    worldData.value.GameType.value = 0;
                                    worldData.value.Difficulty.value = 2;
                                    worldData.value.Generator.value = 2;
                                    worldData.value.LevelName.value = "Custom Flat World - Bedrock Tools";

                                    flatWorldLayers = JSON.parse(worldData.value.FlatWorldLayers.value);
                                    updateFlatLayers();
                                },
                            );
                        },
                    );
                },
            );

            genElement.innerHTML = (
                `${Components.createElements(
                    {
                        elements: [
                            Components.createElement(
                                {
                                    type: "element",
                                    title: "Flat Layers",
                                },
                            ),
                            `<div class="element" style="padding: 12px;">
                                ${
                                    Components.createElement(
                                        {
                                            type: "button",
                                            text: "+ Add Layer",
                                            id: "addLayer",
                                            style: "secondary",
                                            onClick: () => {
                                                window.sound.play( "ui.click" );
                                                addFlatLayer();
                                            },
                                        },
                                    )
                                }
                            </div>`,
                            `<div id="flatLayers"></div>`,
                        ],
                    },
                )}
                ${Components.createElements(
                    {
                        elements: [
                            Components.createElement(
                                {
                                    type: "element",
                                    title: "Additional Settings",
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "dropdown",
                                    title: "Game Mode:",
                                    id: "gameType",
                                    selected: 0,
                                    items: [
                                        "Survival",
                                        "Creative",
                                        "Adventure",
                                    ],
                                    onChange: (e) => worldData.value.GameType.value = parseInt(e.value),
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "dropdown",
                                    title: "Difficulty:",
                                    id: "difficulty",
                                    selected: 2,
                                    items: [
                                        "Peaceful",
                                        "Easy",
                                        "Normal",
                                        "Hard",
                                    ],
                                    onChange: (e) => worldData.value.Difficulty.value = parseInt(e.value),
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "dropdown",
                                    title: "Biome:",
                                    id: "biome",
                                    selected: 1,
                                    items: Biomes.map((b) => b.identifier),
                                    onChange: (e) => {
                                        const biome = Biomes[e.value];
                                        flatWorldLayers.biome_id = biome.biome_id;
                                    },
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "toggle",
                                    title: "Start at y -64",
                                    toggled: true,
                                    onClick: (e) => {
                                        let value = e.getAttribute( "value" ) == "true";
                                        if (value) {
                                            if(!flatWorldLayers.world_version) {
                                                flatWorldLayers.world_version = "version.post_1_18";
                                            };
                                        } else if(flatWorldLayers.world_version) {
                                            delete flatWorldLayers.world_version;
                                        };
                                    },
                                },
                            ),
                        ],
                    },
                )}`
            );

            return;
        };

        case "1":
        {
            fs.readFile(
                __dirname + "/data/World.mcworld",
                null,
                async (error, buffer) => {
                    await jszip.loadAsync(Buffer.from( buffer ))
                    .then(
                        (result) => {
                            zip = result;
                            result.file( "level.dat" )
                            .async( "arrayBuffer" )
                            .then((res) => NBT.parse(Buffer.from( res )))
                            .then(
                                (result) => {
                                    worldData = result.parsed;
                                    worldData.value.GameType.value = 1;
                                    worldData.value.Difficulty.value = 2;
                                    worldData.value.Generator.value = 2;
                                    worldData.value.LevelName.value = "Void World - Bedrock Tools";
                                },
                            );
                        },
                    );
                },
            );

            genElement.innerHTML = (
                `${Components.createElements(
                    {
                        elements: [
                            Components.createElement(
                                {
                                    type: "element",
                                    title: "Void World",
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "dropdown",
                                    title: "Biome:",
                                    id: "biome",
                                    selected: 1,
                                    items: Biomes.map((b) => b.identifier),
                                    onChange: (e) => {
                                        const biome = Biomes[e.value];
                                        voidWorld.biome_id = biome.biome_id;
                                    },
                                },
                            ),
                        ],
                    }
                )}
                ${Components.createElements(
                    {
                        elements: [
                            Components.createElement(
                                {
                                    type: "element",
                                    title: "Additional Settings",
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "dropdown",
                                    title: "Game Mode:",
                                    id: "gameType",
                                    selected: 1,
                                    items: [
                                        "Survival",
                                        "Creative",
                                        "Adventure",
                                    ],
                                    onChange: (e) => worldData.value.GameType.value = parseInt(e.value),
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "dropdown",
                                    title: "Difficulty:",
                                    id: "difficulty",
                                    selected: 2,
                                    items: [
                                        "Peaceful",
                                        "Easy",
                                        "Normal",
                                        "Hard",
                                    ],
                                    onChange: (e) => worldData.value.Difficulty.value = parseInt(e.value),
                                },
                            ),
                        ],
                    },
                )}`
            );

            return;
        };

        case "2":
        {
            fs.readFile(
                __dirname + "/data/World.mcworld",
                null,
                async (error, buffer) => {
                    await jszip.loadAsync(Buffer.from( buffer ))
                    .then(
                        (result) => {
                            result.file( "level.dat" )
                            .async( "arrayBuffer" )
                            .then((res) => NBT.parse(Buffer.from( res )))
                            .then(
                                (result) => {
                                    worldData = result.parsed;
                                    worldData.value.GameType.value = 0;
                                    worldData.value.Difficulty.value = 2;
                                    worldData.value.Generator.value = 0;
                                    worldData.value.LevelName.value = "Custom Old World - Bedrock Tools";
                                },
                            );
                        },
                    );
                },
            );

            genElement.innerHTML = (
                `${Components.createElements(
                    {
                        elements: [
                            Components.createElement(
                                {
                                    type: "element",
                                    title: "Old World",
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "input",
                                    title: "Width (in chunks):",
                                    id: "width",
                                    input: {
                                        text: "number",
                                        min: 1,
                                        max: 10000,
                                    },
                                    value: 16,
                                    onChange: (e) => {
                                        e.value = parseInt(e.value);
                                        worldData.value.limitedWorldWidth.value = parseInt(e.value);
                                    },
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "input",
                                    title: "Depth (in chunks):",
                                    id: "depth",
                                    input: {
                                        text: "number",
                                        min: 1,
                                        max: 10000,
                                    },
                                    value: 16,
                                    onChange: (e) => {
                                        e.value = parseInt(e.value);
                                        worldData.value.limitedWorldDepth.value = parseInt(e.value);
                                    },
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "input",
                                    title: "Center X:",
                                    id: "centerX",
                                    input: {
                                        text: "number",
                                        min: 1,
                                        max: 10000,
                                    },
                                    value: 0,
                                    onChange: (e) => {
                                        e.value = parseInt(e.value);
                                        worldData.value.LimitedWorldOriginX.value = parseInt(e.value);
                                    },
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "input",
                                    title: "Center Z:",
                                    id: "centerZ",
                                    input: {
                                        text: "number",
                                        min: 1,
                                        max: 10000,
                                    },
                                    value: 0,
                                    onChange: (e) => {
                                        e.value = parseInt(e.value);
                                        worldData.value.LimitedWorldOriginZ.value = parseInt(e.value);
                                    },
                                },
                            ),
                        ],
                    },
                )}
                ${Components.createElements(
                    {
                        elements: [
                            Components.createElement(
                                {
                                    type: "element",
                                    title: "Additional Settings",
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "dropdown",
                                    title: "Game Mode:",
                                    id: "gameType",
                                    selected: 0,
                                    items: [
                                        "Survival",
                                        "Creative",
                                        "Adventure",
                                    ],
                                    onChange: (e) => worldData.value.GameType.value = parseInt(e.value),
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "dropdown",
                                    title: "Difficulty:",
                                    id: "difficulty",
                                    selected: 2,
                                    items: [
                                        "Peaceful",
                                        "Easy",
                                        "Normal",
                                        "Hard",
                                    ],
                                    onChange: (e) => worldData.value.Difficulty.value = parseInt(e.value),
                                },
                            ),
                        ],
                    },
                )}`
            );

            return;
        };

        case "3":
        {
            fs.readFile(
                __dirname + "/data/World.mcworld",
                null,
                async (error, buffer) => {
                    await jszip.loadAsync(Buffer.from( buffer ))
                    .then(
                        (result) => {
                            result.file( "level.dat" )
                            .async( "arrayBuffer" )
                            .then((res) => NBT.parse(Buffer.from( res )))
                            .then(
                                (result) => {
                                    worldData = result.parsed;
                                    worldData.value.GameType.value = 0;
                                    worldData.value.Difficulty.value = 2;
                                    worldData.value.Generator.value = 1;
                                    worldData.value.LevelName.value = "Single Biome World - Bedrock Tools";
                                    worldData.value.BiomeOverride.value = "plains";
                                },
                            );
                        },
                    );
                },
            );

            genElement.innerHTML = (
                `${Components.createElements(
                    {
                        elements: [
                            Components.createElement(
                                {
                                    type: "element",
                                    title: "Single Biome",
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "dropdown",
                                    title: "Biome:",
                                    id: "biome",
                                    selected: 1,
                                    items: Biomes.map((b) => b.identifier),
                                    onChange: (e) => {
                                        const biome = Biomes[e.value];
                                        worldData.value.BiomeOverride.value = biome.identifier;
                                    },
                                },
                            ),
                        ],
                    },
                )}
                ${Components.createElements(
                    {
                        elements: [
                            Components.createElement(
                                {
                                    type: "element",
                                    title: "Additional Settings",
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "dropdown",
                                    title: "Game Mode:",
                                    id: "gameType",
                                    selected: 0,
                                    items: [
                                        "Survival",
                                        "Creative",
                                        "Adventure",
                                    ],
                                    onChange: (e) => worldData.value.GameType.value = parseInt(e.value),
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "dropdown",
                                    title: "Difficulty:",
                                    id: "difficulty",
                                    selected: 2,
                                    items: [
                                        "Peaceful",
                                        "Easy",
                                        "Normal",
                                        "Hard",
                                    ],
                                    onChange: (e) => worldData.value.Difficulty.value = parseInt(e.value),
                                },
                            ),
                        ],
                    },
                )}`
            );

            return;
        };

        default: return "";
    };
};

//Credit: https://stackoverflow.com/a/43933693 and https://mcbe-essentials.github.io
function concatenate(resultConstructor, ...arrays) {
    let totalLength = 0;
    for (const arr of arrays) totalLength += arr.length;
    const result = new resultConstructor( totalLength );
    let offset = 0;
    for (const arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    };

    return result;
};

const datHandler = {
    generateHeader: (brokenldb) => {
        const byteLength = brokenldb.byteLength;
        const fileSize = Uint8Array.from(datHandler.numTo8Bit(byteLength));
        return concatenate(Uint8Array, Uint8Array.of(8, 0, 0, 0), fileSize, brokenldb);
    },
    fix: (data) => concatenate(Uint8Array, datHandler.generateHeader(data), data),
    numTo8Bit: (number) => {
        const output = [0, 0, 0, 0];
        output[3] = (Math.floor(number / 16777216));
        number -= (16777216 * output[3]);
        output[2] = (Math.floor(number / 65536));
        number -= (65536 * output[2]);
        output[1] = (Math.floor(number / 256));
        number -= (256 * output[1]);
        output[0] = (Math.floor(number / 1));
        number -= (1 * output[0]);
      
        return output;
    },
};

class SignedBigInt extends Array {
    valueOf() {
        return BigInt.asIntN(64, BigInt(this[0]) << 32n) | BigInt.asUintN(32, BigInt(this[1]));
    };
    
    toString() {
        return this.valueOf().toString();
    };
};

const randomSeed = () => {
    const int1 = parseInt((Math.random() * 10 - 5) * 500);
    const int2 = parseInt((Math.random() + 15) * 500);
    const bitInt = new SignedBigInt( int1, int2 );
    return bitInt;
};