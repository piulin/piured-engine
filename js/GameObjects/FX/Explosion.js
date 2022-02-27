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

class Explosion extends GameObject {

    _mesh ;
    _explosionAnimationRate ;
    _lastStepTimeStamp ;
    _animationPosition ;


    constructor(resourceManager, noteskin) {

        super(resourceManager);
        this._explosionAnimationRate = 20 ;
        this._mesh = this._resourceManager.constructExplosion( noteskin ) ;

    }

    ready() {

        // This acts as UV mapping.
        this._mesh.material.map.repeat.set(2/20,2/4);
        // explosionMap.offset.set( 0 , 0 );
        this._mesh.material.map.offset.set(  1/20 , 1/4 );

        // explosionMap.blending = THREE.AdditiveBlending ;

        // Augment the brightness of the explosion
        let scale = 1.0 ;

        this._mesh.material.color.r = scale ;
        this._mesh.material.color.g = scale ;
        this._mesh.material.color.b = scale ;


        this._mesh.scale.x = 2.5 ;
        this._mesh.scale.y = 2.5 ;

        this._lastStepTimeStamp = 0 ;
        this._animationPosition = 10 ;



    }

    set animationPosition(value){
        this._animationPosition = value ;
    }

    animate() {
        this._animationPosition = 0 ;
        this._lastStepTimeStamp = 0 ;
        this._mesh.material.map.offset.set( 1 / 20, 1 / 4);
    }

    update(delta) {


        if (this._animationPosition <= 4 ) {


            let timeStamp = this._lastStepTimeStamp + delta;
            this._mesh.material.opacity = 1.0;
            let movement = timeStamp * this._explosionAnimationRate;

            if (movement > 1) {
                this._animationPosition = (this._animationPosition + 1);
                this._mesh.material.map.offset.set(this._animationPosition * (1 / 5) + 1 / 20, 1 / 4);

                this._lastStepTimeStamp = 0;

            } else {
                this._lastStepTimeStamp += delta;
            }
        } else {
            this._mesh.material.opacity = 0.0;
        }



    }


    get object () {
        return this._mesh;
    }
}