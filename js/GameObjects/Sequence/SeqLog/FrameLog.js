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


import {GameObject} from "../../GameObject";

class FrameLog extends GameObject  {

    _json = {} ;
    _playerStageId ;



    constructor(resourceManager, playerStageId) {
        super(resourceManager);
        this._playerStageId = playerStageId;
    }


    get playerStageId() {
        return this._playerStageId;
    }

    get json() {
        return this._json;
    }

    logAnimateReceptorFX(steplist) {

        if (!("receptorFX" in this._json)) {
            this._json['receptorFX'] = [] ;
        }
        let receptorFXList = this._json['receptorFX']
        for (let i = 0 ; i < steplist.length ; i++ ) {
            receptorFXList.push(steplist[i].id) ;
        }

    }
    logJudgment(grade, combo, step) {
        this._json['judgment'] = {
            'grade': grade,
            'combo': combo,
            'step': step
        }
    }

    logRemoveStep(step) {
        if (!("removeSteps" in this._json)) {
            this._json['removeSteps'] = [] ;
        }
        this._json['removeSteps'].push(step.id) ;
    }

    logPadInput(kind, padId, action, value) {
        if (!("padInput" in this._json)) {
            this._json['padInput'] = [] ;
        }

        this._json['padInput'].push({
            'kind': kind,
            'padId': padId,
            'action': action,
            'value': value
        }) ;
    }

    ready() {
    }

    update(delta) {
        if ( Object.keys(this._json).length !== 0) {

            engine.addToOutputFrameLogList(this) ;
        }


        // if ( Object.keys(this._json).length !== 0 && this._hadIlogged === false ) {
        //     engine.addToOutputFrameLogList(this) ;
        //     this._hadIlogged = true ;
        // }
        //
        // if(this._hadIlogged) {
        //     engine.addToOutputFrameLogList(this) ;
        // }

        this._json = {} ;
    }

}

export {FrameLog} ;