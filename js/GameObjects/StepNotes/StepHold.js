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

class StepHold extends GameObject {

    _stepNote ;
    _endNote ;
    _holdExtensible ;
    _kind ;
    _padId ;

    _object ;

    _lastGapLength ;
    _timeStamp ;

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


    set holdExtensible(value) {
        this._holdExtensible = value;
        this._object.add(value.object) ;
    }


    set endTimeStamp(value) {
        this._timeStamp = value;
    }

    set endNote(value) {
        this._endNote = value;
        this._object.add(value.object) ;
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

    get endNote() {
        return this._endNote ;
    }

    ready() {

        this._lastGapLength = this.gapLength() ;
        this.updateHoldExtensiblePosition(this._lastGapLength) ;
        // this._holdExtensible.object.originalYPos = this._holdExtensible.object.position.y ;
        if ( this._lastGapLength < 1 ) {
            this.updateHoldEndNoteProportion(this._lastGapLength) ;
        }

    }

    update(delta) {

        const gapLength = this.gapLength() ;

        if ( gapLength !== this._lastGapLength ) {
            this._lastGapLength = gapLength ;
            this.updateHoldExtensiblePosition(gapLength) ;

            // console.log(gapLength) ;

            if ( gapLength < 1 ) {
                this.updateHoldEndNoteProportion(gapLength) ;
            } else {
                this.updateHoldEndNoteProportion(1) ;
            }
        }

    }

    get object () {
        return this._object ;
    }

    gapLength() {
        const beginningHoldYPosition = this._stepNote.object.position.y ;
        const endHoldYPosition = this._endNote.object.position.y ;

        return beginningHoldYPosition - endHoldYPosition ;
    }



    updateHoldExtensiblePosition(gapLength) {
        const beginningHoldYPosition = this._stepNote.object.position.y ;
        const endHoldYPosition = this._endNote.object.position.y ;



        this._holdExtensible.object.scale.y = gapLength ;
        // -0.5 to shift it to the center
        this._holdExtensible.object.position.y = beginningHoldYPosition - gapLength*0.5 ;


    }

    updateHoldEndNoteProportion(gapLength) {

        let holdEndNote = this._endNote ;
        // End note problem: we have to shrink it when it overlaps with the step Note.
        // holdScale is the distance between the step note and the end hold note.

        // Option with no shaders.


        // shift to the middle of the step.
        const distanceStepNoteEndNote = gapLength + 0.5 ;

        let difference = holdEndNote.object.scale.y - distanceStepNoteEndNote ;
        holdEndNote.object.scale.y = distanceStepNoteEndNote ;
        holdEndNote.object.position.y -= difference*0.5 ;

        // update also texture to keep aspect ratio
        holdEndNote.object.material.map.repeat.set(1/6, (1/3)*distanceStepNoteEndNote ) ;


    }



}