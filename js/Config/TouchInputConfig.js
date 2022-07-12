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


/**
 * Class for configuring the input for a touch-capable device. The input pad will be drawn on the screen.
 * For registering the touch input, it is necessary to pass the touch events into the engine through methods {@link Engine#touchDown}
 * and {@link Engine#touchUp}.
 * @param {number} [scale=1.0] scaling factor
 * @param {number} [X=0] X position of the pad with respect to the player's stage
 * @param {number} [Y=0] Y position of the pad with respect to the player's stage
 * @example
 *
 * let p1InputConfig = new TouchInputConfig() ;
 */
class TouchInputConfig {

    _scale ;
    _X ;
    _Y ;
    constructor(scale=1.0, X=0, Y=0) {

        this._scale = scale ;
        this._X = X ;
        this._Y = Y ;

    }


    get scale() {
        return this._scale;
    }

    get X() {
        return this._X;
    }

    get Y() {
        return this._Y;
    }
}

export {TouchInputConfig}