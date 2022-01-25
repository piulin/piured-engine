"use strict"; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode



// This class is responsible for the input of a pad (5 steps)
class StageConfig {

    _SSCFile ;
    _audioFile ;
    _playBackSpeed ;
    _offset ;
    _resourcePath ;
    _noteskin ;
    _onReadyToStart = undefined ;


    constructor(SSCFile, audioFile, playBackSpeed, offset, resourcePath, noteskin, onReadyToStart = () => {} ) {
        this._SSCFile = SSCFile;
        this._audioFile = audioFile;
        this._playBackSpeed = playBackSpeed;
        this._offset = offset;
        this._resourcePath = resourcePath;
        this._noteskin = noteskin;
        this._onReadyToStart = onReadyToStart ;
    }


    get SSCFile() {
        return this._SSCFile;
    }

    get audioFile() {
        return this._audioFile;
    }

    get playBackSpeed() {
        return this._playBackSpeed;
    }

    get offset() {
        return this._offset;
    }

    get resourcePath() {
        return this._resourcePath;
    }

    get noteskin() {
        return this._noteskin;
    }

    get onReadyToStart() {
        return this._onReadyToStart;
    }
}