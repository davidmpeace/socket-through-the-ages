"use strict";

class Development
{
    constructor(developments, name, effect, cost, points)
    {
        this.game   = developments.game;
        this.player = developments.player;
        this.name   = name;
        this.effect = effect;
        this.cost   = cost;
        this.points = points;
        this.reset();
    }

    /**
     * Reset the information for the Development back to default.
     */
    reset()
    {
        this.purchased = false;
    }

    /**
     * Returns true if the player is able to purchase this development.
     */
    isPurchaseable()
    {
        var availableCoins = this.player.totalAvailableCoins();
        return (!this.purchased && availableCoins >= this.cost && this.player.isInOneOfStages([TURN_STAGE_PURCHASE]));
    }

    /**
     * Purchase the development, and take the funds from the player.
     */
    purchase()
    {
        if( this.purchased ) {
            throw "Cannot purchase Development if it's already been purchased.";
        } else {
            var availableCoins = this.player.totalAvailableCoins();

            if( availableCoins < this.cost ) {
                throw "You can't afford this Development.";
            } else if( !this.player.isInOneOfStages([TURN_STAGE_PURCHASE]) ) {
                throw "Player Stage Consistency Error.  You aren't allowed to purchase right now.";
            } else {
                this.player.useAvailableCoins();
                this.purchased = true;
                this.game.log(this.name + ": Purchased");
            }
        }
    }

    /**
     * Calculate how many bonus points this development provides.
     */
    bonusPoints()
    {
        var bonusPoints = 0;
        if( this.purchased ) {
            if( this.name == 'Architecture' ) {
                bonusPoints = this.player.monuments.totalCompleted();
            } else if( this.name == "Empire" ) {
                bonusPoints = this.player.cities.totalCompleted();
            }
        }
        
        return bonusPoints;
    }

    /**
     * Debug
     */
    debug()
    {
        var debug = this.cost + " ";
        if( this.purchased ) {
            debug += "[X] ";
        } else { 
            debug += "[ ] ";
        }
        debug += this.name + " (" + this.points + " pts) " + this.effect;
        debug += "\n";
        return debug;
    }
}