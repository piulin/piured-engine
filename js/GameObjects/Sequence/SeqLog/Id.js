"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

class Id {

    constructor() {}
    // returns stepId
    getId(kind, padId, bar) {
        return kind + '-' + padId + '-' + bar  ;
    }

}