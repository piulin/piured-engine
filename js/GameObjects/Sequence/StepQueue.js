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
import {HoldsState} from "../../Structs/HoldsState";
import {Id} from "./SeqLog/Id";
import {StepInfo} from "./StepInfo";
import {StepHold} from "../StepNotes/StepHold";

class StepQueue extends GameObject {

    _stepDict ;

    constructor(resourceManager, playerStage, keyInput, beatManager, accuracyMargin, frameLog ) {

        super(resourceManager) ;

        this.keyInput = keyInput ;

        this.playerStage = playerStage ;

        this.beatManager = beatManager ;

        this.accuracyMargin = accuracyMargin ;

        this.stepQueue = [] ;

        this.activeHolds = new HoldsState(this.keyInput.getPadIds()) ;

        this.checkForNewHolds = true ;

        this.id = new Id() ;

        this._stepDict = {} ;

        this.frameLog = frameLog ;

    }


    ready() {

    }

    update(delta) {

        // console.log('tal') ;

        const currentAudioTime = this.beatManager.currentAudioTime;
        const currentBeat = this.beatManager.currentBeat;
        this.updateActiveHolds(currentAudioTime, delta, currentBeat);
        this.updateStepQueue(currentAudioTime);

    }



    input() {

        const pressedKeys = this.keyInput.getPressed() ;

        for ( const [kind, padId] of pressedKeys ) {
            // this.frameLog.logPadInput(kind,padId) ;
            this.stepPressed(kind,padId) ;

        }

    }


// THESE METHODS ARE CALLED WHEN CONSTRUCTING THE SCENE.

    addNewEntryWithTimeStampInfo( timeStamp ) {

        let stepInfo = new StepInfo([], timeStamp);
        this.stepQueue.push(stepInfo) ;

    }

    cleanUpStepQueue() {

        this.stepQueue = this.stepQueue.filter(function (el) {
            return el.stepList.length > 0 ;
        });

        this.resetHolds() ;

    }

    addStepToLastStepInfo (step) {

        this.stepQueue[this.stepQueue.length -1].stepList.push(step) ;

    }

    addStepToStepList ( step, index, i,j ) {
        let stepId = this.id.getId( step.kind,step.padId, i,j ) ;
        step.id = stepId ;

        // save in the dict.
        this._stepDict[stepId] = step ;
        //save in the list.
        this.stepQueue[index].stepList.push(step) ;
    }

    getLength() {
        return this.stepQueue.length ;
    }

    getStepTimeStampFromTopMostStepInfo() {
        return this.stepQueue[0].timeStamp ;
    }

    removeFirstElement() {
        this.stepQueue.shift() ;
    }

    removeElement(index) {
        this.stepQueue.splice(index,1) ;
    }

    getStepFromTopMostStepInfo (index) {
        return this.stepQueue[0].stepList[index] ;
    }

    getTopMostStepListLength() {
        return this.stepQueue[0].stepList.length ;
    }
    getTopMostStepsList() {
        return this.stepQueue[0].stepList ;
    }

    setHold(kind, padId, step) {
        this.activeHolds.beginningHoldChunk = true ;
        this.activeHolds.lastAddedHold = step ;
        this.activeHolds.setHold(kind, padId, step) ;

    }

    getHold( kind, padId ) {
        return this.activeHolds.getHold(kind, padId) ;
    }

    resetHolds() {
        this.activeHolds = new HoldsState(this.keyInput.getPadIds()) ;
    }


    // ----------------------- THESE METHODS ARE CALLED EACH FRAME ---------------------- //


