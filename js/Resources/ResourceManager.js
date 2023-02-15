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

import * as THREE from 'three';
import { BackgroundGeometry } from './Geometries/BackgroundGeometry.js';
import { ComboGeometry } from './Geometries/ComboGeometry.js';
import { DigitGeometry } from './Geometries/DigitGeometry.js';
import { DLifeBarGeometry } from './Geometries/DLifeBarGeometry.js';
import { HoldGeometry } from './Geometries/HoldGeometry.js';
import { JudgmentGeometry } from './Geometries/JudgmentGeometry.js';
import { LifeBarGeometry } from './Geometries/LifeBarGeometry.js';
import { PulseGeometry } from './Geometries/PulseGeometry.js';
import { ReceptorGeometry } from './Geometries/ReceptorGeometry.js';
import { StepGeometry } from './Geometries/StepGeometry.js';
import { TipGeometry } from './Geometries/TipGeometry.js';
import { AdditiveMaterial } from './Materials/AdditiveMaterial.js';
import { TransparentMaterial } from './Materials/TransparentMaterial.js';
import { BackgroundMaterial } from './Shaders/BackgroundMaterial.js';
import { ReceptorMaterial } from './Shaders/ReceptorMaterial.js';
import { PNGTexture } from './Textures/PNGTexture.js';

class ResourceManager {
  _materialsDict = { NOTESKINS: {} };
  _geometryDict = {};
  _textureDict = { NOTESKINS: {} };
  _shadersDict = {};

  constructor(
    renderer,
    resourcePath,
    noteskinPath,
    noteskinIds,
    stagePath,
    noteskinsResolution
  ) {
    this.renderer = renderer;
    this.resourcePath = resourcePath;
    this.loadGeometries();
    noteskinIds.forEach(noteskinId => {
      this.loadNoteskinTextures(
        resourcePath + noteskinPath + noteskinId + `/${noteskinsResolution}`,
        noteskinId
      );
    });
    this.loadStageTextures(resourcePath + stagePath);
    this.loadMaterials();
    this.loadShaderMaterials();
  }

  loadGeometries() {
    // Geometries
    this._geometryDict['B'] = new BackgroundGeometry();
    this._geometryDict['C'] = new ComboGeometry();
    this._geometryDict['D'] = new DigitGeometry();
    this._geometryDict['S'] = new StepGeometry();
    this._geometryDict['H'] = new HoldGeometry();
    this._geometryDict['J'] = new JudgmentGeometry();
    this._geometryDict['R'] = new ReceptorGeometry();
    this._geometryDict['L'] = new LifeBarGeometry();
    this._geometryDict['DL'] = new DLifeBarGeometry();
    this._geometryDict['T'] = new TipGeometry();
    this._geometryDict['P'] = new PulseGeometry();
  }

  loadNoteskinTextures(noteskinPath, noteskinId) {
    if (noteskinId in this._textureDict['NOTESKINS']) {
      return;
    }

    let stepDic = {};
    // StepNotes

    stepDic['SDL'] = new PNGTexture(
      this.renderer,
      noteskinPath + '/DownLeft TapNote 3x2.PNG'
    );
    stepDic['SUL'] = new PNGTexture(
      this.renderer,
      noteskinPath + '/UpLeft TapNote 3x2.PNG'
    );
    stepDic['SC'] = new PNGTexture(
      this.renderer,
      noteskinPath + '/Center TapNote 3x2.PNG'
    );
    stepDic['SUR'] = new PNGTexture(
      this.renderer,
      noteskinPath + '/UpRight TapNote 3x2.PNG'
    );
    stepDic['SDR'] = new PNGTexture(
      this.renderer,
      noteskinPath + '/DownRight TapNote 3x2.PNG'
    );

    //Holds & EndNotes
    stepDic['HDL'] = new PNGTexture(
      this.renderer,
      noteskinPath + '/DownLeft Hold 6x1.PNG'
    );
    stepDic['HUL'] = new PNGTexture(
      this.renderer,
      noteskinPath + '/UpLeft Hold 6x1.PNG'
    );
    stepDic['HC'] = new PNGTexture(
      this.renderer,
      noteskinPath + '/Center Hold 6x1.PNG'
    );
    stepDic['HUR'] = new PNGTexture(
      this.renderer,
      noteskinPath + '/UpRight Hold 6x1.PNG'
    );
    stepDic['HDR'] = new PNGTexture(
      this.renderer,
      noteskinPath + '/DownRight Hold 6x1.PNG'
    );

    //Receptor
    stepDic['R'] = new PNGTexture(
      this.renderer,
      noteskinPath + '/Center Receptor 1x2.PNG'
    );

    //Taps
    stepDic['T'] = new PNGTexture(this.renderer, noteskinPath + '/Tap 5x2.PNG');

    // FX
    stepDic['FX'] = new PNGTexture(
      this.renderer,
      noteskinPath + '/StepFX 5x1.PNG'
    );

    this._textureDict['NOTESKINS'][noteskinId] = stepDic;
  }

