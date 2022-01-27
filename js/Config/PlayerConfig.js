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
 * This class holds the configuration for a player.
 * @param {KeyInputConfig|TouchInputConfig|RemoteInput} inputConfig input configuration
 * @param {number} level levelId to be played by the player
 * @param {number} speed rate in which the steps traverse the screen from the bottom to the receptor
 * @param {number} [accuracyMargin=0.15] span of time (in seconds) in which a step is considered to be pressed
 * @param {number} [receptorX=0] X position of player stage with respect to the stage
 * @param {number} [receptorY=0] Y position of player stage with respect to the stage
 * @param {number} [scale=1.0] scale applied to the player stage
 *
 * @example
 *
 * let p1InputConfig = RemoteInput() ;
 * let p1Config = new PlayerConfig(p1InputConfig,
 *                      0,
 *                      3.0,
 *                      0.15) ;
 */
class PlayerConfig {

    _inputConfig ;
    _level ;
    _speed ;
    _accuracyMargin ;
    _receptorX ;
    _receptorY ;
    _scale ;

    constructor(inputConfig,
                level,
                speed = 1.0,
                accuracyMargin = 0.15,
                receptorX = 0,
                receptorY = 0,
                scale = 1.0) {

        this._inputConfig = inputConfig ;
        this._level = level ;
        this._speed = speed ;
        this._accuracyMargin = accuracyMargin ;
        this._receptorX = receptorX ;
        this._receptorY = receptorY ;
        this._scale = scale ;

    }

    get inputConfig() {
        return this._inputConfig;
    }

    get level() {
        return this._level;
    }

    get speed() {
        return this._speed;
    }

    get accuracyMargin() {
        return this._accuracyMargin;
    }

    get receptorX() {
        return this._receptorX;
    }

    get receptorY() {
        return this._receptorY;
    }

    get scale() {
        return this._scale;
    }
}