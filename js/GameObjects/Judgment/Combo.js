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

class Combo extends GameObject {

    _mesh ;

    _object ;


    constructor(resourceManager) {

        super(resourceManager);

        this._mesh = this._resourceManager.constructCombo( ) ;

        this._mesh.material.map.repeat.set (1,1/2) ;
        this._mesh.material.map.offset.set (0, 1/2 );

        this._mesh.scale.set(0.37, 0.37) ;
        this._mesh.material.opacity = 0.0 ;
        this.scaleFadeTween = null ;
        this.opacityFadeTween = null ;

        this._object = new THREE.Object3D() ;
        this.object.add(this._mesh) ;
        //

    }

    ready() {


    }


    animate() {

        const diffuseTimeWait = (30/60)*1000 ;
        const diffuseAnimation = (22/60)*1000;
        const time = (5/60)*1000     ;

        if ( this.tweenOpacityEffect !== null ) {
            TWEEN.remove(this.scaleFadeTween) ;
            TWEEN.remove(this.opacityFadeTween) ;
        }

        // similarly we update the tweens for the combo label
        this._mesh.material.opacity = 1.0;
        this._mesh.scale.set(0.37, 0.37);
        this.scaleFadeTween = new TWEEN.Tween(this._mesh.scale).to({
            x: 0.97,
            y: 0.0
        }, diffuseAnimation).delay(diffuseTimeWait).start();

        new TWEEN.Tween( this._mesh.material ).to( { opacity: 0.7 } , diffuseTimeWait ).start();

        this._mesh.material.opacity = 0.7 ;

        this.opacityFadeTween = new TWEEN.Tween(this._mesh.material).to({opacity: 0.0}, diffuseAnimation).delay(diffuseTimeWait).start();

        this._mesh.scale.set(0.63, 0.73);
        this._mesh.material.opacity = 1.0;
        this._mesh.position.y = - this._mesh.scale.y / 6;


        new TWEEN.Tween(this._mesh.scale).to({x: 0.37, y: 0.37}, time).start();
        new TWEEN.Tween(this._mesh.position).to({y: 0}, time).start();
    }


    update(delta) {

    }


    get object () {
        return this._object;
    }
}