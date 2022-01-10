'use strict' ;


class Steps extends GameObject {

    _object ;
    receptorZDepth ;
    holdZDepth ;
    holdEndNoteZDepth ;
    stepNoteZDepth ;
    dlXPos ;
    ulXPos ;
    cXPos ;
    urXPos ;
    drXPos ;
    receptorsApart ;
    stepTextureAnimationRate ;
    lastEffectSpeed ;
    effectSpeed ;
    newTargetSpeed ;
    stepQueue ;
    beatManager ;
    _speedTween ;
    padSteps ;
    _song ;
    _level ;
    _userSpeed ;
    idLeftPad ;
    idRightPad ;
    keyListener ;

    constructor(resourceManager,
                stepQueue,
                beatManager,
                song,
                level,
                userSpeed,
                idLeftPad,
                idRightPad,
                keyListener) {
        super(resourceManager);

        engine.addToUpdateList(this) ;

        // Set up positions for steps
        this.configureStepConstantsPositions() ;

        // For managing changes of SPEED (by tweening)
        this.lastEffectSpeed = 1;
        this.effectSpeed = 1;
        this.newTargetSpeed = 1 ;

        //stepQueue to initialize (or use)
        this.stepQueue = stepQueue ;

        this.beatManager = beatManager ;
        this._song = song ;
        this._level = level ;
        this._userSpeed = userSpeed ;
        this.idLeftPad = idLeftPad ;
        this.idRightPad = idRightPad ;
        this.keyListener = keyListener ;

        //
        this._object = new THREE.Object3D() ;

        // to store leftmost and rightmost steps.
        this.padSteps = {} ;

        this.constructSteps() ;



    }

    constructSteps() {

        //leftside (5 left-most steps)
        let Lsteps ;
        let Rsteps = null ;

        // if level is single, then we construct only the 5 leftmost steps
        if ( this._song.getLevelStyle(this._level) === 'pump-single' || this._song.getLevelStyle(this._level) === 'pump-double'  ) {
            Lsteps = this.composePad(0, this.idLeftPad) ;
        } else if ( this._song.getLevelStyle(this._level) === 'pump-halfdouble' ) {
            Lsteps = this.composePad( -2, this.idLeftPad );
        }


        // only if the level is double or halfdouble, we also construct the 5 rightmost steps
        if ( this._song.getLevelStyle(this._level) !== 'pump-single' ) {

            // change position of leftmost steps
            Lsteps.position.x = -this.receptorsApart ;

            // build rightmost steps
            if ( this._song.getLevelStyle(this._level) === 'pump-double' ) {
                Rsteps = this.composePad(5, this.idRightPad);
            } else if ( this._song.getLevelStyle(this._level) === 'pump-halfdouble' ) {
                Rsteps = this.composePad(3, this.idRightPad);
            }

            // position rightmost steps
            Rsteps.position.x = this.receptorsApart ;

        }


        this.padSteps[this.idLeftPad] = Lsteps ;
        this._object.add(Lsteps) ;


        if ( Rsteps !== null ) {
            this._object.add(Rsteps) ;
            this.padSteps[this.idRightPad] = Rsteps ;
        }

        // clean empty step slots.
        this.stepQueue.cleanUpStepQueue() ;

    }



    configureStepConstantsPositions () {
        // Depth of stage elements
        this.receptorZDepth = -0.00003 ;
        this.holdZDepth = -0.00002 ;
        this.holdEndNoteZDepth = -0.00001 ;
        this.stepNoteZDepth = 0.00001;

        // define position of the notes w.r.t. the receptor

        // Space to the right or left of a given step.
        const stepShift = 4/5;
        // Note that the receptor steps are a bit overlapped. This measure takes into
        // acount this overlap.
        const stepOverlap = 0.02 ;
        this.dlXPos =  -2*(stepShift - stepOverlap) ;
        this.ulXPos =  -(stepShift - stepOverlap) ;
        this.cXPos =  0 ;
        this.urXPos =  (stepShift - stepOverlap) ;
        this.drXPos =  2*(stepShift - stepOverlap) ;

        this.receptorsApart = 1.96 ;
        this.stepTextureAnimationRate = 30 ;

    }

    composePad(stepDataOffset, padId) {


        // object containing all the steps of the given Pad.
        let steps = new THREE.Object3D();

        const noteData = this._song.levels[this._level];


        let listIndex = 0;
        // i loops the bars
        for (var i = 0; i < noteData.measures.length; i++) {

            const measure = noteData.measures[i];

            const notesInBar = measure.length;

            // j loops the notes inside the bar
            for (var j = 0; j < measure.length; j++) {

                listIndex += 1;
                const note = measure[j];

                const [currentYPosition, currentTimeInSong] = this.beatManager.getYShiftAndCurrentTimeInSongAtBeat(i, j, notesInBar);

                // Add only if the entry is not created already
                if (listIndex > this.stepQueue.getLength()) {
                    this.stepQueue.addNewEntryWithTimeStampInfo(currentTimeInSong);
                }

                // dl
                this.processNote(
                    note[0 + stepDataOffset],
                    'dl',
                    currentYPosition,
                    this.dlXPos,
                    steps,
                    currentTimeInSong,
                    listIndex - 1,
                    padId);


                //ul
                this.processNote(
                    note[1 + stepDataOffset],
                    'ul',
                    currentYPosition,
                    this.ulXPos,
                    steps,
                    currentTimeInSong,
                    listIndex - 1,
                    padId);

                // c
                this.processNote(
                    note[2 + stepDataOffset],
                    'c',
                    currentYPosition,
                    this.cXPos,
                    steps,
                    currentTimeInSong,
                    listIndex - 1,
                    padId);

                // ur
                this.processNote(
                    note[3 + stepDataOffset],
                    'ur',
                    currentYPosition,
                    this.urXPos,
                    steps,
                    currentTimeInSong,
                    listIndex - 1,
                    padId);

                // dr
                this.processNote(
                    note[4 + stepDataOffset],
                    'dr',
                    currentYPosition,
                    this.drXPos,
                    steps,
                    currentTimeInSong,
                    listIndex - 1,
                    padId);

            }

        }

        return steps ;
    }


