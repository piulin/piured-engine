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
'use strict'; // good practice - see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode

/**
 * This class holds the configuration of a stage.
 * @param {string} SSCFile path to the Stepmania SSC file describing the levels and steps available. This parameter can be `undefined` if parsedSSC is provided.
 * @param {string} parsedSSC parsed SSC file in JSON format (output of ssc-parser). If this parameter is `undefined` then, parameter `SSCFile` must be provided.
 * @param {string} audioFile path to the audio file in mp3 or ogg format associated with the SSC file
 * @param {number} playBackSpeed song playback rate. A `playBackSpeed` equal to 1.0 configure the engine to play the song at the normal speed
 * @param {number} offset synchronization offset. Use it to synchronize off-the-beat charts with the audio
 * @param {Array} noteskins list of noteskins available to use for playerStages. Include those only used in them.
 * @param {string} resourceURL URL to grab the stage assets
 * @param {Function} onReadyToStart callback function. This function will be called once the engine has loaded up completely the stage
 * and it's ready to begin the playback
 *
 * @example
 *
 * let stageConfig = new StageConfig('song.ssc',
 *          undefined,
 *          'song.mp3',
 *          1.0,
 *          0.0,
 *          'piured-engine,
 *          ['NXA'],
 *          '../',
 *          () => {
 *              let dateToStart = new Date() ;
 *              // delay of 2 secs
 *              dateToStart.setMilliseconds(dateToStart.getMilliseconds() + 2000.0) ;
 *              engine.startPlayBack(dateToStart, () => {return new Date() ;}) ;
 *          }
 * ) ;
 *
 */
class StageConfig {
  _SSCFile;
  _audioFile;
  _playBackSpeed;
  _offset;
  _resourcePath;
  _noteskins;
  _parsedSSC;
  _autoPlay;
  _onReadyToStart = undefined;

  constructor(
    SSCFile,
    parsedSSC,
    audioFile,
    playBackSpeed,
    offset,
    noteskins,
    resourceURL = '../',
    onReadyToStart = () => {},
    autoPlay = false
  ) {
    this._SSCFile = SSCFile;
    this._parsedSSC = parsedSSC;
    this._audioFile = audioFile;
    this._playBackSpeed = playBackSpeed;
    this._offset = offset;
    this._resourcePath = resourceURL;
    this._noteskins = noteskins;
    this._onReadyToStart = onReadyToStart;
    this._autoPlay = autoPlay;
  }

  get SSCFile() {
    return this._SSCFile;
  }

  get parsedSSC() {
    return this._parsedSSC;
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

  get noteskins() {
    return this._noteskins;
  }

  get onReadyToStart() {
    return this._onReadyToStart;
  }

  get autoPlay() {
    return this._autoPlay;
  }
}

export { StageConfig };
