"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode


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


import {Song} from "./Song/Song.js";
import {ResourceManager} from "./Resources/ResourceManager.js";
import {Stage} from "./GameObjects/Stage/Stage.js";
import {RemoteInput} from "./Config/RemoteInput.js";
import * as THREE from 'three'
import {TWEEN} from "../lib/tween.min.js";

/**
 * PIURED is a Pump It Up stage simulator that works directly in your browser.
 There are already a number of dance simulators for Windows and Linux, most of them being StepMania-based.
 Stepmania is a great choice for DDR-style rhythm games, however it lacks to capture the behaviour as well as
 the feel & look of a Pump It Up arcade.

 In this sense, PIURED's goal is to recreate as accurately as possible the Pump It Up-style experience
 whilst keeping the engine cross-platform (web-based), so it can be enjoyed anywhere and anytime.

 PIURED is written in its whole in Javascript using [ThreeJS](https://threejs.org/). The code is organized
 trying to mimick the structure of any game engine. The source code can be found in [this repo](https://github.com/piulin/piured-engine) under the folder `js`.

 This engine features:

 1. A Stepmania SSC parser. Stepcharts can be directly read from bare Stepmania files. No need to convert them into another intermediate format. This means that all the songs that are available for Pump-style would work off-the-shelf in PIURED.
 2. A loader that supports both MP3 and OGG audio formats. These are the most common formats used in Stepmania audio files.
 3. Support for changes of BPM, SCROLL, STOPS, DELAYS as well as changes of SPEED (attributes used in Stepmania to create effects).
 4. Pump-single, Pump-double and Pump-Halfdouble styles.
 5. VS. mode, including two or more players playing any combination of Pump-single and Pump-double styles.
 6. Remote input capabilities to create online-like battles.
 7. On-the-fly tuning of the offset parameter.
 8. Variable speed rates.
 9. A number of Noteskins to choose from (sprite-based).
 10. Game performance metrics.
 11. Visual effects close to the original arcade.
 12. A background theme which "FEELS THE BEAT".

 There are, however, some features available in Stepmania that PIURED does not support:

 1. The engine only supports a 4/4 bar.
 2. BGA in any video format is not supported.
 3. Dance pads or Joysticks are not supported as input methods.
 4. Performance metrics may not be deterministic.
 5. Only Pump-single, Pump-double and Pump-halfdouble styles are supported. Any other style may cause
 the engine to crash.

 * The {@link Engine} class is the main abstraction for creating a pump it up stage and playing a chart. It contains all
 * methods necessary to create a new stage, add an indefinite number of local and remote players, load Stepmania SSC files,
 * and report players' performance.
 *
 * This class is intended to be used only as javascript code on the client-side, as it will attempt to draw stuff on the browser.
 *
 * @example <caption>Importing the engine via ES6 modules</caption>
 *
 * import {PiuredEngine, StageConfig, PlayerConfig, KeyInputConfig} from '@piured/engine'
 *
 * @example <caption>Full example to configure a working engine.</caption>
 *
 * import {PiuredEngine, StageConfig, PlayerConfig, KeyInputConfig} from '@piured/engine'
 *
 * async function setUpEngine (dom) {
 *     let engine = new Engine()
 *
 *     function stageCleared(performance) {
 *         console.log(performance);
 *         engine = null;
 *     }
 *
 *     function onKeyDown(event) {
 *         engine.keyDown(event);
 *     }
 *
 *     function onKeyUp(event) {
 *         engine.keyUp(event);
 *     }
 *
 *     let speed = 4.0;
 *     let playback = 1.0;
 *     let offset = 0.0;
 *     let noteskin = 'NX';
 *     let touchpadSize = 1.0;
 *     let leftKeyMap = {
 *         dl: 'Z',
 *         ul: 'Q',
 *         c: 'S',
 *         ur: 'E',
 *         dr: 'C'
 *     }
 *     let rightKeyMap = {
 *         dl: 'V',
 *         ul: 'R',
 *         c: 'G',
 *         ur: 'Y',
 *         dr: 'N'
 *     }
 *     let chartLevel = 0;
 *     let innerWidth = 800
 *     let innerHeight = 800
 *     let pixelRatio = window.devicePixelRatio
 *
 *     engine.init(innerWidth, innerHeight, pixelRatio, window)
 *
 *     let stageConfig = new StageConfig('<mp3-url>',
 *         '<ssc-url>',
 *         playback,
 *         offset,
 *         [noteskin],
 *         () => {
 *             let dateToStart = new Date();
 *             // delay of 2 secs
 *             dateToStart.setMilliseconds(dateToStart.getMilliseconds() + 2000.0);
 *             engine.startPlayBack(dateToStart, () => {
 *                 return new Date();
 *             });
 *         }
 *     );
 *
 *     await engine.configureStage(stageConfig);
 *
 *     let p1InputConfig;
 *     let accuracyMargin = 0.15;
 *
 *     accuracyMargin = 0.25;
 *
 *     window.onkeydown = onKeyDown;
 *     window.onkeyup = onKeyUp;
 *
 *     p1InputConfig = new KeyInputConfig(leftKeyMap, rightKeyMap);
 *
 *     let p1Config = new PlayerConfig(p1InputConfig,
 *         noteskin,
 *         chartLevel,
 *         speed,
 *         accuracyMargin);
 *
 *
 *     engine.addPlayer(p1Config);
 *
 *     engine.addToDOM(dom);
 *
 *     window.addEventListener( 'resize', engine.onWindowResize.bind(engine), false );
 *
 *     engine.onStageCleared = stageCleared;
 *
 *     engine.start();
 * }
 *
 * await setUpEngine('<container>')
 *
 */

