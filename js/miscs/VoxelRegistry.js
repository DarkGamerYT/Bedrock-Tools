class VoxelRegistry
{
    /**
     * 
     * @param {String} rootPath 
     */
    constructor(rootPath = "")
    {
        /** @type {Array<BlockMaterial>} */
        this.blockMaterials = [];
        /** @type {Array<Block>} */
        this.blocks = [];
        /** @type {String} */
        this.rootTexturePath = rootPath;
    }

    /**
     * 
     * @param {String} name 
     * @param {MaterialOptions} options 
     */
    registerMaterial(name, options = null)
    {
        if(!options) options = new MaterialOptions();

        const mat = this.blockMaterials.findIndex(x => x.name == name);
        if(mat != -1) return;

        const textureURL = options.textureURL? `${this.rootTexturePath}${options.textureURL}` : "";
        const color = options.color || [1.0, 1.0, 1.0];

        const blockMat = new BlockMaterial(name, textureURL, color, options.textureHasAlpha);
        this.blockMaterials.push(blockMat);
    }

    /**
     * 
     * @param {Number} id 
     * @param {BlockOptions} options 
     */
    registerBlock(id, options = null)
    {
        if(!options) options = new BlockOptions();

        if(id < 0 || id > this.blockMaterials.length) throw 'Block ID out of range!';
        if(this.blocks.findIndex(x => x.id == id) != -1) throw 'Id already registered to a block!';

        const mat = options.material || null;
        var mats;
        if(!mat) mats = [null,null,null,null,null];
        else if (typeof mat == 'string') {
            mats = [mat, mat, mat, mat, mat, mat]
        } else if (mat.length && mat.length == 3) {
            //Interpret as up,down,front,back,left,right
            mats = [mat[2], mat[2], mat[0], mat[1], mat[2], mat[2]]
        } else if (mat.length && mat.length == 6) {
            mats = mat
        } else throw 'Invalid material input!';

        const blockMaterials = [0,0,0,0,0,0]
        for (var i = 0; i < 6; i++) {
            blockMaterials[i] = this.getMaterialId(mats[i]);
        }

        const block = new Block(id, blockMaterials);
        this.blocks.push(block);
    }

    /**
     * 
     * @param {String} name 
     */
    getMaterialId(name)
    {
        if(!name) return 0;
        const id = this.blockMaterials.findIndex(x => x.name == name);
        if(id == -1) return 0;
        return id;
    }
}

//Options
class MaterialOptions
{
    constructor()
    {
        /** @type {Array<Number>} */
        this.color = null;
        /** @type {String} */
        this.textureURL = null;
        /** @type {Boolean} */
        this.textureHasAlpha = false;
    }
}

class BlockOptions
{
    constructor()
    {
        /** @type {Boolean} */
        this.opaque = true;
        /** The block material(s) for this voxel's faces. May be:
        *   * one (String) material name
        *   * array of 2 names: [top/bottom, sides]
        *   * array of 3 names: [top, bottom, sides]
        *   * array of 6 names: [-x, +x, -y, +y, -z, +z]
        * @type {string|string[]}
        */
        this.material = null;
        /** Custom mesh for the block */
        this.customMesh = null;
    }
}

//Objects
class BlockMaterial
{
    /**
     * @argument {String} name
     * @argument {String} textureURL
     * @argument {Array<Number>} color
     * @argument {Boolean} hasAlpha
     */
    constructor(name, textureURL, color, hasAlpha)
    {
        /** @type {String} */
        this.name = name;
        /** @type {String} */
        this.textureURL = textureURL
        /** @type {Array<Number>} */
        this.color = color;
        /** @type {Boolean} */
        this.textureHasAlpha = hasAlpha;
    }
}

class Block
{
    /**
     * @argument {Number} name
     * @argument {Array<Number>} materials
     */
    constructor(id, materials)
    {
        this.id = id;
        this.opaque = true;
        this.customMesh = null;
        this.materials = [0,0,0,0,0,0]
    }
}