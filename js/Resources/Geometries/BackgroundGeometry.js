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


class BackgroundGeometry {

    _backgroundGeometry ;

    constructor() {

        // 138/36 because of the resolution of the image
        // this._backgroundGeometry = new THREE.PlaneBufferGeometry( 2, 2 ) ;
        this._backgroundGeometry = new THREE.PlaneGeometry( 20 , 12 , 1, 1) ;

    }


    get backgroundGeometry() {
        return this._backgroundGeometry;
    }
}