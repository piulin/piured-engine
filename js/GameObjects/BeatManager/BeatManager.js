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



class BeatManager extends GameObject {


    constructor(resourceManager, song, level, speed, keyBoardLag, playBackSpeed) {

        super(resourceManager) ;

        this.playBackSpeed = playBackSpeed ;

        this.bpmList = song.getBMPs(level) ;
        this.scrollList = song.getScrolls(level) ;
        this.stopsList = song.getStops(level) ;
        this.delaysList = song.getDelays(level) ;
        this.warpsList = song.getWARPS(level) ;
        this.speedsList = song.getSpeeds(level) ;
        this.song = song ;
        this.level = level ;
        this.keyBoardLag = keyBoardLag ;
        this.customOffset = 0 ;
        this.requiresResync = false ;


        // new beatmanager

        this.second2beat = new Second2Beat(this.bpmList) ;
        this.second2displacement = new Second2Displacement(this.scrollList,this.bpmList,this.second2beat) ;
        this.songTime2Second = new SongTime2Second(this.stopsList, this.delaysList, this.warpsList, this.second2beat) ;
        this.beat2speed = new Beat2Speed(this.speedsList, this.second2beat) ;
        this._speed = speed;

    }

    ready() {

        this._currentAudioTime = 0 ;
        this._currentAudioTimeReal = 0 ;
        this._currentChartAudioTime = 0 ;
        this._currentChartAudioTimeReal = 0
        this.currentBPM = 0 ;
        this.currentYDisplacement = -100 ;
        this.currentBeat = 0 ;
        this.currentTickCount = 1 ;


    }

    setNewPlayBackSpeed ( newPlayBackSpeed ) {
        this.playBackSpeed = newPlayBackSpeed ;
    }

    updateOffset(offset) {
        this.customOffset += offset ;
        this.requiresResync = true ;
    }


    update(delta) {

        const songAudioTime = this.song.getCurrentAudioTime(this.level) - this.customOffset ;

        if ( songAudioTime <= 0.0 || this.requiresResync) {
        // if ( true ) {
            this.requiresResync = false ;
            this._currentAudioTime = songAudioTime - this.keyBoardLag;
            this._currentAudioTimeReal = songAudioTime;
        } else {
            this._currentAudioTime += delta * this.playBackSpeed ;
            this._currentAudioTimeReal += delta * this.playBackSpeed;

        }

        this._currentChartAudioTime = this.songTime2Second.scry(this._currentAudioTime).y ;
        this._currentChartAudioTimeReal = this.songTime2Second.scry(this._currentAudioTimeReal).y ;


        this.currentYDisplacement = this.second2displacement.scry(this._currentChartAudioTime).y ;

        this.currentBeat = this.second2beat.scry(this._currentChartAudioTime).y ;



        // console.log('time: '+ this.currentAudioTime +'\n dis: ' + this.currentYDisplacement + ' beat: '  + this.currentBeat +
        // '\n rds: ' + realDisp + ' rbet: ' + realBeat) ;

        this.updateCurrentBPM() ;

        this.currentTickCount = this.song.getTickCountAtBeat(this.level, this.currentBeat) ;

    }

    get currentAudioTime () {
        return this._currentChartAudioTime ;
    }

    get currentAudioTimeReal() {
        return this._currentChartAudioTimeReal ;
    }

    updateCurrentBPM () {

        const tickCounts = this.bpmList ;
        let last = tickCounts[0][1];
        for ( const tickCount of tickCounts ) {
            const beatInTick = tickCount[0] ;
            const tick = tickCount[1] ;
            if ( this.currentBeat >= beatInTick ) {
                last = tick ;
            } else {
                break ;
            }
        }
        this.currentBPM = last ;

    }

    getScrollAtBeat(beat) {
        const tickCounts = this.scrollList ;
        let last = tickCounts[0];
        for ( const tickCount of tickCounts ) {
            const beatInTick = tickCount[0] ;
            const tick = tickCount[1] ;
            if ( beat >= beatInTick ) {
                last = tickCount ;
            } else {
                return last ;
            }
        }
        return last ;
    }

    isNoteInWarp(beat) {
        for ( const warp of this.warpsList ) {
            const b1 = warp[0] ;
            const b2 = b1 + warp[1] ;
            if ( beat >= b1 && beat < b2 ) {
                return true ;
            }

            if ( beat < b1 ) {
                return false ;
            }
        }
        return false ;
    }

    getCurrentSpeed() {
        return this.beat2speed.scry(this.currentBeat).y ;
    }


    getYShiftAndCurrentTimeInSongAtBeat( beat ) {

        let second = this.second2beat.reverseScry(beat).x ;
        let yShift = -this.second2displacement.scry(second).y * this._speed;


        return [yShift, second] ;

    }



}