  loadStageTextures(stagePath) {
    // Digits Normal
    this._textureDict['DN'] = new PNGTexture(
      this.renderer,
      stagePath + '/Combo numbers Normal 4x4_XX.png'
    );

    // Digits Miss
    this._textureDict['DM'] = new PNGTexture(
      this.renderer,
      stagePath + '/Combo numbers Miss 4x4.png'
    );

    // Combo
    this._textureDict['C'] = new PNGTexture(
      this.renderer,
      stagePath + '/Combo 1x2_XX_r.png'
    );

    // Judgment
    this._textureDict['J'] = new PNGTexture(
      this.renderer,
      stagePath + '/Player_Judgment Rank 1x6_XX_r.png'
    );

    // Life meter bar
    this._textureDict['SLBACK'] = new PNGTexture(
      this.renderer,
      stagePath + '/LifeMeterBar_S_Back 1x2.png'
    );
    this._textureDict['SLBAR'] = new PNGTexture(
      this.renderer,
      stagePath + '/LifeMeterBar_S_Bar 1x2.png'
    );
    this._textureDict['SLBARFX'] = new PNGTexture(
      this.renderer,
      stagePath + '/LifeMeterBar_S_Bar_FX.png'
    );
    this._textureDict['SLBARFXRED'] = new PNGTexture(
      this.renderer,
      stagePath + '/LifeMeterBar_S_Bar_FX_Red.png'
    );
    this._textureDict['SLFRONT'] = new PNGTexture(
      this.renderer,
      stagePath + '/LifeMeterBar_S_Front.png'
    );

    this._textureDict['DLBACK'] = new PNGTexture(
      this.renderer,
      stagePath + '/LifeMeterBar_D_Back 1x2.png'
    );
    this._textureDict['DLBAR'] = new PNGTexture(
      this.renderer,
      stagePath + '/LifeMeterBar_D_Bar 1x2.png'
    );
    this._textureDict['DLBARFX'] = new PNGTexture(
      this.renderer,
      stagePath + '/LifeMeterBar_D_Bar_FX.png'
    );
    this._textureDict['DLBARFXRED'] = new PNGTexture(
      this.renderer,
      stagePath + '/LifeMeterBar_D_Bar_FX_Red.png'
    );
    this._textureDict['DLFRONT'] = new PNGTexture(
      this.renderer,
      stagePath + '/LifeMeterBar_D_Front.png'
    );

    this._textureDict['LP'] = new PNGTexture(
      this.renderer,
      stagePath + '/pulse.png'
    );
    this._textureDict['LT'] = new PNGTexture(
      this.renderer,
      stagePath + '/SG-TIP 1x2.png'
    );
  }

  loadMaterials() {
    for (const [noteskinId, textureDict] of Object.entries(
      this._textureDict['NOTESKINS']
    )) {
      let materialsDict = {};

      // StepNotes
      materialsDict['SDL'] = new TransparentMaterial(textureDict['SDL'].map);
      materialsDict['SUL'] = new TransparentMaterial(textureDict['SUL'].map);
      materialsDict['SC'] = new TransparentMaterial(textureDict['SC'].map);
      materialsDict['SUR'] = new TransparentMaterial(textureDict['SUR'].map);
      materialsDict['SDR'] = new TransparentMaterial(textureDict['SDR'].map);

      //Holds & EndNotes
      materialsDict['HDL'] = new TransparentMaterial(textureDict['HDL'].map);
      materialsDict['HUL'] = new TransparentMaterial(textureDict['HUL'].map);
      materialsDict['HC'] = new TransparentMaterial(textureDict['HC'].map);
      materialsDict['HUR'] = new TransparentMaterial(textureDict['HUR'].map);
      materialsDict['HDR'] = new TransparentMaterial(textureDict['HDR'].map);

      this._materialsDict['NOTESKINS'][noteskinId] = materialsDict;
    }
  }

  loadShaderMaterials() {
    // Background
    this._shadersDict['B'] = new BackgroundMaterial(this.resourcePath);
  }

