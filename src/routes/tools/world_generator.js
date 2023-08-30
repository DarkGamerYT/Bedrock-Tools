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
                            onClick: () => {
                                window.sound.play( "ui.release" );
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

const flatWorldLayers = {
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
                        console.log(e.id, e.value);
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

const GenType = (selection = "0") => {
    const genElement = document.getElementById( "genElement" );
    switch(selection) {
        case "0":
        {
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
                                    title: "Biome:",
                                    id: "biome",
                                    selected: 1,
                                    items: Biomes.map((b) => b.identifier),
                                    onChange: (e) => {},
                                },
                            ),
                            Components.createElement(
                                {
                                    type: "toggle",
                                    title: "Start at y -64",
                                    toggled: false,
                                    onClick: (e) => {},
                                },
                            ),
                        ],
                    },
                )}`
            );

            updateFlatLayers();
            return;
        };

        case "1":
        {
            genElement.innerHTML = Components.createElements(
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
                                onChange: (e) => {},
                            },
                        ),
                    ],
                },
            );

            return;
        };

        case "2":
        {
            genElement.innerHTML = Components.createElements(
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
                                value: 4,
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
                                value: 18,
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
                            },
                        ),
                    ],
                },
            );

            return;
        };

        case "3":
        {
            genElement.innerHTML = Components.createElements(
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
                                onChange: (e) => {},
                            },
                        ),
                    ],
                },
            );

            return;
        };

        default: return "";
    };
};