    updateActiveHolds(currentAudioTime, delta, beat) {

        let validHold = this.findFirstValidHold(currentAudioTime);

        // update hold Run.
        if ( validHold !== null ) {
            if (!this.activeHolds.holdRun) {
                this.activeHolds.holdRun = true ;
                this.activeHolds.firstHoldInHoldRun = validHold ;
            }
        } else {
            this.activeHolds.holdRun = false ;
        }

        // Hold contribution to the combo
        if (validHold !== null) {

            const tickCounts = this.beatManager.currentTickCount ;

            this.judgeHolds(delta, currentAudioTime, beat, tickCounts) ;

            // Note that, to be exact, we have to add the remainder contribution of the hold that was not processed on the last
            // frame
        } else if (this.activeHolds.needFinishJudgment) {
            const tickCounts = this.beatManager.currentTickCount ;
            const difference = this.activeHolds.judgmentTimeStampEndReference - this.activeHolds.cumulatedHoldTime ;
            this.endJudgingHolds(difference, tickCounts) ;
            this.activeHolds.cumulatedHoldTime = 0;
            this.activeHolds.needFinishJudgment = false;
        }

        this.removeHoldsIfProceeds(currentAudioTime) ;
    }

    updateStepQueue( currentAudioTime ) {

        if ( this.getLength() > 0 ) {

            let stepTime = this.getStepTimeStampFromTopMostStepInfo() ;

            const difference = (stepTime) - currentAudioTime ;
            // this condition is met when we run over a hold. We update here the current list of holds
            if ( difference < 0 && this.checkForNewHolds ) {
                // console.log(onlyHoldsInTopMostStepInfo) ;

                this.checkForNewHolds = false ;

                this.addHolds() ;


                // if we only have holds, and all of them are being pressed beforehand, then it's a perfect!
                if ( this.areThereOnlyHoldsInTopMostStepInfo() && this.areHoldsBeingPressed() ) {

                    this.needToAnimateReceptorFX(this.getTopMostStepsList()) ;
                    this.playerStage.judgment.perfect() ;

                    this.removeFirstElement() ;
                    this.checkForNewHolds = true ;
                }

            }


            // we count a miss, if we go beyond the time of the topmost step info, given that there are no holds there
            if (difference < -this.accuracyMargin ) {

                this.playerStage.judgment.miss() ;
                this.removeFirstElement() ;
                this.checkForNewHolds = true ;

            }

        }


    }

    needToAnimateReceptorFX(stepList) {

        this.frameLog.logAnimateReceptorFX(stepList) ;
        this.playerStage.animateReceptorFX(stepList) ;

    }

    needToRemoveStep(step) {
        this.frameLog.logRemoveStep(step) ;
        this.playerStage.removeStep(step) ;
    }

    // the boolean end is used to compute the remainder combo left after a set of holds.
    judgeHolds(delta, currentAudioTime, beat, tickCounts) {


        this.activeHolds.cumulatedHoldTime += delta ;


        this.activeHolds.timeCounterJudgmentHolds += delta ;

        const secondsPerBeat = 60 / this.beatManager.currentBPM ;

        const secondsPerKeyCount = secondsPerBeat/ tickCounts ;

        const numberOfHits = Math.floor(this.activeHolds.timeCounterJudgmentHolds / secondsPerKeyCount ) ;


        // console.log(numberOfPerfects) ;


        if ( numberOfHits > 0 ) {


            let aux = this.activeHolds.timeCounterJudgmentHolds ;
            const remainder = this.activeHolds.timeCounterJudgmentHolds % secondsPerKeyCount;
            this.activeHolds.timeCounterJudgmentHolds = 0 ;


            const difference =  Math.abs((this.activeHolds.lastAddedHold.beginTimeStamp) - currentAudioTime) ;
            // case 1: holds are pressed on time
            if (this.areHoldsBeingPressed()) {

                // TODO:
                // this.composer.judgmentScale.animateJudgement('p', numberOfHits);
                // this.composer.animateTapEffect(this.activeHolds.asList());
                this.needToAnimateReceptorFX(this.activeHolds.asList()) ;
                this.playerStage.judgment.perfect(numberOfHits) ;
                // console.log('perfect') ;
            // case 2: holds are not pressed. we need to give some margin to do it
            } else if (this.activeHolds.beginningHoldChunk && difference < this.accuracyMargin ) {

                this.activeHolds.timeCounterJudgmentHolds += aux -remainder ;

                // case 3: holds are not pressed and we run out of the margin
            } else {

                this.playerStage.judgment.miss(numberOfHits) ;
                this.activeHolds.beginningHoldChunk = false ;
            }


            this.activeHolds.timeCounterJudgmentHolds += remainder;

        }


    }