class Engine {

    _updateList = [] ;
    _inputList = [] ;
    _onKeyDownList = [] ;
    _onKeyUpList = [] ;
    _onTouchDownList = [] ;
    _onTouchUpList = [] ;
    _inputFrameLogList = [] ;
    _id ;
    song ;
    stage ;
    scene ;
    clock ;
    camera ;
    renderer ;
    _playBackTween = undefined ;
    _playBackVal = 1.0 ;
    _playBackUser = 1.0 ;
    _onStageCleared = undefined ;
    _onFrameLog = undefined ;
    _playBackSpeedEnabled = true ;

    containerId ;

    //public

    constructor() {
    }

    /**
     * Configures the renderer and sets the camera into position. Call this method before setting up the stage through {@link Engine#configureStage}.
     * @param width width of canvas
     * @param height height of canvas
     * @param pixelRatio pixel ratio of screen
     * @param window window object from browser, to respond to frames requests
     *
     * @example <caption> Initializing a new engine. </caption>
     *
     * engine.init( 1270, 768, window.devicePixelRatio, window )
     */
    init(
         width,
         height,
         pixelRatio,
         window
         ) {

        this.window = window
        this.clock = new THREE.Clock();

        // For grading the window is fixed in size; here's general code:
        var canvasWidth = width;
        var canvasHeight = height;
        var canvasRatio = canvasWidth / canvasHeight;
        // scene
        this.scene = new THREE.Scene();

        // Camera: Y up, X right, Z up

        this.camera = new THREE.PerspectiveCamera( 45, canvasRatio, 1, 4000 ) ;

        //camera = new THREE.OrthographicCamera(windowWidth/-2, windowWidth/2, windowHeight/2, windowHeight/-2, 0, 40);

        this.camera.position.x = 0;
        this.camera.position.y = -3;
        this.camera.position.z = 10;
        // this.camera.position.z = 30;

        // This way, the X axis increases to the right, the Z axis increases to the bottom, and the Y axis in pointing directly
        // towards the camera.


        this.camera.up = new THREE.Vector3(0,1,0) ;


        this.renderer = new THREE.WebGLRenderer({ antialias: false, preserveDrawingBuffer: false});
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.gammaInput = true;

        this.renderer.gammaOutput = true;
        // Important for HiDPI devices.


        this.renderer.setPixelRatio( pixelRatio );
        this.renderer.setSize( canvasWidth, canvasHeight );
        // this.renderer.setClearColor(new THREE.Color(0xffffff));
        this.renderer.autoClear = false;
        this.renderer.clear();

        // this.cameraControls = new THREE.OrbitControls( this.camera, this.renderer.domElement );
        // this.cameraControls.target = focus ;
        // this.camera.lookAt(focus);
        // this.stats = this.createStats();
        // document.body.appendChild( this.stats.domElement );

        // document.addEventListener( 'mousedown', this.onDocumentMouseDown.bind(this), false );

    }

