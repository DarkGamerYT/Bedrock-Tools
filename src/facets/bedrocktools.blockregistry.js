const BABYLON = require("babylonjs");

class BlockRegistry {
    /**
     * 
     * @param {String} rootPath 
     */
    constructor(rootPath = "") {
        /** @type {Array<Block>} */
        this.blocks = [];
        /** @type {String} */
        this.rootTexturePath = rootPath;
    }

    /**
     * 
     * @param {String} name 
     * @param {BlockOptions} options 
     */
    registerBlock(name, options = null) {
        if (!options) options = new BlockOptions();
        const foundBlock = this.blocks.findIndex(x => x.name == name);
        if (foundBlock != -1) return this.blocks[foundBlock];

        const texturePaths = ["", "", "", "", "", ""];
        if (typeof options.textures == "string")
            for (let i = 0; i < texturePaths.length; i++) texturePaths[i] = `${this.rootTexturePath}/${options.textures}`;
        else {
            for (let i = 0; i < texturePaths.length; i++) texturePaths[i] = `${this.rootTexturePath}/${options.textures[i]}`;
        }

        const block = new Block(name, texturePaths);
        block.isVisible = options.isVisible;
        this.blocks.push(block);
        return block;
    }

    /**
     * @argument {String} name
    */
    getBlock(name)
    {
        const foundBlock = this.blocks.findIndex(x => x.name == name);
        if (foundBlock != -1) return this.blocks[foundBlock];
        return null;
    }

    //Clear the array
    dispose()
    {
        this.blocks = [];
    }
}

class BlockOptions {
    constructor() {
        /** @type {Boolean} */
        this.isVisible = true; //usually false for air blocks.
        /** @type {Boolean} */
        this.opaque = true;
        /** The block material(s) for this voxel's faces. May be:
        *   * one (String) material name
        *   * array of 2 names: [top/bottom, sides]
        *   * array of 3 names: [top, bottom, sides]
        *   * array of 6 names: [-x, +x, -y, +y, -z, +z]
        * @type {String|Array<String>}
        */
        this.textures = `missing_texture.png`;
        /** Custom mesh for the block */
        this.customMesh = null;
    }
}

class Block {
    /**
     * @argument {String} name
     * @argument {Array<String>} textures
     */
    constructor(name, textures) {
        /** @type {String} */
        this.name = name;
        /** @type {Boolean} */
        this.isOpaque = true;
        /** @type {Boolean} */
        this.isVisible = true;
        /** @type {undefined|BABYLON.Mesh} */
        this.customMesh = null;
        /** @type {Array<String>}*/
        this.textures = textures
    }
}

module.exports = { BlockRegistry, BlockOptions }