    endJudgingHolds(remainingTime, tickCounts) {


            const secondsPerBeat = 60 / this.beatManager.currentBPM ;
            const secondsPerKeyCount = secondsPerBeat/ tickCounts ;

            const numberOfHits = Math.floor(remainingTime / secondsPerKeyCount ) ;

            // console.log('end numberOfHits: ' + numberOfHits) ;


            if (this.areHoldsBeingPressed() && this.activeHolds.wasLastKnowHoldPressed) {

                this.needToAnimateReceptorFX(this.activeHolds.asList()) ;
                this.playerStage.judgment.perfect(numberOfHits) ;
                // console.log('perfect') ;
            } else {
                // TODO: misses should not be in the same count.
                // TODO:
                // this.composer.judgmentScale.miss() ;
                // console.log('miss') ;
                this.playerStage.judgment.miss(numberOfHits) ;
            }

            //reset
            this.activeHolds.timeCounterJudgmentHolds = 0 ;

    }

    areThereOnlyHoldsInTopMostStepInfo() {
        let len = this.getTopMostStepListLength() ;
        for ( var i = 0 ; i <  len ; i++) {
            let step = this.getStepFromTopMostStepInfo(i) ;
            if (!(step instanceof StepHold)) {
                return false ;
            }
        }
        return true ;
    }


    // remove holds that reached the end.
    removeHoldsIfProceeds(currentAudioTime) {

        let listActiveHolds = this.activeHolds.asList() ;


        // This is used to know whether the last judgment for the hold must be fail or not.
        this.activeHolds.wasLastKnowHoldPressed = this.areHoldsBeingPressed() ;

        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {

            let step = listActiveHolds[i] ;

            if (step !== null && currentAudioTime > step.endTimeStamp ) {
                this.activeHolds.setHold(step.kind, step.padId, null) ;

                // save the endHoldTimeStamp to compute the remainder judgments.
                this.activeHolds.needFinishJudgment = true ;
                this.activeHolds.judgmentTimeStampEndReference = step.endTimeStamp - this.activeHolds.firstHoldInHoldRun.beginTimeStamp ;


                // if the hold is active, we can remove it from the render and give a perfect judgment, I think.
                if (this.keyInput.isHeld(step.kind, step.padId)) {


                    this.playerStage.judgment.perfect() ;

                    this.needToRemoveStep(step) ;


                    this.needToAnimateReceptorFX([step]) ;



                // otherwise we have a miss.
                } else {
                    this.playerStage.judgment.miss() ;
                }


            }

        }
    }



    // update activeHolds using the topmost element of the stepQueue
    addHolds() {

        // add new holds

        const length =  this.getTopMostStepListLength() ;
        // console.log(this.stepQueue.stepQueue[0]);
        for ( var i = 0 ; i < length ; ++i ) {
            let note = this.getStepFromTopMostStepInfo(i) ;
            if ( note instanceof StepHold ) {
                this.setHold(note.kind, note.padId, note);
                // console.log('hold added:' + note.held) ;
            }
        }

        // console.log(this.activeHolds) ;

    }




    // ----------------------- THESE METHODS ARE CALLED WHEN A KEY IS PRESSED ---------------------- //