  constructStepNote(kind, noteskinId) {
    const materialsDict = this._materialsDict['NOTESKINS'][noteskinId];
    switch (kind) {
      case 'dl':
        return new THREE.Mesh(
          this._geometryDict['S'].stepGeometry,
          materialsDict['SDL'].material
        );
      case 'ul':
        return new THREE.Mesh(
          this._geometryDict['S'].stepGeometry,
          materialsDict['SUL'].material
        );
      case 'c':
        return new THREE.Mesh(
          this._geometryDict['S'].stepGeometry,
          materialsDict['SC'].material
        );
      case 'ur':
        return new THREE.Mesh(
          this._geometryDict['S'].stepGeometry,
          materialsDict['SUR'].material
        );
      case 'dr':
        return new THREE.Mesh(
          this._geometryDict['S'].stepGeometry,
          materialsDict['SDR'].material
        );
    }
  }

  constructStepNoteCloned(kind, noteskinId) {
    const textureDict = this._textureDict['NOTESKINS'][noteskinId];
    switch (kind) {
      case 'dl':
        return new THREE.Mesh(
          this._geometryDict['S'].stepGeometry,
          new TransparentMaterial(textureDict['SDL'].cloneMap()).material
        );
      case 'ul':
        return new THREE.Mesh(
          this._geometryDict['S'].stepGeometry,
          new TransparentMaterial(textureDict['SUL'].cloneMap()).material
        );
      case 'c':
        return new THREE.Mesh(
          this._geometryDict['S'].stepGeometry,
          new TransparentMaterial(textureDict['SC'].cloneMap()).material
        );
      case 'ur':
        return new THREE.Mesh(
          this._geometryDict['S'].stepGeometry,
          new TransparentMaterial(textureDict['SUR'].cloneMap()).material
        );
      case 'dr':
        return new THREE.Mesh(
          this._geometryDict['S'].stepGeometry,
          new TransparentMaterial(textureDict['SDR'].cloneMap()).material
        );
    }
  }

  constructSLifeBarBack() {
    return new THREE.Mesh(
      this._geometryDict['L'].lifeBarGeometry,
      new TransparentMaterial(this._textureDict['SLBACK'].cloneMap()).material
    );
  }

  constructSLifeBarBar() {
    return new THREE.Mesh(
      this._geometryDict['L'].lifeBarGeometry,
      new TransparentMaterial(this._textureDict['SLBAR'].cloneMap()).material
    );
  }

  constructSLifeBarBarFX() {
    return new THREE.Mesh(
      this._geometryDict['L'].lifeBarGeometry,
      new AdditiveMaterial(this._textureDict['SLBARFX'].cloneMap()).material
    );
  }

  constructSLifeBarBarFXRed() {
    return new THREE.Mesh(
      this._geometryDict['L'].lifeBarGeometry,
      new AdditiveMaterial(this._textureDict['SLBARFXRED'].cloneMap()).material
    );
  }
  constructSLifeBarFront() {
    return new THREE.Mesh(
      this._geometryDict['L'].lifeBarGeometry,
      new TransparentMaterial(this._textureDict['SLFRONT'].cloneMap()).material
    );
  }

  constructDLifeBarBack() {
    return new THREE.Mesh(
      this._geometryDict['DL'].lifeBarGeometry,
      new TransparentMaterial(this._textureDict['DLBACK'].cloneMap()).material
    );
  }

  constructDLifeBarBar() {
    return new THREE.Mesh(
      this._geometryDict['DL'].lifeBarGeometry,
      new TransparentMaterial(this._textureDict['DLBAR'].cloneMap()).material
    );
  }

  constructDLifeBarBarFX() {
    return new THREE.Mesh(
      this._geometryDict['DL'].lifeBarGeometry,
      new AdditiveMaterial(this._textureDict['DLBARFX'].cloneMap()).material
    );
  }

  constructDLifeBarBarFXRed() {
    return new THREE.Mesh(
      this._geometryDict['DL'].lifeBarGeometry,
      new AdditiveMaterial(this._textureDict['DLBARFXRED'].cloneMap()).material
    );
  }
  constructDLifeBarFront() {
    return new THREE.Mesh(
      this._geometryDict['DL'].lifeBarGeometry,
      new TransparentMaterial(this._textureDict['DLFRONT'].cloneMap()).material
    );
  }

  constructLifeBarTip() {
    return new THREE.Mesh(
      this._geometryDict['T'].tipGeometry,
      new TransparentMaterial(this._textureDict['LT'].cloneMap()).material
    );
  }

  constructLifeBarPulse() {
    return new THREE.Mesh(
      this._geometryDict['P'].pulseGeometry,
      new TransparentMaterial(this._textureDict['LP'].cloneMap()).material
    );
  }

  constructBackground() {
    return new THREE.Mesh(
      this._geometryDict['B'].backgroundGeometry,
      this._shadersDict['B'].material
    );
  }

  constructGenericTap(noteskinId) {
    let tex = this._textureDict['NOTESKINS'][noteskinId]['T'].cloneMap();
    return new THREE.Mesh(
      this._geometryDict['S'].stepGeometry,
      new TransparentMaterial(tex).material
    );
  }

