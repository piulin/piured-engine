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

import {GameObject} from "../GameObject";

class Banner extends GameObject {

    _mesh ;


    constructor(resourceManager) {

        super(resourceManager);

        this._mesh = this._resourceManager.constructJudgmentBanner( ) ;

        // 0.6
        this._mesh.material.map.repeat.set(1,1/6);
        this._mesh.material.map.offset.set(0,0);
        this._mesh.scale.set( 0.6 , 0.6, 1 ) ;
        this._mesh.material.opacity = 0.0 ;


        this.scaleFadeTween = null ;
        this.opacityFadeTween = null ;
        this.burnTween = null ;


    }

    ready() {


    }




    update(delta) {

    }


    animate() {

        // remove scheduled tweens
        if ( this.scaleFadeTween !== null ) {

            TWEEN.remove(this.scaleFadeTween) ;
            TWEEN.remove(this.opacityFadeTween) ;
            TWEEN.remove(this.burnTween) ;


        }


        const diffuseTimeWait = (30/60)*1000 ;
        const diffuseAnimation = (22/60)*1000;
        const time = (4.5/60)*1000     ;

        // schedule going out tweens for JUDGMENT
        this._mesh.material.opacity = 1.0 ;
        let scale = 100.0 ;

        this._mesh.material.color.r = 1.0 ;
        this._mesh.material.color.g = 1.0 ;
        this._mesh.material.color.b = 1.0 ;
        // this._mesh.material.combine = THREE.AddOperation ;
        // this._mesh.material.lightMapIntensity = 5.0 ;
        this._mesh.scale.set(0.6,0.6) ;

        new TWEEN.Tween( this._mesh.material ).to( {opacity: 0.7 } , diffuseTimeWait ).start();

        this._mesh.material.opacity = 0.7 ;
        this.scaleFadeTween = new TWEEN.Tween( this._mesh.scale ).to( { x: 1.5 , y: 0.0 }, diffuseAnimation ).delay(diffuseTimeWait).start();
        this.opacityFadeTween = new TWEEN.Tween( this._mesh.material ).to( { opacity: 0.0 } , diffuseAnimation ).delay(diffuseTimeWait).start();
        this.burnTween = new TWEEN.Tween( this._mesh.material.color ).to( { r:10 ,g:10,b:2 } , 1 ).delay(diffuseTimeWait).start();


        this._mesh.scale.set(0.87, 0.87) ;
        this._mesh.material.opacity = 1.0 ;
        this._mesh.position.y = this._mesh.scale.y / 5;

        //
        new TWEEN.Tween(this._mesh.scale).to({x: 0.6, y: 0.6}, time).start();
        new TWEEN.Tween(this._mesh.position).to({y: 0}, time).start();

    }

    setGrade(grade) {
        switch (grade) {
            case 'p':
                this._mesh.material.map.offset.set(0,5/6) ;
                break ;
            case 'gr':
                this._mesh.material.map.offset.set(0,4/6) ;
                break;
            case 'go':
                this._mesh.material.map.offset.set(0,2/6) ;
                break;
            case 'b':
                this._mesh.material.map.offset.set(0,1/6) ;
                break;
            case 'm':
                this._mesh.material.map.offset.set(0,0) ;
                break;

        }
    }


    get object () {
        return this._mesh;
    }
}

export {Banner} ;