    /**
     * Constructs the stage where one or more players will dance. In a nutshell, the stage sets up the environment needed
     * to play a specific tune associated with its Stepmania step definition file (i.e., mp3+SSC).
     * This method must be called before adding new players to the stage through {@link Engine#addPlayer}.
     * @param {StageConfig} stageConfig stage configuration
     * @return {undefined}
     *
     * @example <caption> Configuring a new stage. Details of the {@link StageConfig} object are omitted.</caption>
     * let stageConfig = new StageConfig( ... ) ;
     * engine.configureStage(stageConfig) ;
     */
    async configureStage( stageConfig ) {

        this.resourcePath = stageConfig.resourcePath ;
        this.playBackSpeed = stageConfig.playBackSpeed ;
        this.song = new Song(this, stageConfig.SSCFile, stageConfig.audioFile, stageConfig.offset, stageConfig.playBackSpeed, stageConfig.onReadyToStart);
        await this.song.initSSC()
        let resourceManager = new ResourceManager(this.renderer, stageConfig.resourcePath, 'noteskins/', stageConfig.noteskins, 'stage_UHD') ;
        this.stage = new Stage(resourceManager, this, this.song, stageConfig.noteskins) ;
        this.scene.add(this.stage.object) ;

    }

    /**
     * Adds a new player to the dance stage. This method must be called after configuring the stage through {@link Engine#configureStage}.
     * There is no upper limit for the number of players that can join, but for some number the camera position must be updated to show the whole stage.
     * Players could play locally by using traditional input methods (e.g., Keyboard, Touch) or remotely (via logging {@link FrameLog}s).
     * @param {PlayerConfig} playerConfig player configuration
     * @returns {number} player identifier
     *
     * @example <caption> Adding a new player to the stage. Details of the {@link PlayerConfig} object are omitted.</caption>
     * let p1Config = new PlayerConfig( ... ) ;
     * let p1Id = engine.addPlayer(p1Config) ;
     */
    addPlayer( playerConfig ) {

        if (playerConfig.inputConfig instanceof RemoteInput) {
            this._playBackSpeedEnabled = false ;
        }

        return this.stage.addPlayerStage( playerConfig, this.playBackSpeed ) ;
    }

    /**
     * Appends the renderer's DOM element to a container with id `containerId` present in your HTML document.
     * You need to call this function so that the engine has a canvas to draw on.
     * @param {String} containerId container id in the HTML document
     * @return {undefined}
     *
     * @example <caption> Granted we have defined in a HTML document the following container `<div id="container"></div>`, we add the engine to the DOM</caption>
     * engine.addToDOM('container') ;
     */
    addToDOM(containerId) {
        this.containerId = containerId ;
        let container = document.getElementById( containerId );
        container.appendChild( this.renderer.domElement );
    }


    /**
     * Updates the player's stage `playerId` offset. This function can be used to sync off-beat steps on-the-fly when the
     * engine is running.
     * @param {number} playerId player identifier
     * @param {number} newOffsetOffset new offset to be applied in seconds. `newOffsetOffset` must be a floating point number
     * @return {undefined}
     *
     * @example <caption> Updating the offset by 0.01 seconds for player with id `p1Id := 0`.</caption>
     * engine.updateOffset(p1Id, 0.01) ;
     */
    updateOffset(playerId, newOffsetOffset) {

        this.stage.updateOffset(playerId, newOffsetOffset) ;

    }

    /**
     * Updates the stage's audio playback rate (i.e., increases or decreases the audio & step speed). This function might be called
     * while the engine is running. This function won't have any effect if there are remote players logged in the engine.
     * @param {number} playBackSpeed new playback speed to be applied in percentage. `playBackSpeed` must be a floating point
     * @return {undefined}
     *
     * @example <caption> Speeding up the playback rate to 110% (1.1x) </caption>
     * // changes the playback speed to 110%
     * engine.tunePlayBackSpeed(1.1) ;
     *
     * // Essentially stops the playback
     * engine.tunePlayBackSpeed(0.0) ;
     */
    tunePlayBackSpeed ( playBackSpeed ) {
        if (this._playBackSpeedEnabled && playBackSpeed >= 0.0) {
            this._playBackUser = playBackSpeed ;
            this._playBackVal = playBackSpeed ;
        }
    }

