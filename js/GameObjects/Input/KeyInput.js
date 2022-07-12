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
import {Pad} from "./Pad.js";
import {engine} from "../../Engine.js";
import * as THREE from '../../../node_modules/three/src/Three.js'

class KeyInput extends GameObject {

    _mesh ;

    constructor(resourceManager, frameLog) {

        super(resourceManager) ;

        // Connect to update lists, so it can be updated every frame and can keep track of key inputs.
        engine.addToKeyDownList(this) ;
        engine.addToKeyUpList(this) ;

        this.frameLog = frameLog ;

        this.pads = [] ;
        this.padsDic = {} ;

        this._mesh = new THREE.Object3D() ;


    }

    getPadIds() {
        return Object.keys(this.padsDic) ;
    }

    addPad(keyMap, padId) {

        const pad = new Pad(this._resourceManager, keyMap, padId, this.frameLog) ;
        this.pads.push( pad ) ;
        this.padsDic[padId] = pad ;
    }


    onKeyDown( event ) {


        const key =  event.key.toLowerCase() ;

        for ( let pad of this.pads ) {
            if ( key === pad.dlKey && !pad.dlKeyHold ) {
                pad.dlKeyHold = true ;
                pad.dlKeyPressed = true ;
                // console.log('dl down: ' +key) ;
            }
            else if ( key === pad.ulKey && !pad.ulKeyHold ) {
                pad.ulKeyHold = true ;
                pad.ulKeyPressed = true ;
                // console.log('ul down : ' +key)
            }
            else if ( key === pad.cKey && !pad.cKeyHold ) {
                pad.cKeyHold = true ;
                pad.cKeyPressed = true ;
                // console.log('c down: ' +key)
            }
            else if ( key === pad.urKey && !pad.urKeyHold ) {
                pad.urKeyHold = true ;
                pad.urKeyPressed = true ;
                // console.log('ur down: ' +key)
            }
            else if ( key === pad.drKey && !pad.drKeyHold ) {
                pad.drKeyHold = true ;
                pad.drKeyPressed = true ;
                // console.log('dr down: ' +key)
            }
        }


    }

    onKeyUp(event) {

        const key = event.key ;

        for ( let pad of this.pads ) {
            if ( key === pad.dlKey ) {
                pad.dlKeyHold = false ;
                // console.log('dl up: ' + key);

            }
            else if ( key === pad.ulKey ) {
                pad.ulKeyHold = false ;
                // console.log('ul up: ' + key);

            }
            else if ( key === pad.cKey ) {
                pad.cKeyHold = false ;
                // console.log('c up: ' + key);

            }
            else if ( key === pad.urKey ) {
                pad.urKeyHold = false ;
                // console.log('ur up: ' + key);

            }
            else if ( key === pad.drKey ) {
                pad.drKeyHold = false ;
                // console.log('dr up: ' + key);

            }
        }

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

    get object () {
        return this._mesh ;
    }

}

export {KeyInput} ;