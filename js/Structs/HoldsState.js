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


// Data structure that supports the StepQueue functionality
// It holds at a given time, the current holds and their state.
class HoldsState {

    constructor(padIds) {

        //We need one holds instance for each pad.
        this.holdsDict = {} ;
        this.holds = []
        for (let id of padIds) {
            let h = new Holds(id) ;
            this.holds.push(h) ;
            this.holdsDict[id] = h ;
        }

        // All these values are directly updated by the StepQueue

        // This stores the amount of time that a hold has been run (pressed or not).
        // It is used to calculate the remainder steps to add to the judgment.
        this.cumulatedHoldTime = 0.0 ;

        // This flag states whether a judgment is needed after the hold has reached the end
        this.needFinishJudgment = false;

        // it holds the elapsed time between the first and last hold in the hold run (sequence).
        this.judgmentTimeStampEndReference = 0.0 ;

        // It keeps the time elapsed between frames in order to judge a hold.
        this.timeCounterJudgmentHolds = 0.0 ;

        // It states whether the hold was pressed until the end.
        this.wasLastKnowHoldPressed = true ;

        //
        this.beginningHoldChunk = false ;

        // Keeps track of the last Hold added
        this.lastAddedHold = null ;

        // States if we are currently in a hold run
        this.holdRun = false ;

        // Keeps the first hold Object3D of the hold run
        this.firstHoldInHoldRun = null ;

    }

    setHold (kind, padId, value) {
        // console.log(padId);
        this.holdsDict[padId].setHold(kind,value) ;
    }

    getHold (kind, padId) {
        return this.holdsDict[padId].getHold(kind) ;
    }


    asList() {
        let list = [] ;
        for (var hold of this.holds) {
            list = list.concat(hold.asList()) ;
        }
        return list ;
    }

}