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




class SongTime2Second {


    _curve ;
    _stops ;
    _delays ;
    _s2b ;
    _eps = 0.000001 ;
    constructor(stops, delays, s2b) {


        this._s2b = s2b ;
        let longFloat = 100000.0 ;

        this._stops = Array.from(stops) ;
        this._delays = Array.from(delays) ;
        this._curve = new Curve() ;
        this._curve.addInterval(new Interval(new Point(0.0,0.0), new Point(longFloat,longFloat), true, true)) ;


        for ( let i = 0 ; i < this._stops.length ; i++ ) {

            let beat = this._stops[ i ] [0] ;
            let span = this._stops[ i ] [1] ;

            this.flatten(beat, span, this._eps) ;

        }

        for ( let i = 0 ; i < this._delays.length; i++ ) {

            let beat = this._delays[ i ] [0] ;
            let span = this._delays[ i ] [1] ;

            this.flatten(beat, span, -this._eps) ;

        }

    }


    flatten(beat, span, eps) {

        let y1 = this._s2b.reverseScry(beat + eps).x ;
        let x1 = this._curve.scryX(new Point(0.0,y1)).x ;
        let x2 = x1 + span ;
        let y2 = this._curve.scryY(new Point(x2,0.0)).y ;


        let i1 = this._curve.findIntervalAtY(y1) ;
        this._curve.splitIntervalAtY(i1, y1) ;

        let i2 = this._curve.findIntervalAtY(y2) ;
        this._curve.splitIntervalAtY(i2, y2) ;


        let intervals = this._curve.findIntervalsBetweenY(y1,y2) ;
        intervals.pop() ;

        let remainderIntervals = this._curve.findIntervalsFromY(y2) ;


        let diff = intervals[0].p2.y - intervals[0].p1.y ;
        intervals[0].p2.y = intervals[0].p1.y ;

        for (let j = 0 ; j < remainderIntervals.length ; j++) {
            let itvl = remainderIntervals[j] ;
            itvl.p1.y -= diff ;
            itvl.p2.y -= diff ;
        }



    }

    scry(value) {

        let p = new Point(value, 0 ) ;
        return this._curve.scryY(p) ;

    }

    reverseScry(value) {

        let p = new Point(0.0, value ) ;
        return this._curve.scryX(p) ;

    }


}