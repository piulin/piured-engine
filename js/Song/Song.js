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


import readFileContent from "../Utils/FileReader.js";
import {parseSSC} from 'ssc-parser'
import * as THREE from 'three'


class Song {

    constructor(engine, pathToSSCFile, parsedSSC,  audioBuf, offset, playBackSpeed, onReadyToStart) {

        this.engine = engine
        this.pathToSSCFile = pathToSSCFile;
        this.parsedSSC = parsedSSC;

        // Metadata of the song
        this.meta = {};

        // NoteData of each level.
        this.levels = [];

        this.playBackSpeed = playBackSpeed;

        this.syncTime = offset;

        this.audioBuf = audioBuf;

        this.requiresResync = false;

        this.readyToStart = false;

        this.onReadyToStart = onReadyToStart;

        this.delay = 0.0;



    }

    async initSSC(){
        if (this.pathToSSCFile !== undefined) {
            await readFileContent(this.pathToSSCFile, this.loadSSC.bind(this));
        } else {
            this.meta = this.parsedSSC.header ;
            this.levels = this.parsedSSC.levels ;
        }
    }

    getWARPS(level) {
        let arr ;
        if ( 'WARPS' in this.levels[level] ) {
            arr = this.levels[level].WARPS ;
        } else if ('WARPS' in this.meta) {
            arr = this.meta['WARPS'] ;
        } else {
            return [] ;
        }
        return arr ;
    }

    getLevelDifficulty(level) {
        return parseInt(this.levels[level].METER) === undefined ? 1 : parseInt(this.levels[level].METER) ;
    }


    getBMPs(level) {
        if ( 'BPMS' in this.levels[level] ) {
            return this.levels[level].BPMS ;
        } else {
            return this.meta['BPMS'] ;
        }
    }

    getTickCounts(level) {
        if ( 'TICKCOUNTS' in this.levels[level] ) {
            return this.levels[level].TICKCOUNTS;
        } else if ('TICKCOUNTS' in this.meta) {
            return this.meta['TICKCOUNTS'] ;
        } else {
            return [[0.0,4]] ;
        }
    }

    getScrolls(level) {
        if ( 'SCROLLS' in this.levels[level] ) {
            return this.levels[level].SCROLLS ;
        } else if ( 'SCROLLS' in this.meta) {
            return this.meta['SCROLLS'] ;
        } else {
            return [[0.0,1.0]] ;
        }
    }

    getStops(level) {
        let arr ;
        if ( 'STOPS' in this.levels[level] ) {
            arr = this.levels[level].STOPS ;
        } else if ('STOPS' in this.meta) {
            arr = this.meta['STOPS'] ;
        } else {
            return [] ;
        }
        return arr ;
    }

    getDelays(level) {
        let arr ;
        if ( 'DELAYS' in this.levels[level] ) {
            arr = this.levels[level].DELAYS;
        } else if ( 'DELAYS' in this.meta) {
            arr = this.meta['DELAYS'] ;
        } else {
            return [] ;
        }
        return arr ;
    }

    getSpeeds(level) {
        if ( 'SPEEDS' in this.levels[level] ) {
            return this.levels[level].SPEEDS;
        } else if ( 'SPEEDS' in this.meta ) {
            return this.meta['SPEEDS'] ;
        } else {
            return [[0.0,1.0,0.0,0.0]] ;
        }
    }

    getOffset(level) {
        if ( 'OFFSET' in this.levels[level] ) {
            return this.levels[level].OFFSET ;
        } else {
            return this.meta['OFFSET'];
        }
    }

    getBannerPath() {
        return this.pathToSSCFile.substr(0, this.pathToSSCFile.lastIndexOf("/")) + '/' + this.meta['BACKGROUND'] ;
    }

    getTickCountAtBeat(level, beat) {

        const tickCounts = this.getTickCounts(level) ;
        let last = tickCounts[0][1];
        for ( const tickCount of tickCounts ) {
            const beatInTick = tickCount[0] ;
            const tick = tickCount[1] ;
            if ( beat >= beatInTick ) {
                last = tick ;
            } else {
                return last ;
            }

        }
        return last ;
    }

