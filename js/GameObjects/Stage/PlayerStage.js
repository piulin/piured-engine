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



import {GameObject} from "../GameObject.js";
import {Steps} from "./Steps.js";
import {Receptor} from "./Receptor.js";
import {FrameLog} from "../Sequence/SeqLog/FrameLog.js";
import {BeatManager} from "../BeatManager/BeatManager.js";
import {KeyInput} from "../Input/KeyInput.js";
import {TouchInput} from "../Input/TouchInput.js";
import {IInput} from "../Input/IInput.js";
import {IStepQueue} from "../Sequence/IStepQueue.js";
import {StepQueue} from "../Sequence/StepQueue.js";
import {JudgmentScale} from "../Judgment/JudgmentScale.js";
import {LifeBar} from "../LifeBar/LifeBar.js";
import {KeyInputConfig} from "../../Config/KeyInputConfig.js";
import * as THREE from 'three'
import {RemoteInput} from "../../Config/RemoteInput.js";
import {TouchInputConfig} from "../../Config/TouchInputConfig.js";

class PlayerStage extends GameObject {
    _id ;
    _song ;
    _level ;
    _steps ;
    _receptors ;
    _lifeBar ;
    _userSpeed ;
    _object ;
    _scaled_object ;
    _noteskin ;
    playerConfig ;
    keyListener ;
    idLeftPad ;
    idRightPad ;
    keyboardLag ;
    accuracyMargin ;
    lifebarOrientation ;
    frameLog ;

    constructor(resourceManager,
                engine,
                song,
                playerConfig,
                playBackSpeed,
                id,
                lifebarOrientation = 'left2right') {

        super(resourceManager, engine);

        // Save properties.
        this.playerConfig = playerConfig ;
        this._song = song ;
        this._level = playerConfig.level ;
        this._userSpeed = playerConfig.speed ;
        this._id = id ;
        this._noteskin = playerConfig.noteskin ;
        this._object = new THREE.Object3D() ;
        this._scaled_object = new THREE.Object3D() ;
        this._scaled_object.add(this._object) ;
        this.keyboardLag = 0.07;
        this.accuracyMargin = playerConfig.accuracyMargin ;
        this.lifebarOrientation = lifebarOrientation ;
        this.playBackSpeed = playBackSpeed ;

        //
        this.padReceptors = { } ;
        this._receptors = new THREE.Object3D();

        this.frameLog = new FrameLog(this._resourceManager, this.engine, this._id) ;

        this.configureBeatManager() ;

        this.configureInputPlayerStage(playerConfig.inputConfig) ;

    }

    configureBeatManager() {
        // creates a new beat manager with the options of the player
        this.beatManager = new BeatManager(this._resourceManager,this.engine,
            this._song,
            this._level,
            this._userSpeed,
            this.keyboardLag,
            this.playBackSpeed) ;

    }

    configureKeyInputPlayerStage(inputConfig) {

        // Create a KeyInput object
        let playerInput = new KeyInput(this._resourceManager,this.engine, this.frameLog)  ;

        // Pad ids are used for identifying steps in double-style.
        let pad1Id = '0' ;
        let pad2Id = '1' ;

        // We create two pads. Theoretically, more than 2 pads can be added, but in practice we only have either one or two.
        playerInput.addPad(inputConfig.lpad, pad1Id) ;
        playerInput.addPad(inputConfig.rpad, pad2Id) ;

        // We store the input as a keyListener
        this.keyListener = playerInput ;
        this.idLeftPad = pad1Id ;
        this.idRightPad = pad2Id ;

        // We add the KeyInput to the stage (nothing to draw, in this case).
        this._object.add(playerInput.object) ;

    }

    configureTouchInputPlayerStage(inputConfig) {

        // Create a TouchInput object
        let playerInput = new TouchInput(this._resourceManager,this.engine, this.frameLog, this._noteskin) ;

        // We create two pads. Theoretically, more than 2 pads can be added, but in practice we only have either one or two.
        let pad1Id = '0' ;
        let pad2Id = '1' ;

        // We add  the first touchpad (pump-single)
        playerInput.addTouchPad(pad1Id) ;

        // We only add the other pad if the player selected a pump-double or pump-halfdouble level.
        if ( this._song.getLevelStyle(this._level) === 'pump-double' || this._song.getLevelStyle(this._level) === 'pump-halfdouble') {
            playerInput.addTouchPad(pad2Id) ;
        }

        // We place the touchpad relative to the stage.
        playerInput.setScale( inputConfig.scale ) ;
        playerInput.object.position.x += inputConfig.X ;
        playerInput.object.position.y += inputConfig.Y ;

        // We store the input as a keyListener
        this.keyListener = playerInput ;
        this.idLeftPad = pad1Id ;
        this.idRightPad = pad2Id ;

        // We add the KeyInput to the stage (nothing to draw, in this case).
        this._object.add(playerInput.object) ;
    }

    configureRemoteInputPlayerStage(inputConfig) {
        let playerInput = new IInput(this._resourceManager,this.engine, this.frameLog) ;
        let pad1Id = '0' ;
        let pad2Id = '1' ;
        playerInput.addPad(pad1Id) ;
        // if ( this._song.getLevelStyle(this._level) === 'pump-double' || this._song.getLevelStyle(this._level) === 'pump-halfdouble') {
        playerInput.addPad(pad2Id) ;
        // }

        this.keyListener = playerInput ;
        this.idLeftPad = pad1Id ;
        this.idRightPad = pad2Id ;
    }

