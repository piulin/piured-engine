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
import {Banner} from "./Banner";
import {Combo} from "./Combo";
import {Digits} from "./Digits";

class Judgment extends GameObject {

    _banner ;
    _combo ;
    _whiteDigits ;



    _object ;


    constructor(resourceManager, ) {

        super(resourceManager);


        this.judgmentZDepth = 0.00002;
        this.maxNumDigits = 5 ;

        this._object = new THREE.Object3D() ;


        this._banner = new Banner(this._resourceManager) ;
        this._banner.object.position.z = this.judgmentZDepth ;
        this._object.add(this._banner.object) ;


        this._combo = new Combo(this._resourceManager) ;
        this.comboYPosition = this._banner.object.position.y - 0.50 ;
        this._combo.object.position.z = this.judgmentZDepth ;
        this._combo.object.position.y = this.comboYPosition ;
        this._object.add(this._combo.object) ;



        this._whiteDigits = new Digits(this._resourceManager, this.maxNumDigits) ;
        this._whiteDigits.object.position.z = this.judgmentZDepth ;
        this._whiteDigits.object.position.y = this.comboYPosition - 0.35;
        this._object.add(this._whiteDigits.object) ;


    }

    ready() {

        this._banner.setGrade('p') ;
        this._whiteDigits.displayComboCount(0) ;

    }

    update(delta) {

    }

    animate(grade, comboCount) {

        this._banner.animate() ;
        this._banner.setGrade(grade)

        if ( comboCount > 3 ) {
            this._whiteDigits.displayComboCount(comboCount) ;
            this._combo.animate() ;
            this._whiteDigits.animate() ;
        }

    }



    get object () {
        return this._object;
    }
}

export {Judgment} ;