    getBPMAtBeat(level, beat) {

        const tickCounts = this.getBMPs(level) ;
        let last = tickCounts[0][1];
        for ( const tickCount of tickCounts ) {
            const beatInTick = tickCount[0] ;
            const tick = tickCount[1] ;
            if ( beat >= beatInTick ) {
                last = tick ;
            } else {
                return last ;
            }

        }
        return last ;
    }

    getSpeedAndTimeAtBeat(level, beat) {

        const speeds = this.getSpeeds(level) ;
        let last = speeds[0];
        for ( const speed of speeds ) {
            const beatInSpeed = speed[0] ;
            if ( beat >= beatInSpeed ) {
                last = speed ;
            } else {

                // we also return the type: time in seconds or beats.
                return [last[1],last[2], last[3]] ;
            }

        }
        return [last[1],last[2], last[3]] ;
    }

    getLevelStyle(level) {
        return this.levels[level].STEPSTYPE ;
    }



    getMusicPath() {
        return this.pathToSSCFile.substr(0, this.pathToSSCFile.lastIndexOf("/")) + '/' + this.meta['MUSIC'] ;
        // return this.musicPath ;
    }



    loadSSC(content) {

        const parse = parseSSC(content) ;
        this.meta = parse.header ;
        this.levels = parse.levels ;

    }

    setNewPlayBackSpeed ( newPlayBackSpeed ) {
        this.source.playbackRate.value = newPlayBackSpeed ;
        this.playBackSpeed = newPlayBackSpeed ;
        // this.requiresResync = true ;
    }


    play () {

        let audioLoader = new THREE.AudioLoader();
        let context = null ;

        if('webkitAudioContext' in window) {
            context = new webkitAudioContext();
        } else {
            context = new AudioContext();
        }
        this.context = context ;
        audioLoader.load( this.audioBuf, this.setUpPlayBack.bind(this)) ;



        // context.decodeAudioData(this.audioBuf, this.playBack.bind(this));


        //analyser = new THREE.AudioAnalyser( audio, 32 );
        // audioLoader.load( this.getMusicPath(), this.playBack.bind(this)
        //
        //
        // );

        // this.startTime =  ;
    }

    setUpPlayBack( buf ) {
        let source = this.context.createBufferSource();
        this.source = source ;
        source.playbackRate.value = this.playBackSpeed ;
        source.onended = this.playBackEnded.bind(this) ;

        // source.detune.value = 1200 ;
        source.connect(this.context.destination);
        source.buffer = buf;
        this.onReadyToStart() ;

        // this.delay = this.songStartDelay() ;

    }

    startPlayBack(startDate, getCurrentDatefn) {

        let currentDate = getCurrentDatefn() ;

        //           convert to secs
        this.delay = (startDate - currentDate) / 1000.0 ;


        this.startTime = this.context.currentTime;

        // this.startTime = 0;
        // console.log('start time: ' + this.startTime ) ;
        console.log('computed delay: ' + this.delay) ;
        this.source.start(this.startTime + this.delay) ;
        this.readyToStart = true ;
    }


    playBackEnded() {
        this.context.close() ;
        this.engine.stop( ) ;
    }

    // This method is called when the buffer with the song is ready.
    // playBack( buffer ) {
    //
    //     let audioBufferSourceNode = this.context.createBufferSource();
    //     audioBufferSourceNode.buffer = buffer ;
    //     audioBufferSourceNode.connect(this.context.destination);
    //     this.startTime = this.context.currentTime;
    //     audioBufferSourceNode.start(this.startTime + this.delay) ;
    //     console.log('Start time: ' + this.startTime);
    //
    // }



    getCurrentAudioTime( level ) {
        // return this.context.currentTime ;
        // console.log('Outside start time: ' + this.startTime) ;
        // this.levels[level].meta['OFFSET'] ;
        if ( this.readyToStart === false ) return -1.0 ;
        return this.context.currentTime - this.delay + this.getOffset(level)  - this.startTime - this.syncTime;
        // return this.startTime - this.audio.context.currentTime + parseFloat(this.meta['OFFSET']);
        //return this.audio.context.currentTime + this.startTime + parseFloat(this.meta['OFFSET']);
    }

    getTotalOffset(level) {
        return - this.delay + this.getOffset(level) - this.startTime;
    }

    closeBuff (){
        this.context.close() ;
    }




}

export {Song} ;