    configureInputPlayerStage(inputConfig) {

        // Determine what kind of input the player is using.
        if (inputConfig instanceof KeyInputConfig ) {

            this.configureKeyInputPlayerStage(inputConfig) ;

        } else if (inputConfig instanceof TouchInputConfig ) {

            this.configureTouchInputPlayerStage(inputConfig) ;

        } else if (inputConfig instanceof RemoteInput ) {

            this.configureRemoteInputPlayerStage(inputConfig) ;

        }



    }

    setNewPlayBackSpeed ( newPlayBackSpeed ) {
        this.beatManager.setNewPlayBackSpeed(newPlayBackSpeed) ;
    }




    ready() {

        this.configureStepConstantsPositions() ;

        this.constructLifeBar() ;

        this.constructJudgment() ;

        this.constructStepQueue() ;

        this.constructSteps() ;

        this.constructReceptors() ;



    }

    configureStepConstantsPositions () {
        // Depth of stage elements
        this.receptorZDepth = -0.00003 ;
        this.holdZDepth = -0.00002 ;
        this.holdEndNoteZDepth = -0.00001 ;
        this.stepNoteZDepth = 0.00001;

        // define position of the notes w.r.t. the receptor

        // Space to the right or left of a given step.
        const stepShift = 4/5;
        // Note that the receptor steps are a bit overlapped. This measure takes into
        // acount this overlap.
        const stepOverlap = 0.02 ;
        this.dlXPos =  -2*(stepShift - stepOverlap) ;
        this.ulXPos =  -(stepShift - stepOverlap) ;
        this.cXPos =  0 ;
        this.urXPos =  (stepShift - stepOverlap) ;
        this.drXPos =  2*(stepShift - stepOverlap) ;

        this.receptorsApart = 1.96 ;
        this.stepTextureAnimationRate = 30 ;


    }

    constructStepQueue() {
        if (this.playerConfig.inputConfig instanceof RemoteInput ) {
            this.stepQueue = new IStepQueue(this._resourceManager, this.engine,this, this.keyListener, this.beatManager, this.accuracyMargin) ;
        } else {
            this.stepQueue = new StepQueue(this._resourceManager,this.engine, this, this.keyListener, this.beatManager, this.accuracyMargin, this.frameLog) ;
            this.engine.addToInputList(this.stepQueue) ;
        }

    }

    constructSteps() {
        this._steps = new Steps(this._resourceManager,this.engine,
            this.stepQueue,
            this.beatManager,
            this._song,
            this._level,
            this._userSpeed,
            this.idLeftPad,
            this.idRightPad,
            this.keyListener,
            this._noteskin) ;
        this._object.add(this._steps.object) ;
    }

    constructJudgment() {
        this.judgment = new JudgmentScale(this._resourceManager,this.engine, this.accuracyMargin, this._song.getLevelStyle(this._level),
            this._song.getLevelDifficulty(this._level), this._lifeBar, this.frameLog) ;
        this.judgment.object.position.y = -2.25 ;
        this._object.add(this.judgment.object) ;
    }

    // Construct generic receptor
    getReceptor(padId) {
        let receptor = new Receptor(this._resourceManager,this.engine, this.beatManager, this.keyListener, padId, this.stepTextureAnimationRate, this._noteskin ) ;
        receptor.object.position.z = this.receptorZDepth;
        return receptor ;
    }

    constructReceptors() {

        let Lreceptor ;
        let Rreceptor = null ;

       // Create leftmost receptor
        Lreceptor = this.getReceptor( this.idLeftPad );


        //Create rightmost receptor
        if ( this._song.getLevelStyle(this._level) !== 'pump-single' ) {

            Rreceptor = this.getReceptor(this.idRightPad) ;

            //move left receptor to the left.
            Lreceptor.object.position.x = -this.receptorsApart;
            // move right receptor to the right
            Rreceptor.object.position.x = this.receptorsApart;

        }


        this.padReceptors[this.idLeftPad] = Lreceptor ;
        this._receptors.add(Lreceptor.object) ;

        if( Rreceptor !== null ) {
            this.padReceptors[this.idRightPad] = Rreceptor ;
            this._receptors.add(Rreceptor.object) ;
        }

        this._object.add(this._receptors) ;

    }

    constructLifeBar() {

        // switch single or double style lifebar
        if ( this._song.getLevelStyle(this._level) === 'pump-single' ) {
            this._lifeBar = this.getLifeBar('single') ;
        } else {
            this._lifeBar = this.getLifeBar('double') ;
        }

        this._lifeBar.object.position.y = 0.7 ;

        this._object.add(this._lifeBar.object)

    }


    getLifeBar(kind) {

        let lifebar = new LifeBar(this._resourceManager,this.engine, this.beatManager, kind ) ;

        if (this.lifebarOrientation === 'left2right') {
            return lifebar ;
        } else if (this.lifebarOrientation === 'right2left') {
            lifebar.object.scale.x *= -1 ;
            return lifebar ;
        }
    }

    update(delta) {


    }

    setScale(scale) {
        this._object.scale.x *= scale ;
        this._object.scale.y *= scale ;
    }

    get object() {
        return this._scaled_object ;
    }

    removeStep(step) {
        this._steps.removeStep(step) ;
    }


    animateReceptorFX(stepList) {
        for (var step of stepList) {
            this.padReceptors[step.padId].animateExplosionStep(step) ;
        }
    }

    logFrame(json) {
        this.keyListener.applyFrameLog(json) ;
        this.stepQueue.applyFrameLog(json) ;
    }



}

export {PlayerStage} ;