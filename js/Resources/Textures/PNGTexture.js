"use strict" ;


class PNGTexture {


    _map ;

    constructor(texturePath) {

        this.clonedTextures = [] ;
        let clonedTexturesLocal = this.clonedTextures ;
        let mapLocal =  new THREE.TextureLoader().load( texturePath ,
            function (){
            for ( const map of clonedTexturesLocal ) {
                map.image = mapLocal.image;
                map.needsUpdate = true ;
            }
        }) ;


        this._map = mapLocal ;

        // to accurately represent the colors
        this._map.encoding = THREE.sRGBEncoding;



    }

    get map() {
        return this._map ;
    }

    cloneMap() {

        const cloned = this._map.clone();
        this.clonedTextures.push( cloned ) ;
        cloned.needsUpdate = true ;
        return cloned ;

    }
}