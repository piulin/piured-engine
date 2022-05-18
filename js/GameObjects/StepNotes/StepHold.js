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

class StepHold extends GameObject {

    _stepNote ;
    _holdExtensible ;
    _kind ;
    _padId ;
    _object ;
    _lastGapLength ;
    _endBeat ;
    _originalEndBeat ;
    _timeStamp ;
    holdZDepth = -0.00002 ;
    _id ;

    constructor(resourceManager, stepNote, kind) {
        super(resourceManager);

        this._kind = kind ;
        this._stepNote = stepNote ;

        this._lastGapLength = 0 ;

        this._object = new THREE.Object3D() ;
        this._object.add(this._stepNote.object) ;

    }


    set id(value) {
        this._id = value;
    }


    get id() {
        return this._id;
    }

    get pressed() {
        return this._stepNote.pressed;
    }


    set pressed(value) {
        this._stepNote.pressed = value;
    }


    set endTimeStamp(value) {
        this._timeStamp = value;
    }

    constructHoldExtensible(endBeat, noteskin) {
        this._endBeat = endBeat ;
        this._originalEndBeat = endBeat ;
        this._holdExtensible = new Hold(this._resourceManager,this.kind, noteskin) ;
        this._holdExtensible.object.position.z = this.holdZDepth ;
        this._holdExtensible.object.position.x = this._stepNote.object.position.x ;
        this._object.add(this._holdExtensible.object) ;
    }


    set endBeat(value) {
        this._endBeat = value;
    }


    get originalEndBeat() {
        return this._originalEndBeat;
    }

    get endTimeStamp() {
        return this._timeStamp ;
    }

    get beginTimeStamp() {
        return this._stepNote.timeStamp ;
    }

    get kind(){
        return this._stepNote.kind ;
    }

    get padId(){
        return this._stepNote.padId ;
    }

    get stepNote() {
        return this._stepNote ;
    }

    gapLength() {
        const beginningHoldYPosition = this._stepNote.object.position.y ;
        const endHoldYPosition = this._endBeat ;
        return beginningHoldYPosition - endHoldYPosition ;
    }

    ready() {
        this.updateHoldExtensiblePosition() ;
    }

    updateHoldExtensiblePosition() {
        this._lastGapLength = this.gapLength() ;
        const gap = Math.abs(this._lastGapLength) ;
        this._holdExtensible.size = gap + 0.5 ;

        if (this._lastGapLength >= 0) {
            this._holdExtensible.object.position.y = this._stepNote.object.position.y - this._lastGapLength/2 - 0.25;
        } else {
            this._holdExtensible.object.position.y = this._stepNote.object.position.y - this._lastGapLength/2 + 0.25;
        }


        if (this._lastGapLength <0 && this._holdExtensible.object.scale.y >= 0) {
            this._holdExtensible.object.scale.y *= -1 ;
        } else if (this._lastGapLength >=0 && this._holdExtensible.object.scale.y < 0) {
            this._holdExtensible.object.scale.y *= 1 ;
        }


    }

    update(delta) {

        const gapLength = this.gapLength() ;

        if ( gapLength !== this._lastGapLength ) {
            this.updateHoldExtensiblePosition() ;
        }

    }

    get object () {
        return this._object ;
    }





}

export {StepHold} ;