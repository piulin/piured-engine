'use strict' ;

class StepNote extends GameObject {

    _mesh ;
    _kind ;
    _padId ;

    _timeStamp ;
    _pressed ;

    _id ;


    constructor(resourceManager, kind, padId, timeStamp) {
        super(resourceManager);

        this._kind = kind ;
        this._padId = padId ;
        this._mesh = this._resourceManager.constructStepNote( this._kind ) ;
        this._timeStamp = timeStamp ;
    }


    ready() {



        this._pressed = false ;

    }


    set id(value) {
        this._id = value;
    }


    get id() {
        return this._id;
    }

    update(delta) {

    }


    get pressed() {
        return this._pressed;
    }


    set pressed(value) {
        this._pressed = value;
    }

    get kind() {
        return this._kind ;
    }

    get padId() {
        return this._padId ;
    }

    get timeStamp( ) {
        return this._timeStamp ;
    }

    get object () {
        return this._mesh;
    }
}