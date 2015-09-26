"use strict";

var DICE_3_FOOD              = "3_FOOD";
var DICE_3_WORKERS           = "3_WORKERS";
var DICE_2_FOOD_OR_2_WORKERS = "2_FOOD_OR_2_WORKERS";
var DICE_2_FOOD              = "2_FOOD";
var DICE_2_WORKERS           = "2_WORKERS";
var DICE_1_GOOD              = "1_GOOD";
var DICE_1_SKULL_AND_2_GOODS = "1_SKULL_AND_2_GOODS";
var DICE_COINS               = "COINS";

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
    constructor(game, player)
    {
        this.game           = game;
        this.player         = player;
        this.totalDie       = this.player.cities.totalCompleted();
        this.dice = [];
        for( var i = 0; i < this.totalDie; i++ ) {
            this.dice.push( null );
        }

        this.rollsCompleted = 0;
        this.diceSides      = [
            DICE_3_FOOD,
            DICE_3_WORKERS,
            DICE_1_GOOD,
            DICE_2_FOOD_OR_2_WORKERS,
            DICE_COINS,
            DICE_1_SKULL_AND_2_GOODS
        ];

        this.diceToKeep = [];
    }

    leadershipRoll()
    {
        return (this.rollsCompleted == MAX_ROLLS && this.player.developments.has("Leadership"));
    }

    roll( diceIndices )
    {
        var rollAll            = (typeof diceIndices == "undefined");
        var lastLeadershipRoll = this.leadershipRoll() && (diceIndices.length == 1);

        if( this.rollsCompleted < MAX_ROLLS || lastLeadershipRoll ) {
            var rolledIndex;
            for( var i = 0; i < this.totalDie; i++ ) {

                if( rollAll || (diceIndices.indexOf(i) > -1) ) {

                    // Double check that we aren't re-rolling a scull, unless it's a last leadership roll
                    if( lastLeadershipRoll || this.dice[i] != DICE_1_SKULL_AND_2_GOODS ) {
                        rolledIndex = Math.floor(Math.random() * 6);
                        this.dice[i] = this.diceSides[rolledIndex];
                    }
                }
            }
            
            this.rollsCompleted++;
        }
        console.log(this.dice);
        this.debug();
    }

    hasOptionalDice()
    {
        return (this.totalOptionalFood() > 0 || this.totalOptionalWorkers() > 0);
    }

    total(type, dieFace)
    {
        var total = 0;
        for( var i in this.dice ) {
            var die = this.dice[i];

            var chosenSide = false;
            if( (dieFace == DICE_3_FOOD && die == DICE_2_FOOD) || (dieFace == DICE_3_WORKERS && die == DICE_2_WORKERS) ) {
                chosenSide = true;
            }

            if( typeof dieFace == "undefined" || die == dieFace || chosenSide ) {
                if( type == 'FOOD' ) {
                    if( die == DICE_3_FOOD || die == DICE_2_FOOD_OR_2_WORKERS || die == DICE_2_FOOD ) {
                        total += (die == DICE_3_FOOD) ? 3 : 2;

                        if( this.player.developments.has("Agriculture") ) {
                            total += 1;
                        }
                    }
                } else if( type == 'WORKERS' ) {
                    if( die == DICE_3_WORKERS || die == DICE_2_FOOD_OR_2_WORKERS || die == DICE_2_WORKERS ) {
                        total += (die == DICE_3_WORKERS) ? 3 : 2;

                        if( this.player.developments.has("Masonry") ) {
                            total += 1;
                        }
                    }
                } else if( type == 'GOODS') {
                    if( die == DICE_1_GOOD || die == DICE_1_SKULL_AND_2_GOODS ) {
                        if( this.total("SKULLS") >= 5 && !this.player.developments.has("Religion") ) {
                            total = 0;
                        } else {
                            total += (die == DICE_1_SKULL_AND_2_GOODS) ? 2 : 1;
                        }
                    }
                } else if( type == 'COINS') {
                    if( die == DICE_COINS ) {
                        total += 7;

                        if( this.player.developments.has("Coinage") ) {
                            total += 5;
                        }
                    }
                } else if( type == 'SKULLS') {
                    if( die == DICE_1_SKULL_AND_2_GOODS ) {
                        total += 1;
                    }
                }
            }
        }
        return total;
    }

    totalFixedFood()
    {
        return this.total('FOOD', DICE_3_FOOD);
    }

    totalOptionalFood()
    {
        return this.total('FOOD', DICE_2_FOOD_OR_2_WORKERS);
    }

    totalFixedWorkers()
    {
        return this.total('WORKERS', DICE_3_WORKERS);
    }

    totalOptionalWorkers()
    {
        return this.total('WORKERS', DICE_2_FOOD_OR_2_WORKERS);
    }

    totalGoods()
    {
        return this.total('GOODS');
    }

    totalCoins()
    {
        return this.total('COINS');
    }

    totalSkulls()
    {
        return this.total('SKULLS');
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
        console.log("FOOD: "+this.totalFixedFood());
        console.log("OPTIONAL FOOD: "+this.totalOptionalFood());
        console.log("FIXED WORKERS: "+this.totalFixedWorkers());
        console.log("OPTIONAL WORKERS: "+this.totalOptionalWorkers());
        console.log("GOODS: "+this.totalGoods());
        console.log("COINS: "+this.totalCoins());
        console.log("SKULLS: "+this.totalSkulls());
    }
}
