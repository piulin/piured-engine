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
import {TWEEN} from "../../../lib/tween.min.js";

class Tap extends GameObject {

    _mesh ;
    _kind ;

    _tweenOpacityEffect ;



    constructor(resourceManager, engine, kind, noteskin ) {

        super(resourceManager, engine);
        this._kind = kind ;
        // this._mesh = this._resourceManager.constructGenericTap( ) ;


        // Create one step out of the five available.
        let tap = this._resourceManager.constructGenericTap( noteskin ) ;
        tap.material.map.repeat.set(1/5,1/2);

        switch (kind) {
            case 'dl':
                tap.material.map.offset.set( 0 , 0 );
                break ;
            case 'ul':
                tap.material.map.offset.set( 1/5 , 0 );
                break ;
            case 'c':
                tap.material.map.offset.set( 2/5 , 0 );
                break ;
            case 'ur':
                tap.material.map.offset.set( 3/5 , 0 );
                break ;
            case 'dr':
                tap.material.map.offset.set( 4/5 , 0 );
                break ;
        }

        this._mesh = tap ;

        this._tweenOpacityEffect = undefined ;

    }

    ready() {

    }

    animate() {

        const time = 250 ;
        const opacityDelay = 100 ;
        this._mesh.material.opacity = 1.0 ;
        this._mesh.scale.set(0.85,0.85) ;

        if ( this._tweenOpacityEffect !== null ) {
            TWEEN.remove(this._tweenOpacityEffect) ;
        }

        this._tweenOpacityEffect = new TWEEN.Tween( this._mesh.material ).to( { opacity: 0 }, time-opacityDelay ).delay(opacityDelay).start();
        new TWEEN.Tween( this._mesh.scale ).to( { x: 1.2, y: 1.2 }, time ).start();

    }

    update(delta) {


    }

    get object () {
        return this._mesh;
    }
}

export {Tap} ;