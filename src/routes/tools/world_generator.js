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
                                        onChange: (e) => {
                                            const genElement = document.getElementById( "genElement" );
                                            genElement.innerHTML = GenType( e.value );
                                        },
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

                                const packName = document.getElementById( "packName" ).value;
                                const packDescription = document.getElementById( "packDescription" ).value;
                                const packType = Number(document.getElementById( "packType" ).value);
                                const isMinified = Number(document.getElementById( "layout" ).value) == 1;

                                const manifest = new Manifest(
                                    packName,
                                    packDescription,
                                    packType,
                                    scriptAPI,
                                    beta,
                                    scriptModules,
                                    [],
                                );
                                
                                const stringManifest = isMinified ? JSON.stringify( manifest ) : JSON.stringify(manifest, null, "\t");
                                const highlightedText = hljs.highlight(stringManifest, { language: "json" }).value;
                                document.getElementById("output").innerHTML = highlightedText;
                                navigator.clipboard.writeText( stringManifest );
                            },
                        },
                    )}
                </div>`
            )
        );
    },
    extra: () => document.getElementById( "genElement" ).innerHTML = GenType( "0" ),
});

const Biomes = [
    "plains",
    "desert",
    "windswept_hills",
    "forest",
    "taiga",
    "swampland",
    "river",
    "hell",
    "the_end",
    "frozen_ocean",
    "frozen_river",
    "ice_plains",
    "ice_mountains",
    "mushroom_island",
    "mushroom_island_shore",
    "beach",
    "ocean",
    "desert_hills",
    "forest_hills",
    "taiga_hills",
    "extreme_hills_edge",
    "jungle",
    "jungle_hills",
    "jungle_edge",
    "deep_ocean",
    "stone_beach",
    "cold_beach",
    "birch_forest",
    "birch_forest_hills",
    "roofed_forest",
    "cold_taiga",
    "cold_taiga_hills",
    "mega_taiga",
    "mega_taiga_hills",
    "windswept_forest",
    "savanna",
    "savanna_plateau",
    "mesa",
    "mesa_plateau",
    "mesa_plateau_stone",
    "warm_ocean",
    "lukewarm_ocean",
    "cold_ocean",
    "deep_warm_ocean",
    "deep_lukewarm_ocean",
    "deep_cold_ocean",
    "deep_frozen_ocean",
    "legacy_frozen_ocean",
    "sunflower_plains",
    "desert_mutated",
    "windswept_gravelly_hills",
    "flower_forest",
    "taiga_mutated",
    "swampland_mutated",
    "ice_plains_spikes",
    "jungle_mutated",
    "jungle_edge_mutated",
    "birch_forest_mutated",
    "birch_forest_hills_mutated",
    "roofed_forest_mutated",
    "cold_taiga_mutated",
    "redwood_taiga_mutated",
    "redwood_taiga_hills_mutated",
    "extreme_hills_plus_trees_mutated",
    "savanna_mutated",
    "savanna_plateau_mutated",
    "mesa_bryce",
    "mesa_plateau_mutated",
    "mesa_plateau_stone_mutated",
    "bamboo_jungle",
    "bamboo_jungle_hills",
    "soulsand_valley",
    "crimson_forest",
    "warped_forest",
    "basalt_deltas",
    "jagged_peaks",
    "frozen_peaks",
    "snowy_slopes",
    "grove",
    "meadow",
    "lush_caves",
    "dripstone_caves",
    "stony_peaks",
    "deep_dark",
    "mangrove_swamp",
    "cherry_grove"
];

const GenType = (selection = "0") => {
    switch(selection) {
        case "0":
        {
            return (
                `${Components.createElements(
                    {
                        elements: [
                            Components.createElement(
                                {
                                    type: "element",
                                    title: "Flat Layers",
                                },
                            ),
                            `<div style="margin: 12px;">
                                ${
                                    Components.createElement(
                                        {
                                            type: "button",
                                            text: "+ Add Layer",
                                            id: "addLayer",
                                            style: "secondary",
                                            onClick: () => {},
                                        },
                                    )
                                }
                            </div>`,
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
                                    items: Biomes,
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
        };

        case "1": {
            return Components.createElements(
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
                                items: Biomes,
                                onChange: (e) => {},
                            },
                        ),
                    ],
                },
            );
        };

        case "2": {
            return Components.createElements(
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
        };

        case "3": {
            return Components.createElements(
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
                                items: Biomes,
                                onChange: (e) => {},
                            },
                        ),
                    ],
                },
            );
        };

        default: return "";
    };
};