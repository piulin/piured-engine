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

class LFBarFXRed extends GameObject {

    _mesh ;
    _show ;
    _blink ;
    _beatManager ;
    constructor( resourceManager, beatManager, kind ) {
        super(resourceManager);

        this._mesh = this._resourceManager.constructSLifeBarBarFXRed() ;

        if ( kind === 'single') {
            this._mesh = this._resourceManager.constructSLifeBarBarFXRed() ;

        } else if ( kind === 'double') {

            this._mesh = this._resourceManager.constructDLifeBarBarFXRed() ;
        }
        this._show = false ;
        this._blink = false ;
        this._beatManager = beatManager ;

    }

    ready() {

    }

    animate() {



    }

    set blink(blink) {
        this._blink = blink ;
    }



    update(delta) {

        if ( this._blink ) {
            const bpm = this._beatManager.currentBPM ;
            const currentAudioTime = this._beatManager.currentAudioTimeReal ;
            const beatsPerSecond = bpm / 60 ;
            const secondsPerBeat = 60 / bpm ;

            const timeInBeat = Math.abs(  currentAudioTime % secondsPerBeat  ) ;
            const normalizedTimeInBeat = beatsPerSecond * timeInBeat ;
            let level = (1 - normalizedTimeInBeat) ;

            this._mesh.material.opacity = 0.3 + (level*level/2) ;

        } else {
            this._mesh.material.opacity = 0.0 ;
        }

    }

    get object () {
        return this._mesh;
    }
}

export {LFBarFXRed} ;