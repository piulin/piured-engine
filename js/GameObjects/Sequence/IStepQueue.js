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

class IStepQueue extends GameObject {

    _stepDict ;

    constructor(resourceManager, playerStage, keyInput, beatManager, accuracyMargin) {

        super(resourceManager) ;

        this.playerStage = playerStage ;

        this._stepDict = {} ;

        this.stepQueue = [] ;

        this.id = new Id() ;

        this.keyInput = keyInput ;

        this.activeHolds = new HoldsState(keyInput.getPadIds()) ;

        this.checkForNewHolds = true ;

        this.accuracyMargin = accuracyMargin ;

        this.beatManager = beatManager ;

    }


    ready() {

    }

    update(delta) {

        const currentAudioTime = this.beatManager.currentAudioTime;

        this.updateActiveStepHolds(currentAudioTime) ;
        this.removeHoldsIfProceeds(currentAudioTime) ;

    }

    updateActiveStepHolds(currentAudioTime) {

        if ( this.getLength() > 0 ) {

            let stepTime = this.getStepTimeStampFromTopMostStepInfo() ;
            const difference = (stepTime) - currentAudioTime ;
            // this condition is met when we run over a hold. We update here the current list of holds
            if ( difference < 0 && this.checkForNewHolds ) {
                // console.log(onlyHoldsInTopMostStepInfo) ;
                this.checkForNewHolds = false ;
                this.addHolds() ;

            }

            // we count a miss, if we go beyond the time of the topmost step info, given that there are no holds there
            if (difference < -this.accuracyMargin ) {
                this.removeFirstElement() ;
                this.checkForNewHolds = true ;

            }

        }

    }

    // remove holds that reached the end.
    removeHoldsIfProceeds(currentAudioTime) {
        let listActiveHolds = this.activeHolds.asList() ;
        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {
            let step = listActiveHolds[i] ;
            if (step !== null && currentAudioTime > step.endTimeStamp ) {
                this.activeHolds.setHold(step.kind, step.padId, null) ;
            }
        }
    }


    // update activeHolds using the topmost element of the stepQueue
    addHolds() {
        const length =  this.getTopMostStepListLength() ;
        for ( var i = 0 ; i < length ; ++i ) {
            let note = this.getStepFromTopMostStepInfo(i) ;
            if ( note instanceof StepHold ) {
                this.setHold(note.kind, note.padId, note);
            }
        }

    }

    getTopMostStepListLength() {
        return this.stepQueue[0].stepList.length ;
    }

    getStepFromTopMostStepInfo (index) {
        return this.stepQueue[0].stepList[index] ;
    }



    addNewEntryWithTimeStampInfo( timeStamp ) {

        let stepInfo = new StepInfo([], timeStamp);
        this.stepQueue.push(stepInfo) ;

    }

    removeFirstElement() {
        this.stepQueue.shift() ;
    }

    cleanUpStepQueue() {
        // this.stepQueue = [] ;
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

    applyFrameLog(json) {


        if ('receptorFX' in json) {
            this.handleReceptorFXFrameLog(json['receptorFX']) ;
        }

        if ('judgment' in json) {
            this.handleJudgmentFrameLog(json['judgment']) ;
        }

        if ('removeSteps' in json ) {
            this.handleRemoveStepsFrameLog(json['removeSteps']) ;
        }


    }

    getStepTimeStampFromTopMostStepInfo() {
        return this.stepQueue[0].timeStamp ;
    }

    handleReceptorFXFrameLog(receptorFXList) {
        let stepList = [] ;
        for (let i = 0 ; i < receptorFXList.length ; i++ ) {
            stepList.push(this._stepDict[receptorFXList[i]]) ;
        }
        this.playerStage.animateReceptorFX(stepList) ;
    }

    handleJudgmentFrameLog(judgment) {
        this.playerStage.judgment.setJudgment(judgment.grade, judgment.combo, judgment.step)
    }

    handleRemoveStepsFrameLog(removeSteps) {
        for (let i = 0 ; i < removeSteps.length ; i++ ) {
            this.playerStage.removeStep(this._stepDict[removeSteps[i]]) ;
        }
    }







}