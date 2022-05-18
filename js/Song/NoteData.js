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

class NoteData {

    constructor( noteDataSSCContent ) {

        let notesSSC = noteDataSSCContent['NOTES'] ;

        // metadata of the notedata section
        this.meta = noteDataSSCContent ;

        
        delete this.meta['NOTES'] ;
        // aka bars in music terminology
        // shape: bars x notesperbar x note
        this.measures = notesSSC.split(',') ;

        for ( var i = 0 ; i < this.measures.length ; i++ ) {

            this.measures[i] = this.measures[i].split('\n') ;
            //remove first and last element
            this.measures[i].pop();
            this.measures[i].shift();

        }

    }

}

export {NoteData} ;

