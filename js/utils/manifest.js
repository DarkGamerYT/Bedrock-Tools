const crypto = require( "node:crypto" );
const scriptingModules = {
	server: [
		{
			module_name: "@minecraft/server",
			versions: [
				{
					version: "1.4.0-beta",
					beta: true,
				},
				{
					version: "1.3.0",
					beta: false,
				},
			],
		},
		{
			module_name: "@minecraft/server-ui",
			versions: [
				{
					version: "1.2.0-beta",
					beta: true,
				},
				{
					version: "1.1.0",
					beta: false,
				},
			],
		},
		{
			module_name: "@minecraft/server-gametest",
			versions: [
				{
					version: "1.0.0-beta",
					beta: true,
				},
			],
		},
		{
			module_name: "@minecraft/server-admin",
			versions: [
				{
					version: "1.0.0-beta",
					beta: true,
				},
			],
		},
		{
			module_name: "@minecraft/server-net",
			versions: [
				{
					version: "1.0.0-beta",
					beta: true,
				},
			],
		},
	],
	client: [
		{
			module_name: "@minecraft/client",
			versions: [
				{
					version: "1.4.0-beta",
					beta: true,
				},
			],
		},
		{
			module_name: "@minecraft/client-ui",
			versions: [
				{
					version: "1.2.0-beta",
					beta: true,
				},
			],
		},
	],
};

class Manifest {
	/**
	 * 
	 * @param { string } name 
	 * @param { string } description 
	 * @param { number } type 
	 * @param { boolean } scriptApi 
	 * @param { boolean } betaScripting 
	 * @param { string[] } modules 
	 * @param { string[] } capabilities 
	 * @returns
	 */
	constructor(
		name,
		description,
		type,
		scriptApi = false,
		betaScripting = false,
		modules = [],
		capabilities = [],
	) {
		const dependencies = [];
		for(const module of modules) {
			const dep = (
				type == 0
				? scriptingModules.client
				: scriptingModules.server
			).find((d) => d.module_name == module);
			if (dep) {
				if (betaScripting) {
					const beta = dep.versions.find((b) => b.beta);
					if(beta) {
						dependencies.push(
							{
								module_name: dep.module_name,
								version: beta.version,
							},
						);
					};
				} else {
					const stable = dep.versions.find((b) => !b.beta);
					if(stable) {
						dependencies.push(
							{
								module_name: dep.module_name,
								version: stable.version,
							},
						);
					};
				}
			};
		};
		
		const manifest = {
			format_version: 2,
			header: {
				name,
				description,
				uuid: crypto.randomUUID(),
				version: [ 0, 1, 0 ],
				min_engine_version: [ 1, 20, 10 ],
			},
			modules: [],
			capabilities,
			dependencies,
			metadata: {
				generated_with: {
					bedrocktools: [
						BedrockTools.version,
					],
				},
  			},
		};

		switch(type) {
			case 0: {
				if(scriptApi) manifest.modules.push(
					{
						type: "client_script",
						language: "javascript",
						uuid: crypto.randomUUID(),
						entry: "scripts/index.js",
						version: [ 0, 1, 0 ]
					}
				);
				else manifest.modules.push(
					{
						type: "resources",
						uuid: crypto.randomUUID(),
						version: [ 0, 1, 0 ],
					},
				);
				
				return manifest;
			};

			case 1: {
				if(scriptApi) manifest.modules.push(
					{
						type: "script",
						language: "javascript",
						uuid: crypto.randomUUID(),
						entry: "scripts/index.js",
						version: [ 0, 1, 0 ]
					}
				);
				else manifest.modules.push(
					{
						type: "data",
						uuid: crypto.randomUUID(),
						version: [ 0, 1, 0 ],
					},
				);
				
				return manifest;
			};

			case 2: {
				manifest.modules.push(
					{
						type: "skin_pack",
						uuid: crypto.randomUUID(),
						version: [ 0, 1, 0 ],
					},
				);

				delete manifest.capabilities;
				delete manifest.dependencies;
				return manifest;
			};
		};
	};
};