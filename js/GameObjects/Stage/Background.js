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


class Background extends GameObject {


    _mesh ;
    _beatManager ;

    constructor(resourceManager, beatManager) {
        super(resourceManager);

        this._mesh = resourceManager.constructBackground() ;
        this._beatManager = beatManager ;

    }

    ready() {


    }

    update(delta) {


        const bpm = this._beatManager.currentBPM ;
        const currentAudioTime = this._beatManager.currentAudioTimeReal ;
        const beatsPerSecond = bpm / 60 ;
        const secondsPerBeat = 60 / bpm ;

        if (currentAudioTime < 0 ) {
            this._mesh.material.uniforms.uThreshold.value = 0.3 ;
            return ;
        }

        const timeInBeat = Math.abs(  currentAudioTime % secondsPerBeat  ) ;
        const normalizedTimeInBeat = beatsPerSecond * timeInBeat ;
        let opacityLevel = (1 - normalizedTimeInBeat) ;


        const tal = (1-opacityLevel*opacityLevel)
            * (0.7) + 0.1;
        this._mesh.material.uniforms.uThreshold.value = tal  ;

    }



    get object( ) {
        return this._mesh ;
    }
}