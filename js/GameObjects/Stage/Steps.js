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


import {StepNote} from "../StepNotes/StepNote";
import {StepHold} from "../StepNotes/StepHold";
import {GameObject} from "../GameObject";

class Steps extends GameObject {

    _object ;
    _noteskin ;
    receptorZDepth ;
    holdZDepth ;
    holdEndNoteZDepth ;
    stepNoteZDepth ;
    dlXPos ;
    ulXPos ;
    cXPos ;
    urXPos ;
    drXPos ;
    receptorsApart ;
    stepTextureAnimationRate ;
    lastEffectSpeed ;
    effectSpeed ;
    effectSpeed2 ;
    newTargetSpeed ;
    stepQueue ;
    beatManager ;
    _speedTween ;
    padSteps ;
    stepList ;
    _song ;
    _level ;
    _userSpeed ;
    idLeftPad ;
    idRightPad ;
    keyListener ;
    id ;

    constructor(resourceManager,
                stepQueue,
                beatManager,
                song,
                level,
                userSpeed,
                idLeftPad,
                idRightPad,
                keyListener,
                noteskin) {
        super(resourceManager);


        // Set up positions for steps
        this.configureStepConstantsPositions() ;

        // For managing changes of SPEED (by tweening)
        this.lastEffectSpeed = 1;
        this.effectSpeed = 1;
        this.newTargetSpeed = 1 ;
        this._noteskin = noteskin ;

        //stepQueue to initialize (or use)
        this.stepQueue = stepQueue ;

        this.beatManager = beatManager ;
        this._song = song ;
        this._level = level ;
        this._userSpeed = userSpeed ;
        this.idLeftPad = idLeftPad ;
        this.idRightPad = idRightPad ;
        this.keyListener = keyListener ;

        //
        this._object = new THREE.Object3D() ;

        // to store leftmost and rightmost steps.
        this.padSteps = {} ;
        this.stepList = [] ;

        // to assign steps uniq ids.
        this.id = new Id() ;

        this.constructSteps() ;



    }

    constructSteps() {

        //leftside (5 left-most steps)
        let Lsteps ;
        let Rsteps = null ;

        // if level is single, then we construct only the 5 leftmost steps
        if ( this._song.getLevelStyle(this._level) === 'pump-single' || this._song.getLevelStyle(this._level) === 'pump-double'  ) {
            Lsteps = this.composePad(0, this.idLeftPad) ;
        } else if ( this._song.getLevelStyle(this._level) === 'pump-halfdouble' ) {
            Lsteps = this.composePad( -2, this.idLeftPad );
        }


        // only if the level is double or halfdouble, we also construct the 5 rightmost steps
        if ( this._song.getLevelStyle(this._level) !== 'pump-single' ) {

            // change position of leftmost steps
            Lsteps.position.x = -this.receptorsApart ;

            // build rightmost steps
            if ( this._song.getLevelStyle(this._level) === 'pump-double' ) {
                Rsteps = this.composePad(5, this.idRightPad);
            } else if ( this._song.getLevelStyle(this._level) === 'pump-halfdouble' ) {
                Rsteps = this.composePad(3, this.idRightPad);
            }

            // position rightmost steps
            Rsteps.position.x = this.receptorsApart ;

        }


        this.padSteps[this.idLeftPad] = Lsteps ;
        this._object.add(Lsteps) ;


        if ( Rsteps !== null ) {
            this._object.add(Rsteps) ;
            this.padSteps[this.idRightPad] = Rsteps ;
        }

        // clean empty step slots.
        this.stepQueue.cleanUpStepQueue() ;

    }



    configureStepConstantsPositions () {
        // Depth of stage elements
        this.receptorZDepth = -0.00003 ;
        this.holdZDepth = -0.00002 ;
        this.holdEndNoteZDepth = -0.00001 ;
        this.stepNoteZDepth = 0.00001;

        // define position of the notes w.r.t. the receptor

        // Space to the right or left of a given step.
        const stepShift = 4/5;
        // Note that the receptor steps are a bit overlapped. This measure takes into
        // acount this overlap.
        const stepOverlap = 0.02 ;
        this.dlXPos =  -2*(stepShift - stepOverlap) ;
        this.ulXPos =  -(stepShift - stepOverlap) ;
        this.cXPos =  0 ;
        this.urXPos =  (stepShift - stepOverlap) ;
        this.drXPos =  2*(stepShift - stepOverlap) ;

        this.receptorsApart = 1.96 ;
        this.stepTextureAnimationRate = 30 ;

    }