    getFirstStepWithinMargin(currentAudioTime, kind, padId) {

        for ( var i = 0 ; i < this.stepQueue.length ; i++ ) {

            let stepInfo = this.stepQueue[i] ;
            let timeStamp = stepInfo.timeStamp ;

            const difference =  Math.abs((timeStamp) - currentAudioTime) ;

            // console.log(difference) ;

            if ( difference < this.accuracyMargin ) {

                for (var j = 0 ; j < stepInfo.stepList.length ; j++ ) {

                    let step = stepInfo.stepList [j] ;

                    if (step.kind === kind && step.padId === padId) {
                        return [stepInfo, step, i, difference] ;
                    }

                }

            } else {
                return [null, null, null, null] ;
            }

        }
        return [null, null, null, null] ;

    }

    stepPressed(kind, padId) {


        const currentAudioTime = this.beatManager.currentAudioTime ;

        // keep track if there is an upcoming hold

        let [stepInfo, step, hitIndex, difference] = this.getFirstStepWithinMargin(currentAudioTime, kind, padId) ;


        // with the second condition, we make sure that we don't treat the holds here. Holds, when pressed
        // beforehand (anytime), count always as a perfect.
        if ( step !== null ) {


            step.pressed = true;


            // If all steps have been pressed, then we can remove them from the steps to be rendered
            if (this.areStepsInNoteListPressed(stepInfo.stepList)) {

                const grade = this.playerStage.judgment.grade(difference) ;

                //
                if ( grade === 'b' || grade === 'go') {

                    if ( step instanceof StepHold) {
                        this.setHold(step.kind, step.padId, step) ;
                    }

                } else {


                    this.needToAnimateReceptorFX(stepInfo.stepList) ;
                    this.needToAnimateReceptorFX(this.activeHolds.asList()) ;
                    this.removeNotesFromStepObject(stepInfo.stepList) ;

                }



                // remove front
                this.removeElement(hitIndex);

                this.checkForNewHolds = true;
            }

            // }
        }


    }



    // Returns true if all the steps have been pressed
    areStepsInNoteListPressed(noteList) {
        const length =  noteList.length ;
        // const length =  this.getTopMostStepListLength() ;
        for ( var i = 0 ; i < length ; ++i ) {

            let note = noteList[i] ;
            if ( note.pressed === false ) {
                if ( (note instanceof StepHold) && this.keyInput.isHeld(note.kind, note.padId) ) {
                    continue ;
                }
                return false ;
            }
        }

        // Also check if the holds are being pressed.
        return this.areHoldsBeingPressed() ;

    }


    areHoldsBeingPressed() {

        let listActiveHolds = this.activeHolds.asList() ;
        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {

            let step = listActiveHolds[i] ;

            if (step !== null && this.keyInput.isHeld(step.kind, step.padId) ) {
                continue ;
                // listActiveHolds[i] = null ;
                // console.log('removed:' + listActiveHolds[i]) ;
            } else {
                return false ;
            }

        }
        return true ;

    }

    // this means, holds that are not only in the activeHolds list, but on time to be triggered
    findFirstValidHold (currentAudioTime) {

        let listActiveHolds = this.activeHolds.asList() ;
        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {

            let step = listActiveHolds[i] ;

            if ( step !== null  && step.beginTimeStamp <= currentAudioTime) {
                return step ;
            }

        }

        return null ;

    }

    // this means, holds that are not only in the activeHolds list, but on time to be triggered
    areThereHolds (currentAudioTime) {

        let listActiveHolds = this.activeHolds.asList() ;
        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {

            let step = listActiveHolds[i] ;

            if ( step !== null ) {
                return true ;
            }

        }

        return false ;

    }

    // remove all steps in the noteList from the steps Object, so they are not rendered anymore
    removeNotesFromStepObject(noteList) {


        const length =  noteList.length ;
        for ( var i = 0 ; i < length ; ++i ) {
            let note = noteList[i] ;

            // remove the step if it's not a hold, obviously.
            if ( ! (note instanceof StepHold) ) {

                this.needToRemoveStep(note) ;


                // add it to the active holds early
            } else {
                this.setHold(note.kind, note.padId, note) ;
            }

        }

    }



}

export {StepQueue} ;