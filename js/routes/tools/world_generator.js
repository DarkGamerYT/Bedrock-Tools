const jszip = require( "jszip" );
const WorldGenerator = {
    Component: () => {
        const isRight = settings.get( "right" );
        return (
            Components.createHeader({ label: localisation.translate( "bedrocktools.advanced.worldgenerator" ), back: true, settings: true })
            + (
                `<div style="display: flex;flex-direction: ${isRight ? "row-reverse" : "row"};margin-top: 25px;margin-left: 10%;margin-right: 10%;width: auto;gap: 15px;">
                    <div style="width: 50%;">
                        ${Components.createElements(
                            {
                                elements: [
                                    Components.createElement("dropdown", {
                                        label: "World type:",
                                        id: "worldType",
                                        items: [
                                            "Infinite World",
                                            "Flat World",
                                            "Void World",
                                            "Old World",
                                            "Single Biome",
                                        ],
                                        selected: 1,
                                        onChange: (e) => GenType( e.value ),
                                    }),
                                ],
                            },
                        )}
                        <div id="genSettings"></div>
                        ${Components.createElement("button", {
                            label: "Generate",
                            id: "generatePack",
                            variant: "hero",
                            sound: "ui.release",
                            onClick: async () => {
                                const worldType = Number(document.getElementById( "worldType" ).getAttribute( "value" ));
                                worldData.value.RandomSeed.value = randomSeed();
                                worldData.value.FlatWorldLayers.value = JSON.stringify(
                                    worldType == 2
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
                        })}
                        <div style="height: 16px;"></div>
                    </div>
                    <div style="width: 100%;">
                        <div id="genElement"></div>
                    </div>
                </div>`
            )
        );
    },
    onLoad: () => GenType(1),
};

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

const gameModes = [
    { name: "Survival", value: 0 },
    { name: "Creative", value: 1 },
    { name: "Adventure", value: 2 },
    { name: "Spectator", value: 6 },
];

let flatWorldLayers = {
    biome_id: 1,
    world_version: "version.post_1_18",
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
};

let voidWorld = {
    biome_id: 1,
    world_version: "version.post_1_18",
    block_layers: [],
    encoding_version: 6,
    structure_options: null,
};

