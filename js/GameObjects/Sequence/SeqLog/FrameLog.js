'use strict' ;


class FrameLog extends GameObject  {

    _json = {} ;

    constructor(resourceManager) {
        super(resourceManager);
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

    logPadInput(kind, padId) {
        if (!("padInput" in this._json)) {
            this._json['padInput'] = [] ;
        }

        this._json['padInput'].push({
            'kind': kind,
            'padId': padId
        }) ;
    }

    ready() {
    }

    update(delta) {
        if ( Object.keys(this._json).length !== 0) {
            console.log(this._json) ;
        }
        this._json = {} ;
    }
}