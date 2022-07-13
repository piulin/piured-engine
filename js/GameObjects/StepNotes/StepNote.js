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

class StepNote extends GameObject {

    _mesh ;
    _kind ;
    _padId ;

    _timeStamp ;
    _pressed ;

    _id ;


    constructor(resourceManager, engine, kind, padId, timeStamp, noteskin) {
        super(resourceManager, engine);

        this._kind = kind ;
        this._padId = padId ;
        this._mesh = this._resourceManager.constructStepNote( this._kind, noteskin ) ;
        this._timeStamp = timeStamp ;
    }


    ready() {



        this._pressed = false ;

    }


    set id(value) {
        this._id = value;
    }


    get id() {
        return this._id;
    }

    update(delta) {

    }


    get pressed() {
        return this._pressed;
    }


    set pressed(value) {
        this._pressed = value;
    }

    get kind() {
        return this._kind ;
    }

    get padId() {
        return this._padId ;
    }

    get timeStamp( ) {
        return this._timeStamp ;
    }

    get object () {
        return this._mesh;
    }
}

export {StepNote} ;