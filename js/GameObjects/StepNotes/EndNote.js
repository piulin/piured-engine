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

class EndNote extends GameObject {

    _mesh;
    _kind;

    _spritePosition ;
    _stepAnimationRate ;
    _animationDelta ;

    constructor(resourceManager, kind, animationRate, noteskin) {
        super(resourceManager);
        this._kind = kind;

        this._stepAnimationRate = animationRate ;

        this._mesh = this._resourceManager.constructHoldEndNote( this._kind, noteskin ) ;

    }

    ready() {

        this._spritePosition = 0 ;
        this._animationDelta = 0 ;

        this._mesh.material.map.repeat.set(1/6,1/3) ;

    }

    // This one is not empty
    update(delta) {

        this.updateTextureAnimation(delta) ;

        // TODO: handle input data here also?


    }

    updateTextureAnimation(delta) {

        let timeStamp = this._animationDelta + delta;

        let movement = timeStamp*this._stepAnimationRate ;

        if ( movement > 1 ) {

            this._spritePosition = (this._spritePosition + 1)%6 ;

            const XOffset6x1 = ((this._spritePosition + 3)% 6) * (1/6) ;

            const YOffset6x1HoldEndNote = 0 ;


            this._mesh.material.map.offset.set( XOffset6x1, YOffset6x1HoldEndNote) ;

            this._animationDelta = 0 ;

        } else {

            this._animationDelta += delta ;

        }

    }

    get object () {
        return this._mesh;
    }

}