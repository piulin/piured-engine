'use strict' ;


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
        this._json = {} ;
    }

}