    tweenPlayBackSpeed(pb) {
        if (pb < 0) {
            pb = 0 ;
        }
        const time = 500 ;
        if ( this._playBackTween !== undefined ) {
            TWEEN.remove( this._playBackTween ) ;
        }
        const playBackUser = this._playBackUser ;
        this._playBackTween = new TWEEN.Tween( this ).to( { _playBackVal: playBackUser }, time ).delay(time).start();
        new TWEEN.Tween( this ).to( { _playBackVal: pb }, time ).start();


    }

    /**
     * Logs a key down event from the browser into the engine. Keyboard events must be logged if any player is using {@link KeyInputConfig}
     * (i.e. keyboard) as input method.
     * @param {KeyboardEvent} event keyboard event
     * @return {undefined}
     * @example <caption> Configuring the browser to log the key strokes into the engine</caption>
     * window.onkeydown = engine.keyDown ;
     */
    keyDown(event) {
        for (let i = 0 ; i < this._onKeyDownList.length ; i++ ) {
            this._onKeyDownList[i].onKeyDown(event) ;
        }
    }
    /**
     * Logs a key up event from the browser into the engine. Keyboard events must be logged if any player is using {@link KeyInputConfig}
     * (i.e. keyboard) as input method.
     * @param {KeyboardEvent} event keyboard event
     * @return {undefined}
     * @example <caption> Configuring the browser to log the key strokes into the engine</caption>
     * window.onkeyup = engine.keyUp ;
     */
    keyUp(event) {
        for (let i = 0 ; i < this._onKeyUpList.length ; i++ ) {
            this._onKeyUpList[i].onKeyUp(event) ;
        }
    }

    /**
     * Logs a touch down event from the browser into the engine. Touch events must be logged if any player is using {@link TouchInputConfig}
     * (i.e. Touch capable device) as input method.
     * @param {TouchEvent} event touch event
     * @return {undefined}
     * @example <caption> Configuring the browser to log touch down events into the engine</caption>
     * document.addEventListener( 'touchstart', (event) => {
     *     // disable default actions
     *     event.preventDefault();
     *     event.stopPropagation();
     *
     *     engine.touchDown(event) ;
     * }, false );
     */
    touchDown(event) {
        for (let i = 0 ; i < this._onTouchDownList.length ; i++ ) {
            this._onTouchDownList[i].onTouchDown(event) ;
        }
    }
    /**
     * Logs a touch up event from the browser into the engine. Touch events must be logged if any player is using {@link TouchInputConfig}
     * (i.e. Touch capable device) as input method.
     * @param {TouchEvent} event touch event
     * @return {undefined}
     * @example <caption> Configuring the browser to log touch down events into the engine</caption>
     * document.addEventListener( 'touchend', (event) => {
     *     // disable default actions
     *     event.preventDefault();
     *     event.stopPropagation();
     *
     *     engine.touchUp(event) ;
     * }, false );
     */
    touchUp(event) {
        for (let i = 0 ; i < this._onTouchUpList.length ; i++ ) {
            this._onTouchUpList[i].onTouchUp(event) ;
        }
    }

    /**
     * Repositions the camera. Use this method to configure how the stage is displayed.
     * @param {number} X x position in the euclidean space
     * @param {number} Y y position in the euclidean space
     * @param {number} Z z position in the euclidean space
     * @return {undefined}
     *
     * @example <caption> Moving the camera backwards to fully show players' stages when both are playing `pump-double` styles </caption>
     * engine.setCameraPosition(0,-3.4,12) ;
     */
    setCameraPosition( X,Y,Z ) {
        this.camera.position.x = X;
        this.camera.position.y = Y;
        this.camera.position.z = Z;
    }

