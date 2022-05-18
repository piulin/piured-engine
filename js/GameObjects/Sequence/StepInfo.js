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

class StepInfo {


    constructor(stepList, timeStamp) {

        this._stepList = stepList;
        this._timeStamp = timeStamp;

    }


    get stepList() {
        return this._stepList;
    }

    set stepList(value) {
        this._stepList = value;
    }

    get timeStamp() {
        return this._timeStamp;
    }

    set timeStamp(value) {
        this._timeStamp = value;
    }



}

export {StepInfo} ;