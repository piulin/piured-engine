"use strict" ;



class GameObject {

    _resourceManager ;

    constructor(resourceManager) {
        this._resourceManager = resourceManager ;
        engine.addToUpdateList(this) ;
    }

    ready() {

    }


    update(delta) {

    }


}