  constructGenericWhiteTap(noteskinId) {
    let tex = this._textureDict['NOTESKINS'][noteskinId]['T'].cloneMap();
    return new THREE.Mesh(
      this._geometryDict['S'].stepGeometry,
      new AdditiveMaterial(tex).material
    );
  }

  constructStepBounce(kind, noteskinId) {
    const textureDict = this._textureDict['NOTESKINS'][noteskinId];
    switch (kind) {
      case 'dl':
        return new THREE.Mesh(
          this._geometryDict['S'].stepGeometry,
          new AdditiveMaterial(textureDict['SDL'].cloneMap()).material
        );
      case 'ul':
        return new THREE.Mesh(
          this._geometryDict['S'].stepGeometry,
          new AdditiveMaterial(textureDict['SUL'].cloneMap()).material
        );
      case 'c':
        return new THREE.Mesh(
          this._geometryDict['S'].stepGeometry,
          new AdditiveMaterial(textureDict['SC'].cloneMap()).material
        );
      case 'ur':
        return new THREE.Mesh(
          this._geometryDict['S'].stepGeometry,
          new AdditiveMaterial(textureDict['SUR'].cloneMap()).material
        );
      case 'dr':
        return new THREE.Mesh(
          this._geometryDict['S'].stepGeometry,
          new AdditiveMaterial(textureDict['SDR'].cloneMap()).material
        );
    }
  }

  constructHoldExtensible(kind, noteskinId) {
    const materialsDict = this._materialsDict['NOTESKINS'][noteskinId];
    switch (kind) {
      case 'dl':
        return new THREE.Mesh(
          this._geometryDict['H'].holdGeometry,
          materialsDict['HDL'].material
        );
      case 'ul':
        return new THREE.Mesh(
          this._geometryDict['H'].holdGeometry,
          materialsDict['HUL'].material
        );
      case 'c':
        return new THREE.Mesh(
          this._geometryDict['H'].holdGeometry,
          materialsDict['HC'].material
        );
      case 'ur':
        return new THREE.Mesh(
          this._geometryDict['H'].holdGeometry,
          materialsDict['HUR'].material
        );
      case 'dr':
        return new THREE.Mesh(
          this._geometryDict['H'].holdGeometry,
          materialsDict['HDR'].material
        );
    }
  }

  constructJudgmentBanner() {
    let tex = this._textureDict['J'].cloneMap();
    return new THREE.Mesh(
      this._geometryDict['J'].judgmentGeometry,
      new TransparentMaterial(tex).material
    );
  }

  constructCombo() {
    return new THREE.Mesh(
      this._geometryDict['C'].comboGeometry,
      new TransparentMaterial(this._textureDict['C'].cloneMap()).material
    );
  }

  constructDigit() {
    return new THREE.Mesh(
      this._geometryDict['D'].digitGeometry,
      new TransparentMaterial(this._textureDict['DN'].cloneMap()).material
    );
  }

  constructReceptor(noteskinId) {
    let texture = this._textureDict['NOTESKINS'][noteskinId]['R'].cloneMap();
    return new THREE.Mesh(
      this._geometryDict['R'].receptorGeometry,
      new ReceptorMaterial(texture, this.resourcePath).material
    );
  }

  constructExplosion(noteskinId) {
    return new THREE.Mesh(
      this._geometryDict['S'].stepGeometry,
      new AdditiveMaterial(
        this._textureDict['NOTESKINS'][noteskinId]['FX'].cloneMap()
      ).material
    );
  }

  getStepNoteTexture(kind, noteskinId) {
    let texture;
    const textureDict = this._textureDict['NOTESKINS'][noteskinId];

    switch (kind) {
      case 'dl':
        texture = textureDict['SDL'].map;
        break;
      case 'ul':
        texture = textureDict['SUL'].map;
        break;
      case 'c':
        texture = textureDict['SC'].map;
        break;
      case 'ur':
        texture = textureDict['SUR'].map;
        break;
      case 'dr':
        texture = textureDict['SDR'].map;
        break;
    }

    return texture;
  }

  getHoldExtensibleTexture(kind, noteskinId) {
    let texture;
    const textureDict = this._textureDict['NOTESKINS'][noteskinId];
    switch (kind) {
      case 'dl':
        texture = textureDict['HDL'].map;
        break;
      case 'ul':
        texture = textureDict['HUL'].map;
        break;
      case 'c':
        texture = textureDict['HC'].map;
        break;
      case 'ur':
        texture = textureDict['HUR'].map;
        break;
      case 'dr':
        texture = textureDict['HDR'].map;
        break;
    }
    return texture;
  }
}

export { ResourceManager };
