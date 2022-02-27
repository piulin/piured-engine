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



class TouchTile extends GameObject {


    _kind ;
    _mesh ;
    _active ;
    _padding ;

    _animationDelta ;
    _spritePosition ;
    _stepAnimationRate ;

    constructor(resourceManager, kind, noteskin) {
        super(resourceManager);
        this._kind = kind ;
        this._mesh = this._resourceManager.constructStepNoteCloned( this._kind, noteskin )
        this._active = false ;
    }


    ready() {

        this._stepAnimationRate = 60 ;
        this._padding = 3.0 ;
        this._spritePosition = 0 ;
        this._animationDelta = 0 ;

        this._mesh.material.map.repeat.set(1/3,1/2);

        let scale = 1.0 ;

        this._mesh.material.color.r = scale ;
        this._mesh.material.color.g = scale ;
        this._mesh.material.color.b = scale ;

        this._mesh.material.opacity = 0.3;

    }


    getScreenPositionInPixels() {

        // this._mesh.updateMatrix() ;
        // this._mesh.updateWorldMatrix() ;
        // Get 3D positions of top left corner (assuming they're not rotated)

        let worldPosition = new THREE.Vector3() ;
        let worldScale = new THREE.Vector3() ;


        this._mesh.getWorldPosition(worldPosition) ;
        this._mesh.getWorldScale(worldScale) ;
        let topLeft = new THREE.Vector3(
            worldPosition.x - (worldScale.x / 2.0),
            worldPosition.y + (worldScale.y / 2.0),
            worldPosition.z
        );

        let downRight = new THREE.Vector3(
            worldPosition.x + (worldScale.x / 2.0),
            worldPosition.y - (worldScale.y / 2.0),
            worldPosition.z
        );

        // engine.camera.updateMatrixWorld();
        topLeft.project(engine.camera);
        downRight.project(engine.camera);

        const topLeftX = (1 + topLeft.x) / 2 * window.innerWidth;
        const topLeftY = (1 - topLeft.y) / 2 * window.innerHeight;

        const downRightX = (1 + downRight.x) / 2 * window.innerWidth;
        const downRightY = (1 - downRight.y) / 2 * window.innerHeight;

        return [topLeftX, topLeftY, downRightX, downRightY] ;

    }

    get padding() {
        let worldScale = new THREE.Vector3() ;
        this._mesh.getWorldScale(worldScale) ;
        return this._padding * worldScale.x ;
    }

    isTouched(x,y) {
        let [topLeftX, topLeftY, downRightX, downRightY] = this.getScreenPositionInPixels() ;
        const padding  = this.padding ;
        if ( x >= topLeftX +padding && x < downRightX - padding && y >= topLeftY +padding && y < downRightY-padding ) {
            return true ;
        } else {
            return false ;
        }
    }

    touchDown(x,y) {
        const isTouched = this.isTouched(x,y) ;
        if (isTouched) {
            this._active = true ;
            this._mesh.material.opacity = 0.80;
            return this._kind ;
        } else {
            return 'none' ;
        }
    }

    touchUp(x,y) {
        const isTouched = this.isTouched(x,y) ;
        if (isTouched) {
            this._active = false ;
            this._mesh.material.opacity = 0.3;
            // this.resetAnimation() ;
            return this._kind ;
        } else {
            return 'none' ;
        }
    }

    resetAnimation() {
        this._spritePosition = 0 ;
        this._animationDelta = 0 ;
        this._mesh.material.map.repeat.set(1/3,1/2);
    }

    updateTextureAnimation(delta) {

        let timeStamp = this._animationDelta + delta;

        let movement = timeStamp*this._stepAnimationRate ;

        if ( movement > 1 ) {

            this._spritePosition = (this._spritePosition + 1)%6 ;

            const col = this._spritePosition % 3 ;

            const row = Math.floor( this._spritePosition / 3 ) ;

            const XOffset3x2 = col * (1/3) ;

            const YOffset3x2 = row * (1/2) ;
            this._mesh.material.map.offset.set(  XOffset3x2, YOffset3x2 ) ;
            this._animationDelta = 0 ;

        } else {

            this._animationDelta += delta ;

        }

    }

    update(delta) {
        if (this._active) {
            this.updateTextureAnimation(delta) ;
        }
    }

    get object () {
        return this._mesh ;
    }
}