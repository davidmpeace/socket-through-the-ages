"use strict";

var DISASTER_TYPE_NONE       = "None";
var DISASTER_TYPE_DROUGHT    = "Drought";
var DISASTER_TYPE_PESTILENCE = "Pestilence";
var DISASTER_TYPE_INVASION   = "Invasion";
var DISASTER_TYPE_REVOLT     = "Revolt";

var DISASTER_EFFECT_NONE                     = "No Effect";
var DISASTER_EFFECT_DROUGHT                  = "+2 Disasters";
var DISASTER_EFFECT_DROUGHT_WITH_IRRIGATION  = "Protected by Irrigation";
var DISASTER_EFFECT_PESTILENCE               = "Opponents +3 Disasters";
var DISASTER_EFFECT_INVASION                 = "+4 Disasters";
var DISASTER_EFFECT_INVASION_WITH_GREAT_WALL = "Protected by Great Wall";
var DISASTER_EFFECT_REVOLT                   = "Lose all Goods";
var DISASTER_EFFECT_REVOLT_WITH_RELIGION     = "Opponents Lose all Goods";

class Dice
{
    constructor(player, numberOfDie)
    {
        this.game           = player.game;
        this.player         = player;

        this.dice = [];
        for( var i = 0; i < numberOfDie; i++ ) {
            this.dice.push( new Die(this) );
        }

        this.rollsCompleted = 0;

        this.canRoll        = true;
        this.diceFinalized  = false; // Set to true when all rolling is done, and food\worker combos have been chosen.

        this.useableFood    = 0;
        this.useableWorkers = 0;
        this.useableGoods   = 0;
        this.useableCoins   = 0;

        this.resultingFamines = 0;
    }

    /**
     * Returns true if it's the last roll, and they have the Leadership development
     */
    canRollLeadershipDie()
    {
        return (this.rollsCompleted == MAX_ROLLS && this.player.developments.has("Leadership") && !this.diceFinalized);
    }

    /**
     * Rolls all unkept, and non-skull die
     */
    roll()
    {
        if( !this.diceFinalized && this.canRoll ) {
            
            for( var i in this.dice ) {
                var die = this.dice[i];
                if( !die.keep && !die.isSkull ) {
                    die.roll();
                }
            }
            
            this.rollsCompleted++;

            if( this.isAllSkulls() ) {
                this.rollsCompleted = MAX_ROLLS; // Set to max rolls if all are skulls, because there's nothing more to do
            }

            this.canRoll = (this.rollsCompleted < MAX_ROLLS);
        }
    }

    /**
     * Rolls 1 die for the leadership roll
     */
    rollLeadershipDie(dieIndex)
    {
        if( this.diceFinalized ) { return false; }

        this.dice[dieIndex].roll();
        this.rollsCompleted++;
    }

    /**
     * Returns true if there are any dice that do not have their value chosen yet
     */
    hasOptionalDice()
    {
        return (this.totalOptionalFood() > 0 || this.totalOptionalWorkers() > 0);
    }

    /**
     * Toggle the type for a variable dice (2 Food/2 Workers).
     */
    toggleType(dieIndex)
    {
        if( this.diceFinalized ) { return false; }
        this.dice[dieIndex].toggleType();
    }

    /**
     * Toggle whether a die should be kept or not
     */
    toggleKeep(dieIndex)
    {
        if( !this.canRoll || this.diceFinalized ) { return false; }
        this.dice[dieIndex].toggleKeep();
    }

    /**
     * Called when done rolling, and all variable dice have been chosen.
     */
    finalizeDice()
    {
        if( this.diceFinalized ) { return false; }

        if( this.hasOptionalDice() ) {
            alert("You must first choose how you want to use the variable dice for Food or Workers.");
            return false;
        }

        this.useableFood    = this.totalFood();
        this.useableWorkers = this.totalWorkers();
        this.useableGoods   = this.totalGoods();
        this.useableCoins   = this.totalCoins();

        this.diceFinalized = true;

        return true;
    }

