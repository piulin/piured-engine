"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



class Pad extends GameObject {




    constructor(resourceManager, keyMap, padId, frameLog) {
        super(resourceManager) ;
        // Key maps
        if (keyMap !== null) {
            this._dlKey =  keyMap.dl.toLowerCase() ;
            this._ulKey = keyMap.ul.toLowerCase() ;
            this._cKey = keyMap.c.toLowerCase() ;
            this._urKey = keyMap.ur.toLowerCase() ;
            this._drKey = keyMap.dr.toLowerCase() ;
        }

        this._dlKeyPressed = false ;
        this._ulKeyPressed = false ;
        this._cKeyPressed = false ;
        this._urKeyPressed = false ;
        this._drKeyPressed = false ;

        this._dlKeyHold = false ;
        this._ulKeyHold = false ;
        this._cKeyHold = false ;
        this._urKeyHold = false ;
        this._drKeyHold = false ;

        this._padId = padId ;

        this.frameLog = frameLog ;

    }

    isPressed(kind) {
        switch (kind) {
            case 'dl':
                return  this.dlKeyPressed ;
                break ;
            case 'ul':
                return  this.ulKeyPressed ;
                break ;
            case 'c':
                return  this.cKeyPressed ;
                break ;
            case 'ur':
                return  this.urKeyPressed ;
                break ;
            case 'dr':
                return  this.drKeyPressed ;
                break ;
        }
    }

    isHeld(kind) {
        switch (kind) {
            case 'dl':
                return  this.dlKeyHold ;
                break ;
            case 'ul':
                return  this.ulKeyHold ;
                break ;
            case 'c':
                return  this.cKeyHold ;
                break ;
            case 'ur':
                return  this.urKeyHold ;
                break ;
            case 'dr':
                return  this.drKeyHold ;
                break ;
        }
    }

    ready() {

    }


    update(delta) {
        // to avoid login every time
        if ( this.dlKeyPressed !== false ) {
            this.dlKeyPressed = false ;
        }

        if (this.ulKeyPressed !== false ) {
            this.ulKeyPressed = false ;
        }

        if (this.cKeyPressed !== false) {
            this.cKeyPressed = false ;
        }

        if (this.urKeyPressed !== false) {
            this.urKeyPressed = false ;
        }

        if (this.drKeyPressed !== false) {
            this.drKeyPressed = false ;
        }
    }

    get padId() {
        return this._padId;
    }

    set padId(value) {
        this._padId = value;
    }

    get dlKey() {

        return this._dlKey;
    }

    set dlKey(value) {
        this._dlKey = value;
    }

    get ulKey() {
        return this._ulKey;
    }

    set ulKey(value) {
        this._ulKey = value;
    }

    get cKey() {
        return this._cKey;
    }

    set cKey(value) {
        this._cKey = value;
    }

    get urKey() {
        return this._urKey;
    }

    set urKey(value) {
        this._urKey = value;
    }

    get drKey() {
        return this._drKey;
    }

    set drKey(value) {
        this._drKey = value;
    }

    get dlKeyPressed() {
        return this._dlKeyPressed;
    }

    set dlKeyPressed(value) {
        this.frameLog.logPadInput('dl',this._padId,'pressed',value) ;
        this._dlKeyPressed = value;
    }

    get ulKeyPressed() {
        return this._ulKeyPressed;
    }

    set ulKeyPressed(value) {
        this.frameLog.logPadInput('ul',this._padId,'pressed',value) ;
        this._ulKeyPressed = value;
    }

    get cKeyPressed() {
        return this._cKeyPressed;
    }

    set cKeyPressed(value) {
        this.frameLog.logPadInput('c',this._padId,'pressed',value) ;
        this._cKeyPressed = value;
    }

    get urKeyPressed() {
        return this._urKeyPressed;
    }

    set urKeyPressed(value) {
        this.frameLog.logPadInput('ur',this._padId,'pressed',value) ;
        this._urKeyPressed = value;
    }

    get drKeyPressed() {
        return this._drKeyPressed;
    }

    set drKeyPressed(value) {
        this.frameLog.logPadInput('dr',this._padId,'pressed',value) ;
        this._drKeyPressed = value;
    }

    get dlKeyHold() {
        return this._dlKeyHold;
    }

    set dlKeyHold(value) {
        this.frameLog.logPadInput('dl',this._padId,'hold',value) ;
        this._dlKeyHold = value;
    }

    get ulKeyHold() {
        return this._ulKeyHold;
    }

    set ulKeyHold(value) {
        this.frameLog.logPadInput('ul',this._padId,'hold',value) ;
        this._ulKeyHold = value;
    }

    get cKeyHold() {
        return this._cKeyHold;
    }

    set cKeyHold(value) {
        this.frameLog.logPadInput('c',this._padId,'hold',value) ;
        this._cKeyHold = value;
    }

    get urKeyHold() {
        return this._urKeyHold;
    }

    set urKeyHold(value) {
        this.frameLog.logPadInput('ur',this._padId,'hold',value) ;
        this._urKeyHold = value;
    }

    get drKeyHold() {
        return this._drKeyHold;
    }

    set drKeyHold(value) {
        this.frameLog.logPadInput('dr',this._padId,'hold',value) ;
        this._drKeyHold = value;
    }



}