    /**
     * Query the style of a specific level from the configured stage.
     * @param {number} level level identifier in the range [0-<no_levels-1>]
     * @returns {String} level style defined in the SSC file. Common values are `pump-single`, `pump-double`, and `pump-halfdobule`
     *
     * @example <caption> Query if one player is playing `pump-double` to reposition the camera</caption>
     *
     * let p1StageType = engine.queryStageType(P1chartLevel) ;
     * if (p1StageType === 'pump-double') {
     *     engine.setCameraPosition(0,-3.4,12) ;
     * }
     */
    queryStageType(level) {
        return this.song.getLevelStyle(level) ;
    }



    /**
     * Sets the engine into a valid state and prepares it to start the song playback. Call this function once the stage
     * and all players have been configured. This method will trigger the function {@link StageConfig#onReadyToStart} once
     * the initialization is completed.
     * @return {undefined}
     * @example <caption> Starting the engine </caption>
     * engine.start() ;
     */
    start ( ) {
        this.performReady() ;
        this.song.play() ;
    }
    /**
     * Schedules when the engine should start playing the song and starts the rendering main loop.
     * You may only call this function once {@link StageConfig#onReadyToStart} callback
     * is called.
     * @param {Date} dateToStart date to start playing
     * @param {Function} [getDateFn] function getting the current date
     * @return {undefined}
     *
     * @example <caption> We let the engine start playing back after 2 seconds once the engine has loaded up </caption>
     * let onReadyToStart = () => {
     *      let dateToStart = new Date() ;
     *      // delay of 2 secs
     *      dateToStart.setMilliseconds(dateToStart.getMilliseconds() + 2000.0) ;
     *      engine.startPlayBack(dateToStart, () => { return new Date() ; }
     * }
     *
     */
    startPlayBack( dateToStart, getDateFn = () => { return new Date() ; } ) {
        this.song.startPlayBack(dateToStart, getDateFn) ;
        this.animate();
    }

    /**
     * Stops the engine and cleans up the renderer. This action is not reversible. After calling this method, the object
     * must not be used again. This method is called automatically once the song has reached its end.
     * @returns {undefined}
     */
    stop ( ) {

        this.removeFromDOM() ;

        this.freeEngineResources() ;

        let performances = this.stage.retrievePerformancePlayerStages() ;

        if (this._onStageCleared !== undefined ) {
            this._onStageCleared( performances ) ;
        }

    }

    /**
     * Update size of drawable canvas. You might call this function when the engine is running.
     * @return {undefined}
     * @param newWidth new width of canvas
     * @param newHeight new height of canvas
     * @example <caption> Resize drawable canvas to 500x500 px </caption>
     * engine.resize(500, 500)
     */
    resize (newWidth, newHeight ) {

        this.camera.aspect = newWidth / newHeight ;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( newWidth, newHeight) ;

    }

    /**
     * It logs frameLogs into the engine. FrameLogs are JSON messages that are passed between engines when remote
     * players are configured. They enable the engine to know what is the current status of a remote player.
     * @param {JSON} frameLog frame to be logged
     * @return {undefined}
     *
     * @example<caption> To learn more about how to use frame logs for communicating a pair of engines, have a look at
     * the repo at https://github.com/piulin/piured </caption>
     *
     * engine.logFrame(JSON) ;
     */
    logFrame(frameLog) {
        this._inputFrameLogList.push(frameLog) ;
    }


    /**
     * Sets the callback function `onFrameLog`. This function is called once the engine has a frame to be logged from any
     * local player. Ideally, the content of the JSON is sent through the network somehow and logged into a target engine.
     * @param {Function} value
     * @return {undefined}
     * @example<caption> To learn more about how to use frame logs for communicating a pair of engines, have a look at
     * the repo at https://github.com/piulin/piured </caption>
     *
     * engine.onFrameLog = (frameLog) {
     *     //send it to the remote engine somehow
     *     mm.sendFrameLog(frameLog) ;
     * }
     */
    set onFrameLog(value) {
        this._onFrameLog = value ;
    }

    /**
     * Sets the callback function `onStageCleared`. This function is called once the engine is stopped (either by calling {@link Engine#stop} or
     * by reaching the end of the song). It can be used to report the player's performance.
     * @param {Function} value
     *
     * @example <caption> We report the player's performance when the stage is cleared </caption>
     * engine.onStageCleared = (performance) => {
     *     console.log(performance) ;
     *     window.close() ;
     * }
     */
    set onStageCleared(value) {
        this._onStageCleared = value ;
    }




