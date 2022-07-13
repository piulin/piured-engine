/*
 * # Copyright (C) Pedro G. Bascoy
 # This file is part of piured-engine <https://github.com/piulin/piured-engine>.
 #
 # piured-engine is free software: you can redistribute it and/or modify
 # it under the terms of the GNU General Public License as published by
 # the Free Software Foundation, either version 3 of the License, or
 # (at your option) any later version.
 #
 # piured-engine is distributed in the hope that it will be useful,
 # but WITHOUT ANY WARRANTY; without even the implied warranty of
 # MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 # GNU General Public License for more details.
 #
 # You should have received a copy of the GNU General Public License
 # along with piured-engine.If not, see <http://www.gnu.org/licenses/>.
 *
 */
"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



import {GameObject} from "../GameObject.js";

class Hold extends GameObject {

    _mesh ;
    _kind ;


    constructor(resourceManager, engine, kind, noteskin) {
        super(resourceManager, engine);

        this._kind = kind ;
        this._mesh = this._resourceManager.constructHoldExtensible( this._kind, noteskin ) ;


    }

    repeat(nu,nv) {
        var uvAttribute = this._mesh.geometry.attributes.uv;
        uvAttribute.needsUpdate = true ;
        let uvs = [[0,1],[1,1],[0,0],[1,0]];
        for ( var i = 0; i < uvAttribute.count; i ++ ) {
            const [ou, ov] = uvs[i] ;

            const u = nu*ou ;
            const v = nv*ov ;
            uvAttribute.setXY( i, u, v );

        }
    }

    offset(nu,nv) {
        var uvAttribute = this._mesh.geometry.attributes.uv;
        uvAttribute.needsUpdate = true ;
        let uvs = [[0,1],[1,1],[0,0],[1,0]];
        for ( var i = 0; i < uvAttribute.count; i ++ ) {
            const [ou, ov] = uvs[i] ;
            const u = nu+ou ;
            const v = nv+ov ;
            uvAttribute.setXY( i, u, v );
        }
    }

    set size(val) {
        this.repeat(1/6,(1/3)*val) ;
        this._mesh.scale.y = val ;
    }

    ready() {

    }

    update(delta) {

    }

    get object () {
        return this._mesh;
    }
}

export {Hold} ;