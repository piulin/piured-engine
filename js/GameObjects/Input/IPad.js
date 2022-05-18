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



import {Pad} from "./Pad";

class IPad extends Pad {


    constructor(resourceManager, padId) {
        super(resourceManager, null, padId) ;

    }

    set dlKeyPressed(value) {
        this._dlKeyPressed = value;
    }


    set ulKeyPressed(value) {
        this._ulKeyPressed = value;
    }



    set cKeyPressed(value) {
        this._cKeyPressed = value;
    }



    set urKeyPressed(value) {
        this._urKeyPressed = value;
    }



    set drKeyPressed(value) {
        this._drKeyPressed = value;
    }



    set dlKeyHold(value) {
        this._dlKeyHold = value;
    }



    set ulKeyHold(value) {
        this._ulKeyHold = value;
    }


    set cKeyHold(value) {
        this._cKeyHold = value;
    }


    set urKeyHold(value) {
        this._urKeyHold = value;
    }


    set drKeyHold(value) {
        this._drKeyHold = value;
    }


    get dlKeyPressed() {
        return this._dlKeyPressed;
    }

    get ulKeyPressed() {
        return this._ulKeyPressed;
    }


    get cKeyPressed() {
        return this._cKeyPressed;
    }


    get urKeyPressed() {
        return this._urKeyPressed;
    }


    get drKeyPressed() {
        return this._drKeyPressed;
    }


    get dlKeyHold() {
        return this._dlKeyHold;
    }


    get ulKeyHold() {
        return this._ulKeyHold;
    }


    get cKeyHold() {
        return this._cKeyHold;
    }


    get urKeyHold() {
        return this._urKeyHold;
    }

    get drKeyHold() {
        return this._drKeyHold;
    }



}

export {IPad} ;