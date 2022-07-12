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



import {Point} from "./Point.js";
import {Curve} from "./Curve.js";
import {Interval} from "./Interval.js";

class Beat2Speed {


    _curve ;
    _speeds ;
    _beat2s = [] ;
    _s2b ;

    constructor( speeds, s2b ) {

        this._s2b = s2b ;
        this._speeds = Array.from(speeds) ;
        this._curve = new Curve() ;

        this.cleanUp() ;

        let longFloat = 1000000.0 ;


        let prevPoint = new Point(-longFloat,this._speeds[ 0 ][1]) ;


        for ( let i = 0 ; i < this._speeds.length ; i++ ) {

            let [ beat, speed, span, mode ] = this._speeds[ i ] ;

            //flat interval

            let f1 = new Point(prevPoint.x, prevPoint.y) ;
            let f2 = new Point(beat, prevPoint.y ) ;

            let fInterval = new Interval(f1, f2 , i === 0 ,false) ;
            this._curve.addInterval(fInterval) ;




            let beat2 ;
            // convert span in seconds into beats if mode is 1.
            if ( mode === '1' ) {
                let sec = s2b.reverseScry(beat).x ;
                sec = sec + span ;
                beat2 = s2b.scry(sec).y ;
            } else {
                beat2 = beat + span ;
            }

            //slope (change of speed) interval

            let p1 = new Point(beat,prevPoint.y) ;
            let p2 = new Point(beat2,speed) ;

            let interval = new Interval(p1, p2 , false,false) ;

            this._curve.addInterval(interval) ;

            prevPoint = p2


        }
        //flat area
        let f1 = new Point(prevPoint.x, prevPoint.y) ;
        let f2 = new Point(longFloat, prevPoint.y ) ;

        let fInterval = new Interval(f1, f2 , false ,true) ;
        this._curve.addInterval(fInterval) ;

    }

    cleanUp() {

        for ( let i = 0 ; i < this._speeds.length -1 ; i++ ) {

            let [ beat, speed, span, mode ] = this._speeds[ i ] ;
            let [ nbeat, nspeed, nspan, nmode ] = this._speeds[ i+1 ] ;

            let beat2 = this.getBeat2(mode, beat, span) ;

            if ( beat2 > nbeat ) {
                this._speeds[i][2] = nbeat - beat ;
                this._speeds[i][3] = 0 ;
            }

            this._beat2s.push(this._speeds[i][2]) ;

        }

    }

    getBeat2(mode, beat, span) {
        if ( mode === 1 ) {
            let sec = this._s2b.reverseScry(beat).x ;
            sec = sec + span ;
            return this._s2b.scry(sec).y ;
        } else {
            return beat + span ;
        }
    }

    scry(beat) {

        let p = new Point(beat, 0 ) ;
        return this._curve.scryY(p) ;

    }



}

export {Beat2Speed} ;