"use strict";

var FACE_3_FOOD              = "3_FOOD";
var FACE_3_WORKERS           = "3_WORKERS";
var FACE_2_FOOD_OR_2_WORKERS = "2_FOOD_OR_2_WORKERS";
var FACE_2_FOOD              = "2_FOOD";
var FACE_2_WORKERS           = "2_WORKERS";
var FACE_1_GOOD              = "1_GOOD";
var FACE_1_SKULL_AND_2_GOODS = "1_SKULL_AND_2_GOODS";
var FACE_COINS               = "COINS";

class Die
{
    constructor(dice)
    {
        this.dice   = dice;
        this.game   = dice.game;
        this.player = dice.player;
        
        this.faces = [
            FACE_3_FOOD,
            FACE_3_WORKERS,
            FACE_1_GOOD,
            FACE_2_FOOD_OR_2_WORKERS,
            FACE_COINS,
            FACE_1_SKULL_AND_2_GOODS
        ];

        this.reset();
    }

    reset()
    {
        this.face     = null;
        this.keep     = false;
        this.isSkull  = false;
        this.variable = false;
    }

    /**
     * Roll this die
     */
    roll()
    {
        var rolledIndex = Math.floor(Math.random() * this.faces.length);
        this.face       = this.faces[rolledIndex];
        this.isSkull    = false;
        this.variable   = false;

        if( this.face == FACE_1_SKULL_AND_2_GOODS ) {
            this.isSkull  = true;
        } else if( this.face == FACE_2_FOOD_OR_2_WORKERS ) {
            this.variable = true;
        }
    }

    /**
     * Toggle whether this die should be kept
     */
    toggleKeep()
    {
        if( !this.face || this.isSkull ) { return false; }

        this.keep = !this.keep;
    }

    /**
     * Toggle the type for a variable die.
     */
    toggleType()
    {
        if( !this.face || !this.variable ) { return false; }

        if( this.face == FACE_2_FOOD_OR_2_WORKERS ) {
            this.face = FACE_2_FOOD;
        } else if( this.face == FACE_2_FOOD ) {
            this.face = FACE_2_WORKERS;
        } else if( this.face == FACE_2_WORKERS ) {
            this.face = FACE_2_FOOD_OR_2_WORKERS;
        }
    }

    /**
     * Total food
     */
    food( food )
    {
        food = (typeof food == 'undefined') ? 0 : food;

        if( this.face == FACE_3_FOOD ) {
            food = 3;
        } else if( this.face == FACE_2_FOOD ) {
            food = 2;
        }

        if( food > 0 && this.player.developments.has("Agriculture") ) {
            food++;
        }

        return food;
    }

    /**
     * Total optional food
     */
    optionalFood()
    {
        if( this.face == FACE_2_FOOD_OR_2_WORKERS ) {
            return this.food(2);
        }
        return 0;
    }

    /**
     * Total workers
     */
    workers( workers )
    {
        workers = (typeof workers == 'undefined') ? 0 : workers;

        if( this.face == FACE_3_WORKERS ) {
            workers = 3;
        } else if( this.face == FACE_2_WORKERS ) {
            workers = 2;
        }

        if( workers > 0 && this.player.developments.has("Masonry") ) {
            workers++;
        }

        return workers;
    }

    /**
     * Total optional workers
     */
    optionalWorkers()
    {
        if( this.face == FACE_2_FOOD_OR_2_WORKERS ) {
            return this.workers(2);
        }
        return 0;
    }

    /**
     * Total goods
     */
    goods()
    {
        var goods = 0;
        if( this.face == FACE_1_GOOD ) {
            goods = 1;
        } else if( this.face == FACE_1_SKULL_AND_2_GOODS ) {
            goods = 2;
        }
        return goods;
    }

    /**
     * Total coins
     */
    coins()
    {
        var coins = 0;
        if( this.face == FACE_COINS ) {
            coins = (this.player.developments.has("Coinage")) ? 12 : 7;
        }
        return coins;   
    }

}