    takeFood()
    {
        var total = this.useableFood;
        this.useableFood = 0;
        return total;
    }

    takeWorkers( workersToTake )
    {
        workersToTake = Math.max(0, workersToTake);
        workersToTake = Math.min(this.useableWorkers, workersToTake);
        this.useableWorkers -= workersToTake;
        return workersToTake;
    }

    takeGoods()
    {
        var total = this.useableGoods;
        this.useableGoods = 0;
        return total;
    }

    takeCoins()
    {
        var total = this.useableCoins;
        this.useableCoins = 0;
        return total;
    }
 
    totalFood()
    {
        var food = 0;
        for( var i in this.dice ) {
            food += this.dice[i].food();
        }
        return food;
    }

    totalOptionalFood()
    {
        var food = 0;
        for( var i in this.dice ) {
            food += this.dice[i].optionalFood();
        }
        return food;
    }

    totalWorkers()
    {
        var workers = 0;
        for( var i in this.dice ) {
            workers += this.dice[i].workers();
        }
        return workers;
    }

    totalOptionalWorkers()
    {
        var workers = 0;
        for( var i in this.dice ) {
            workers += this.dice[i].optionalWorkers();
        }
        return workers;
    }

    totalGoods()
    {
        var goods = 0;
        for( var i in this.dice ) {
            goods += this.dice[i].goods();
        }
        return goods;
    }

    totalCoins()
    {
        var coins = 0;
        for( var i in this.dice ) {
            coins += this.dice[i].coins();
        }
        return coins;
    }

    totalSkulls()
    {
        var skulls = 0;
        for( var i in this.dice ) {
            if( this.dice[i].isSkull ) {
                skulls++;
            }
        }
        return skulls;
    }

    isAllSkulls()
    {
        return (this.totalSkulls() == this.dice.length);
    }

    disasterType()
    {
        if( this.totalSkulls() == 2 ) {
            return DISASTER_TYPE_DROUGHT;
        } else if( this.totalSkulls() == 3 ) {
            return DISASTER_TYPE_PESTILENCE;
        } else if( this.totalSkulls() == 4 ) {
            return DISASTER_TYPE_INVASION;
        } else if( this.totalSkulls() >= 5 ) {
            return DISASTER_TYPE_REVOLT;
        }
        return DISASTER_TYPE_NONE;
    }

    disasterEffect()
    {
        var disasterType = this.disasterType();

        if( disasterType == DISASTER_TYPE_DROUGHT ) {
            return (this.player.developments.has("Irrigation")) ? DISASTER_EFFECT_DROUGHT_WITH_IRRIGATION : DISASTER_EFFECT_DROUGHT;
        } else if( disasterType == DISASTER_TYPE_PESTILENCE ) {
            return DISASTER_EFFECT_PESTILENCE;
        } else if( disasterType == DISASTER_TYPE_INVASION) {
            return (this.player.monuments.completed("Great Wall")) ? DISASTER_EFFECT_INVASION_WITH_GREAT_WALL : DISASTER_EFFECT_INVASION;
        } else if( disasterType == DISASTER_TYPE_REVOLT ) {
            return (this.player.developments.has("Religion")) ? DISASTER_EFFECT_REVOLT_WITH_RELIGION : DISASTER_EFFECT_REVOLT;
        }

        return DISASTER_EFFECT_NONE;
    }

    debug()
    {
        console.log(this.dice);
        console.log("FOOD: "+this.totalFood());
        console.log("OPTIONAL FOOD: "+this.totalOptionalFood());
        console.log("FIXED WORKERS: "+this.totalWorkers());
        console.log("OPTIONAL WORKERS: "+this.totalOptionalWorkers());
        console.log("GOODS: "+this.totalGoods());
        console.log("COINS: "+this.totalCoins());
        console.log("SKULLS: "+this.totalSkulls());
    }
}
