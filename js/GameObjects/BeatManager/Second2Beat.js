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



import {Curve} from "./Curve.js";
import {Point} from "./Point.js";
import {Interval} from "./Interval.js";

class Second2Beat {


    _curve ;
    _bpms ;
    constructor(bpms) {

        let longFloat = 100000.0 ;

        this._bpms = Array.from(bpms) ;
        this._curve = new Curve() ;


        let l = Array.from(this._bpms[this._bpms.length -1]) ;
        l[0] += longFloat ;
        this._bpms.push(l)
        let prevPoint = new Point(0.0,0.0) ;

        for ( let i = 0 ; i < this._bpms.length -1 ; i++ ) {

            let beat1 = this._bpms[ i ][0] ;
            let bpm1 = this._bpms[ i ] [1] ;
            let beat2 = this._bpms[ i+1 ][0] ;
            let bpm2 = this._bpms[ i+1 ] [1] ;


            let x = this.secondsPerBeat(bpm1) * (beat2 - beat1) + prevPoint.x;
            let y = beat2 ;
            let p = new Point(x,y) ;

            let interval = new Interval(prevPoint, p , i === 0 ,i  === this._bpms.length -2) ;

            this._curve.addInterval(interval) ;

            prevPoint = new Point(p.x, p.y) ;


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


    secondsPerBeat(bpm) {

        return 1.0 / (bpm / 60.0) ;

    }


}

export  {Second2Beat} ;