    composePad(stepDataOffset, padId) {


        // object containing all the steps of the given Pad.
        let steps = new THREE.Object3D();

        const noteData = this._song.levels[this._level].NOTES;


        let listIndex = 0;
        // i loops the bars
        for (var i = 0; i < noteData.length; i++) {

            const measure = noteData[i];

            const notesInBar = measure.length;

            // j loops the notes inside the bar
            for (var j = 0; j < measure.length; j++) {

                listIndex += 1;
                const note = measure[j];

                // calculate current beat
                const beat = (4*i + 4*j/notesInBar) ;
                const [currentYPosition, currentTimeInSong] = this.beatManager.getYShiftAndCurrentTimeInSongAtBeat(beat);

                // Add only if the entry is not created already
                if (listIndex > this.stepQueue.getLength()) {
                    this.stepQueue.addNewEntryWithTimeStampInfo(currentTimeInSong);
                }

                // dl
                this.processNote(
                    note[0 + stepDataOffset],
                    'dl',
                    currentYPosition,
                    this.dlXPos,
                    steps,
                    currentTimeInSong,
                    listIndex - 1,
                    padId,
                    i,
                    j,
                    beat);


                //ul
                this.processNote(
                    note[1 + stepDataOffset],
                    'ul',
                    currentYPosition,
                    this.ulXPos,
                    steps,
                    currentTimeInSong,
                    listIndex - 1,
                    padId,
                    i,
                    j,
                    beat);

                // c
                this.processNote(
                    note[2 + stepDataOffset],
                    'c',
                    currentYPosition,
                    this.cXPos,
                    steps,
                    currentTimeInSong,
                    listIndex - 1,
                    padId,
                    i,
                    j,
                    beat);

                // ur
                this.processNote(
                    note[3 + stepDataOffset],
                    'ur',
                    currentYPosition,
                    this.urXPos,
                    steps,
                    currentTimeInSong,
                    listIndex - 1,
                    padId,
                    i,
                    j,
                    beat);

                // dr
                this.processNote(
                    note[4 + stepDataOffset],
                    'dr',
                    currentYPosition,
                    this.drXPos,
                    steps,
                    currentTimeInSong,
                    listIndex - 1,
                    padId,
                    i,
                    j,
                    beat);

            }

        }

        return steps ;
    }


    processNote(note, kind, currentYPosition, XStepPosition , steps, currentTimeInSong, index,  padId, i,j, beat ) {


        // Process StepNote
        if ( note === '1' || note === '2' ) {

            // let step = this.stepFactory.getStep(kind);
            let step = new StepNote( this._resourceManager, kind, padId, currentTimeInSong, this._noteskin ) ;

            let stepMesh = step.object ;

            stepMesh.position.y = currentYPosition ;
            stepMesh.originalYPos = currentYPosition ;
            stepMesh.position.x = XStepPosition ;
            stepMesh.position.z = this.stepNoteZDepth ;


            if (note === '2') {

                let stepHold = new StepHold(this._resourceManager, step, kind ) ;

                // don't add steps into the stepqueue if they are inside a warp section
                if (!this.beatManager.isNoteInWarp(beat)) {
                    this.stepQueue.addStepToStepList(stepHold, index, i,j) ;
                }
                this.stepQueue.setHold(kind, padId, stepHold) ;
                this.stepList.push(stepHold) ;

            } else {

                // don't add steps into the stepqueue if they are inside a warp section
                if (!this.beatManager.isNoteInWarp(beat)) {
                    this.stepQueue.addStepToStepList(step, index, i, j);
                }
                steps.add(stepMesh) ;
                this.stepList.push(step) ;
            }

        }

        // Process StepHold
        if ( note === '3' ) {

            let holdObject = this.stepQueue.getHold( kind , padId ) ;

            holdObject.constructHoldExtensible(currentYPosition, this._noteskin) ;

            holdObject.endTimeStamp = currentTimeInSong ;
            steps.add(holdObject.object) ;

        }

    }

    updateCurrentSpeed() {

        this.effectSpeed = this.beatManager.getCurrentSpeed() ;

    }

    animateSpeedChange() {

        if (this.lastEffectSpeed !== this.effectSpeed ) {

            let effectSpeed = this.effectSpeed ;

            this.stepList.forEach((step) => {

                if (step instanceof StepNote) {
                    // apply new speed
                    step.object.position.y = effectSpeed*step.object.originalYPos;
                } else if (step instanceof  StepHold) {
                    step.stepNote.object.position.y = effectSpeed*step.stepNote.object.originalYPos ;
                    step.endBeat = step.originalEndBeat*effectSpeed ;
                }

            }) ;

            this.lastEffectSpeed = effectSpeed ;
        }
    }

    updateActiveHoldsPosition() {

        let listActiveHolds = this.stepQueue.activeHolds.asList() ;

        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {

            let step = listActiveHolds[i] ;

            // check if hold is pressed.
            if ( this.keyListener.isHeld(step.kind, step.padId) ) {

                this.updateHoldPosition(step) ;

            }

        }

    }

    updateHoldPosition(hold) {

        let distanceToOrigin =  -this._object.position.y - hold.stepNote.object.position.y ;

        // update step note position
        hold.stepNote.object.position.y += distanceToOrigin ;


    }

    removeStep(step) {
        this.padSteps[step.padId].remove(step.object) ;
    }


    ready() {

    }

    update(delta) {

        this.updateCurrentSpeed() ;

        this.animateSpeedChange() ;

        this._object.position.y = this.beatManager.currentYDisplacement * this._userSpeed * this.effectSpeed ;

        // important, last thing to update.
        this.updateActiveHoldsPosition() ;
    }

    get object() {
        return this._object ;
    }
}

export {Steps} ;