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



// This class is responsible for the input of a pad (5 steps)
import {GameObject} from "../GameObject.js";
import {IPad} from "./IPad.js";
import * as THREE from 'three'
class IInput extends GameObject {

    _mesh ;

    constructor(resourceManager, engine) {

        super(resourceManager, engine) ;

        this.pads = [] ;
        this.padsDic = {} ;

        this._mesh = new THREE.Object3D() ;


    }

    getPadIds() {
        return Object.keys(this.padsDic) ;
    }

    addPad(padId) {
        const pad = new IPad(this._resourceManager, this.engine, padId) ;
        this.pads.push( pad ) ;
        this.padsDic[padId] = pad ;
    }


    isPressed( kind, padId ) {
        return this.padsDic[padId].isPressed(kind) ;
    }

    isHeld( kind, padId ) {
        return this.padsDic[padId].isHeld(kind) ;
    }


    ready() {

    }

    update(delta) {

    }

    getPressed() {

        var list = [] ;

        for ( let pad of this.pads ) {

            if ( pad.dlKeyPressed ) {
                list.push(['dl', pad.padId]) ;
            }

            if ( pad.ulKeyPressed ) {
                list.push(['ul', pad.padId]) ;
            }

            if ( pad.cKeyPressed ) {
                list.push(['c', pad.padId]) ;
            }

            if ( pad.urKeyPressed ) {
                list.push(['ur', pad.padId]) ;
            }

            if ( pad.drKeyPressed ) {
                list.push(['dr', pad.padId]) ;
            }

        }

        return list ;
    }

    applyFrameLog(json) {
        if ('padInput' in json) {
            for (let i = 0 ; i < json.padInput.length ; i++ ) {
                let pi = json.padInput[i] ;
                let kind = pi.kind ;
                let padId = pi.padId ;
                let action = pi.action ;
                let value = pi.value ;
                this.processFrameLogPadInput(kind,padId,action,value) ;

            }

        }
    }

    processFrameLogPadInput(kind, padId, action, value) {

        switch (kind) {
            case 'dl':
                if (action === 'pressed') {
                    this.padsDic[padId].dlKeyPressed = value ;
                } else {
                    this.padsDic[padId].dlKeyHold = value ;
                }
                break ;
            case 'ul':
                if (action === 'pressed') {
                    this.padsDic[padId].ulKeyPressed = value ;
                } else {
                    this.padsDic[padId].ulKeyHold = value ;
                }
                break ;
            case 'c':
                if (action === 'pressed') {
                    this.padsDic[padId].cKeyPressed = value ;
                } else {
                    this.padsDic[padId].cKeyHold = value ;
                }
                break ;
            case 'ur':
                if (action === 'pressed') {
                    this.padsDic[padId].urKeyPressed = value ;
                } else {
                    this.padsDic[padId].urKeyHold = value ;
                }
                break ;
            case 'dr':
                if (action === 'pressed') {
                    this.padsDic[padId].drKeyPressed = value ;
                } else {
                    this.padsDic[padId].drKeyHold = value ;
                }
                break ;
        }

    }

    get object () {
        return this._mesh ;
    }

}

export {IInput} ;