    processNote(note, kind, currentYPosition, XStepPosition , steps, currentTimeInSong, index,  padId ) {


        // Process StepNote
        if ( note === '1' || note === '2' ) {

            // let step = this.stepFactory.getStep(kind);
            let step = new StepNote( this._resourceManager, kind, padId, currentTimeInSong ) ;

            let stepMesh = step.object ;

            stepMesh.position.y = currentYPosition ;
            stepMesh.originalYPos = currentYPosition ;
            stepMesh.position.x = XStepPosition ;
            stepMesh.position.z = this.stepNoteZDepth ;


            if (note === '2') {

                let stepHold = new StepHold(this._resourceManager, step, kind ) ;
                this.stepQueue.addStepToStepList(stepHold, index) ;
                this.stepQueue.setHold(kind, padId, stepHold) ;

            } else {

                this.stepQueue.addStepToStepList(step, index) ;
                steps.add(stepMesh) ;
                engine.addToUpdateList(step) ;

            }


        }

        // Process StepHold
        if ( note === '3' ) {

            let holdObject = this.stepQueue.getHold( kind , padId ) ;


            // let beginningHoldYPosition = step.beginningHoldYPosition ;
            let endNoteObject = new EndNote(this._resourceManager, kind, this.stepTextureAnimationRate) ;
            let endNoteMesh = endNoteObject.object ;
            engine.addToUpdateList( endNoteObject ) ;

            endNoteMesh.position.y = currentYPosition ;
            endNoteMesh.originalYPos = currentYPosition ;
            endNoteMesh.position.x = XStepPosition ;
            endNoteMesh.position.z = this.holdEndNoteZDepth ;

            let holdExtensibleObject = new HoldExtensible(this._resourceManager, kind ) ;
            holdExtensibleObject.object.position.x = XStepPosition ;
            holdExtensibleObject.object.originalYPos = -10000 ;
            holdExtensibleObject.object.position.z = this.holdZDepth ;
            engine.addToUpdateList( holdExtensibleObject ) ;

            // let holdObject = new StepHold(this._resourceManager, stepObject, holdExtensibleObject, endNoteObject, kind, currentTimeInSong) ;

            holdObject.endNote = endNoteObject ;
            holdObject.holdExtensible = holdExtensibleObject ;
            holdObject.endTimeStamp = currentTimeInSong ;

            engine.addToUpdateList( holdObject ) ;

            // steps.add(stepObject.object) ;
            steps.add(holdObject.object) ;

        }

    }

    updateCurrentSpeed() {
        const beat = this.beatManager.currentBeat ;
        // a type 0: means that the speed change is expressed in beats, otherwise in seconds
        const [speed, measure, type] = this._song.getSpeedAndTimeAtBeat(this._level, beat) ;
        if (this.newTargetSpeed  !== speed ) {

            this.newTargetSpeed = speed;
            let time = measure * 1000;
            if (type === 0) {
                time = (60 / this.beatManager.currentBPM) * measure * 1000;
            }
            // so it's not 0
            const eps = 1.0 ;
            this._speedTween = new TWEEN.Tween(this).to({effectSpeed: speed}, time + eps).start();
        }
    }

    animateSpeedChange() {

        if (this.lastEffectSpeed !== this.effectSpeed ) {

            let effectSpeed = this.effectSpeed ;


            // for ( let i = 0 ; i < this.speedItemsList.length ; i++ ) {
            //     let stepItem = this.speedItemsList[i] ;
            //     stepItem.position.y = stepItem.originalYPos ;
            //     // apply new speed
            //     stepItem.position.y *= effectSpeed ;
            // }

            // Update stepNotes only
            this._object.traverse(function(child) {

                // steps, holds, and endNotes are meshes
                if (child instanceof THREE.Mesh) {
                    child.position.y = child.originalYPos ;
                    // apply new speed
                    child.position.y *= effectSpeed ;


                }}) ;

            this.lastEffectSpeed = this.effectSpeed ;
        }
    }

    updateActiveHoldsPosition() {

        let listActiveHolds = this.stepQueue.activeHolds.asList() ;

        for ( var i = 0 ; i <  listActiveHolds.length ; i++) {

            let step = listActiveHolds[i] ;

            // check if hold is pressed.
            if ( this.keyListener.isHeld(step.kind, step.padId) ) {

                this.updateHoldPosition(step) ;

            }

        }

    }

    // This function shrinks the endNote so it does look proportioned
    updateHoldPosition(hold) {

        let distanceToOrigin = Math.abs (hold.stepNote.object.position.y) - this._object.position.y ;

        // update step note position
        hold.stepNote.object.position.y += distanceToOrigin ;


    }

    removeStep(step) {
        this.padSteps[step.padId].remove(step.object) ;
    }


    ready() {

    }

    update(delta) {
        //
        this._object.position.y = this.beatManager.currentYDisplacement * this._userSpeed * this.effectSpeed ;
        //
        this.updateCurrentSpeed() ;

        this.animateSpeedChange() ;

        this.updateActiveHoldsPosition() ;
    }

    get object() {
        return this._object ;
    }
}