const updateFlatLayers = () => {
    document.getElementById( "flatLayers" ).innerHTML = flatWorldLayers.block_layers.map(
        (layer, index) => (
            `${Components.createElement("element", { label: `Layer - #${index + 1}` })}
            ${Components.createElement("input", {
                label: "Block:",
                id: "block-" + index,
                value: layer.block_name,
                onChange: (e) => {
                    const layer = flatWorldLayers.block_layers.find((layer, i) => i == parseInt(e.id.replace( "block-", "" )));
                    layer.block_name = e.value;
                },
            })}
            ${Components.createElement("input", {
                label: "Count:",
                id: "blockCount-" + index,
                type: "number",
                min: 0,
                max: 64,
                value: `${layer.count}`,
                onChange: (e) => {
                    const layer = flatWorldLayers.block_layers.find((layer, i) => i == parseInt(e.id.replace( "blockCount-", "" )));
                    e.value = parseInt(e.value);
                    layer.count = parseInt(e.value);
                },
            })}
            <div class="element" style="padding: 12px;">
                ${Components.createElement("button", {
                    label: "Remove Layer",
                    id: "removeLayer-" + index,
                    variant: "destructive",
                    sound: "ui.click",
                    onClick: () => {
                        flatWorldLayers.block_layers = flatWorldLayers.block_layers.filter((l, i) => i != index)
                        updateFlatLayers();
                    },
                })}
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
const GenType = async (selection = 0) => {
    const fs = require( "node:fs" );
    const genElement = document.getElementById( "genElement" );
    const genSettings = document.getElementById( "genSettings" );
    const settings = () => (
        `${Components.createElement("element", { label: "World Preferences" })}
        ${Components.createElement("switch", {
            label: "Starting Map",
            id: "startingMap",
            toggled: false,
            onChange: (e) => worldData.value.startWithMapEnabled.value = e.value ? 1 : 0,
        })}
        ${Components.createElement("switch", {
            label: "Bonus Chest",
            id: "bonusChest",
            toggled: false,
            onChange: (e) => worldData.value.bonusChestEnabled.value = e.value ? 1 : 0,
        })}
        ${Components.createElement("switch", {
            label: "Game Rules",
            id: "gameRules",
            toggled: false,
            onChange: (e) => document.getElementById( "gameRulesElement" ).style.display = e.value ? "block" : "none",
        })}
        <div id="gameRulesElement" style="display: none;">
            ${Components.createElement("element", { label: "Game Rules" })}
            ${Components.createElement("switch", {
                label: "Always Day",
                id: "alwaysDay",
                toggled: false,
                onChange: (e) => {
                    worldData.value.dodaylightcycle.value = e.value ? 0 : 1;
                    worldData.value.daylightCycle.value = e.value ? 1 : 0;
                },
            })}
            ${Components.createElement("switch", {
                label: "Keep Inventory",
                id: "keepInventory",
                toggled: false,
                onChange: (e) => worldData.value.keepinventory.value = e.value ? 1 : 0,
            })}
            ${Components.createElement("switch", {
                label: "Mob Spawning",
                id: "mobSpawning",
                toggled: true,
                onChange: (e) => worldData.value.domobspawning.value = e.value ? 1 : 0,
            })}
            ${Components.createElement("switch", {
                label: "Mob Griefing",
                id: "mobGriefing",
                toggled: true,
                onChange: (e) => worldData.value.mobgriefing.value = e.value ? 1 : 0,
            })}
            ${Components.createElement("switch", {
                label: "Weather Cycle",
                id: "weatherCycle",
                toggled: true,
                onChange: (e) => worldData.value.doweathercycle.value = e.value ? 1 : 0,
            })}
            ${Components.createElement("input", {
                label: "Random Tick Speed",
                id: "randomTickSpeed",
                type: "number",
                min: 0,
                max: 4096,
                value: 1,
                onChange: (e) => {
                    e.value = parseInt(e.value);
                    worldData.value.randomtickspeed.value = parseInt(e.value);
                },
            })}
        </div>`
    );

    switch(selection) {
        case 0:
        {
            fs.readFile(
                __dirname + "/src/data/World.mcworld",
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
                                    worldData.value.LevelName.value = "Infinite World - Bedrock Tools";
                                },
                            );
                        },
                    );
                },
            );

            genSettings.innerHTML = "";
            genElement.innerHTML = Components.createElements(
                {
                    elements: [
                        Components.createElement("element", { label: "Infinite World" }),
                        Components.createElement("dropdown", {
                            label: "Game Mode:",
                            id: "gameType",
                            selected: 0,
                            items: gameModes.map((b) => b.name),
                            onChange: (e) => {
                                const gamemode = gameModes[e.value];
                                worldData.value.GameType.value = gamemode.value;
                            },
                        }),
                        Components.createElement("dropdown", {
                            label: "Difficulty:",
                            id: "difficulty",
                            selected: 2,
                            items: [
                                "Peaceful",
                                "Easy",
                                "Normal",
                                "Hard",
                            ],
                            onChange: (e) => worldData.value.Difficulty.value = parseInt(e.value),
                        }),
                        settings(),
                    ],
                },
            );

            return;
        };

        case 1:
        {
            fs.readFile(
                __dirname + "/src/data/World.mcworld",
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

            genSettings.innerHTML = Components.createElements(
                {
                    elements: [
                        Components.createElement("dropdown", {
                            label: "Game Mode:",
                            id: "gameType",
                            selected: 0,
                            items: gameModes.map((b) => b.name),
                            onChange: (e) => {
                                const gamemode = gameModes[e.value];
                                worldData.value.GameType.value = gamemode.value;
                            },
                        }),
                        Components.createElement("dropdown", {
                            label: "Difficulty:",
                            id: "difficulty",
                            selected: 2,
                            items: [
                                "Peaceful",
                                "Easy",
                                "Normal",
                                "Hard",
                            ],
                            onChange: (e) => worldData.value.Difficulty.value = parseInt(e.value),
                        }),
                        settings(),
                        Components.createElement("element", { label: "Additional Settings" }),
                        Components.createElement("dropdown", {
                            label: "Biome:",
                            id: "biome",
                            selected: 1,
                            items: Biomes.map((b) => b.identifier),
                            onChange: (e) => {
                                const biome = Biomes[e.value];
                                flatWorldLayers.biome_id = biome.biome_id;
                            },
                        }),
                        Components.createElement("switch", {
                            label: "Start at y -64",
                            id: "startYLevel",
                            toggled: flatWorldLayers.world_version ? true : false,
                            onChange: (e) => {
                                if (e.value) {
                                    flatWorldLayers.world_version = "version.post_1_18";
                                } else flatWorldLayers.world_version = "version.pre_1_18";
                            },
                        }),
                    ],
                },
            );

            genElement.innerHTML = Components.createElements(
                {
                    elements: [
                        Components.createElement("element", { label: "Flat Layers" }),
                        `<div class="element" style="padding: 12px;">
                            ${Components.createElement("button", {
                                label: "+ Add Layer",
                                id: "addLayer",
                                variant: "secondary",
                                sound: "ui.click",
                                onClick: () => addFlatLayer(),
                            })}
                        </div>`,
                        `<div id="flatLayers"></div>`,
                    ],
                },
            );

            return;
        };

        case 2:
        {
            fs.readFile(
                __dirname + "/src/data/World.mcworld",
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

            genSettings.innerHTML = Components.createElements(
                {
                    elements: [
                        Components.createElement("dropdown", {
                            label: "Game Mode:",
                            id: "gameType",
                            selected: 1,
                            items: gameModes.map((b) => b.name),
                            onChange: (e) => {
                                const gamemode = gameModes[e.value];
                                worldData.value.GameType.value = gamemode.value;
                            },
                        }),
                        Components.createElement("dropdown", {
                            label: "Difficulty:",
                            id: "difficulty",
                            selected: 2,
                            items: [
                                "Peaceful",
                                "Easy",
                                "Normal",
                                "Hard",
                            ],
                            onChange: (e) => worldData.value.Difficulty.value = parseInt(e.value),
                        }),
                        settings(),
                    ],
                },
            );

            genElement.innerHTML = Components.createElements(
                {
                    elements: [
                        Components.createElement("element", { label: "Void World" }),
                        Components.createElement("dropdown", {
                            label: "Biome:",
                            id: "biome",
                            selected: 1,
                            items: Biomes.map((b) => b.identifier),
                            onChange: (e) => {
                                const biome = Biomes[e.value];
                                voidWorld.biome_id = biome.biome_id;
                            },
                        }),
                    ],
                }
            );

            return;
        };

        case 3:
        {
            fs.readFile(
                __dirname + "/src/data/World.mcworld",
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

            genSettings.innerHTML = Components.createElements(
                {
                    elements: [
                        Components.createElement("dropdown", {
                            label: "Game Mode:",
                            id: "gameType",
                            selected: 0,
                            items: gameModes.map((b) => b.name),
                            onChange: (e) => {
                                const gamemode = gameModes[e.value];
                                worldData.value.GameType.value = gamemode.value;
                            },
                        }),
                        Components.createElement("dropdown", {
                            label: "Difficulty:",
                            id: "difficulty",
                            selected: 2,
                            items: [
                                "Peaceful",
                                "Easy",
                                "Normal",
                                "Hard",
                            ],
                            onChange: (e) => worldData.value.Difficulty.value = parseInt(e.value),
                        }),
                        settings(),
                    ],
                },
            );

            genElement.innerHTML = Components.createElements(
                {
                    elements: [
                        Components.createElement("element", { label: "Old World" }),
                        Components.createElement("input", {
                            label: "Width (in chunks):",
                            id: "width",
                            type: "number",
                            min: 1,
                            max: 10000,
                            value: 16,
                            onChange: (e) => {
                                e.value = parseInt(e.value);
                                worldData.value.limitedWorldWidth.value = parseInt(e.value);
                            },
                        }),
                        Components.createElement("input", {
                            label: "Depth (in chunks):",
                            id: "depth",
                            type: "number",
                            min: 1,
                            max: 10000,
                            value: 16,
                            onChange: (e) => {
                                e.value = parseInt(e.value);
                                worldData.value.limitedWorldDepth.value = parseInt(e.value);
                            },
                        }),
                        Components.createElement("input", {
                            label: "Center X:",
                            id: "centerX",
                            type: "number",
                            min: 1,
                            max: 10000,
                            value: 0,
                            onChange: (e) => {
                                e.value = parseInt(e.value);
                                worldData.value.LimitedWorldOriginX.value = parseInt(e.value);
                            },
                        }),
                        Components.createElement("input", {
                            label: "Center Z:",
                            id: "centerZ",
                            type: "number",
                            min: 1,
                            max: 10000,
                            value: 0,
                            onChange: (e) => {
                                e.value = parseInt(e.value);
                                worldData.value.LimitedWorldOriginZ.value = parseInt(e.value);
                            },
                        }),
                    ],
                },
            );

            return;
        };

        case 4:
        {
            fs.readFile(
                __dirname + "/src/data/World.mcworld",
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

            genSettings.innerHTML = Components.createElements(
                {
                    elements: [
                        Components.createElement("dropdown", {
                            label: "Game Mode:",
                            id: "gameType",
                            selected: 0,
                            items: gameModes.map((b) => b.name),
                            onChange: (e) => {
                                const gamemode = gameModes[e.value];
                                worldData.value.GameType.value = gamemode.value;
                            },
                        }),
                        Components.createElement("dropdown", {
                            label: "Difficulty:",
                            id: "difficulty",
                            selected: 2,
                            items: [
                                "Peaceful",
                                "Easy",
                                "Normal",
                                "Hard",
                            ],
                            onChange: (e) => worldData.value.Difficulty.value = parseInt(e.value),
                        }),
                        settings(),
                    ],
                },
            );

            genElement.innerHTML = Components.createElements(
                {
                    elements: [
                        Components.createElement("element", { label: "Single Biome" }),
                        Components.createElement("dropdown", {
                            label: "Biome:",
                            id: "biome",
                            selected: 1,
                            items: Biomes.map((b) => b.identifier),
                            onChange: (e) => {
                                const biome = Biomes[e.value];
                                worldData.value.BiomeOverride.value = biome.identifier;
                            },
                        }),
                    ],
                },
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
    /** @override */
    valueOf() {
        return BigInt.asIntN(64, BigInt(this[0]) << 32n) | BigInt.asUintN(32, BigInt(this[1]));
    };
    
    /** @override */
    toString() {
        return this.valueOf().toString();
    };
};

const randomSeed = () => {
    const int1 = parseInt(((Math.random() * 10 - 5) * 500).toString());
    const int2 = parseInt(((Math.random() + 15) * 500).toString());
    const bitInt = new SignedBigInt( int1, int2 );
    return bitInt;
};