    //private

    performReady() {
        for (var i = 0 ; i < this._updateList.length ; i++ ) {
            this._updateList[i].ready() ;
        }
    }

    showGrids() {
        // Background grid and axes. Grid step size is 1, axes cross at 0, 0
        Coordinates.drawGrid({size:100,scale:1,orientation:"z", scene: this.scene});
        Coordinates.drawAxes({axisLength:11,axisOrientation:"x",axisRadius:0.04});
        Coordinates.drawAxes({axisLength:11,axisOrientation:"z",axisRadius:0.04});
    }


    addToUpdateList(gameObject) {
        this._updateList.push(gameObject) ;
    }

    addToInputList(gameObject) {
        this._inputList.push(gameObject) ;
    }

    addToKeyUpList(gameObject) {
        this._onKeyUpList.push(gameObject) ;
    }

    addToKeyDownList(gameObject) {
        this._onKeyDownList.push(gameObject) ;
    }

    addToTouchUpList(gameObject) {
        this._onTouchUpList.push(gameObject) ;
    }

    addToTouchDownList(gameObject) {
        this._onTouchDownList.push(gameObject) ;
    }

    getOutputFrameLogList() {
        return this._outputFrameLogList ;
    }
    clearOutputFrameLoglist(){
        this._outputFrameLogList = []
    }

    addToOutputFrameLogList(frameLog) {
        if (this._onFrameLog !== undefined ) {
            this._onFrameLog({
                'playerStageId': frameLog.playerStageId ,
                'json': frameLog.json
            });
        }
        // this._inputFrameLogList.push({
        //     'playerStageId': frameLog.playerStageId,
        //     'json': frameLog.json
        // }) ;
    }



    createStats() {
        var stats = new Stats();
        stats.setMode(0);
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.left = '0';
        stats.domElement.style.top = '0';
        return stats;
    }

    removeFromDOM() {
        let container = document.getElementById( this.containerId );
        container.removeChild( this.renderer.domElement );
    }

    setAllCulled(obj, culled) {
        obj.frustumCulled = culled;
        obj.children.forEach(child => this.setAllCulled(child, culled));
    }



    animate() {
        //Note that .bind(this) is important so it doesnt lose the local context.
        this._id = this.window.requestAnimationFrame(this.animate.bind(this));
        // this._id = this.frameRequester(this.animate.bind(this))
        this.render();

    }

    freeEngineResources() {

        cancelAnimationFrame(this._id) ;

        this.renderer.dispose() ;


        const cleanMaterial = material => {
            material.dispose() ;

            // dispose textures
            for (const key of Object.keys(material)) {
                const value = material[key]
                if (value && typeof value === 'object' && 'minFilter' in value) {
                    value.dispose()
                }
            }
        }

        this.scene.traverse(object => {
            if (!object.isMesh) return
            object.geometry.dispose()

            if (object.material.isMaterial) {
                cleanMaterial(object.material)
            } else {
                // an array of materials
                for (const material of object.material) cleanMaterial(material)
            }
        })
    }

    render() {

        // It is the amount of time since last call to render.
        const delta = this.clock.getDelta();

        //remote frames
        for (var i = 0 ; i < this._inputFrameLogList.length; i++) {
            let flog = this._inputFrameLogList[i] ;
            this.stage.logFrame(flog.playerStageId, flog.json) ;
        }
        this._inputFrameLogList = [] ;


        // process input
        for (var i = 0 ; i < this._inputList.length ; i++ ) {
            this._inputList[i].input() ;
        }

        // Update gameObjects
        for (var i = 0 ; i < this._updateList.length ; i++ ) {
            this._updateList[i].update(delta) ;
        }

        // update tweens
        TWEEN.update();

        this.song.setNewPlayBackSpeed( this._playBackVal ) ;
        this.stage.setNewPlayBackSpeed( this._playBackVal ) ;

        // this.cameraControls.update(delta);
        this.renderer.render(this.scene, this.camera);
        // this.stats.update();
    }


}
export {Engine} ;