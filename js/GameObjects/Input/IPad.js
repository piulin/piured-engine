"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



class IPad extends Pad {


    constructor(resourceManager, padId) {
        super(resourceManager, null, padId) ;

    }

    update(delta) {

    }



    set dlKeyPressed(value) {
        this._dlKeyPressed = value;
    }


    set ulKeyPressed(value) {
        this._ulKeyPressed = value;
    }



    set cKeyPressed(value) {
        this._cKeyPressed = value;
    }



    set urKeyPressed(value) {
        this._urKeyPressed = value;
    }



    set drKeyPressed(value) {
        this._drKeyPressed = value;
    }



    set dlKeyHold(value) {
        this._dlKeyHold = value;
    }



    set ulKeyHold(value) {
        this._ulKeyHold = value;
    }


    set cKeyHold(value) {
        this._cKeyHold = value;
    }


    set urKeyHold(value) {
        this._urKeyHold = value;
    }


    set drKeyHold(value) {
        this._drKeyHold = value;
    }


    get dlKeyPressed() {
        return this._dlKeyPressed;
    }

    get ulKeyPressed() {
        return this._ulKeyPressed;
    }


    get cKeyPressed() {
        return this._cKeyPressed;
    }


    get urKeyPressed() {
        return this._urKeyPressed;
    }


    get drKeyPressed() {
        return this._drKeyPressed;
    }


    get dlKeyHold() {
        return this._dlKeyHold;
    }


    get ulKeyHold() {
        return this._ulKeyHold;
    }


    get cKeyHold() {
        return this._cKeyHold;
    }


    get urKeyHold() {
        return this._urKeyHold;
    }

    get drKeyHold() {
        return this._drKeyHold;
    }



}