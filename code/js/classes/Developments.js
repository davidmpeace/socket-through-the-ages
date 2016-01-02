"use strict";
class Developments
{
    constructor(player)
    {
        this.player = player;
        this.game   = player.game;
        this.reset();
    }

    /**
     * Reset the Developments collection back to it's default state of developments.
     */
    reset()
    {
        this.developments = [];

        //                                            Name            Effect                            Cost  Points
        this.developments.push( new Development(this, 'Leadership',   'Reroll 1 die (after last roll)', 10,   2) );
        this.developments.push( new Development(this, 'Irrigation',   'Drought has no effect',          10,   2) );
        this.developments.push( new Development(this, 'Agriculture',  '+1 food / food die',             15,   3) );
        this.developments.push( new Development(this, 'Quarrying',    '+1 stone if collecting stone',   15,   3) );
        this.developments.push( new Development(this, 'Medicine',     'Pestilence has no effect',       15,   3) );
        this.developments.push( new Development(this, 'Coinage',      'Coin die results are worth 12',  20,   4) );
        this.developments.push( new Development(this, 'Caravans',     'No need to discard goods',       20,   4) );
        this.developments.push( new Development(this, 'Religion',     'Revolt affects opponents',       20,   6) );
        this.developments.push( new Development(this, 'Granaries',    'Sell food for 4 coins each',     30,   6) );
        this.developments.push( new Development(this, 'Masonry',      '+1 worker / worker die',         30,   6) );
        this.developments.push( new Development(this, 'Engineering',  'Use stone for 3 workers each',   40,   6) );
        this.developments.push( new Development(this, 'Architecture', 'Bonus pts: 1 / monument',        50,   8) );
        this.developments.push( new Development(this, 'Empire',       'Bonus pts: 1 / city',            60,   8) );
        //this.developments.push( new Development(this, 'Nourishment',  'Dont feed cities (1 turn)',      100,  10) );
    }

    /**
     * Return the development with the matching name.
     */
    development(developmentName)
    {
        for( var i in this.developments ) {
            var development = this.developments[i];
            if( development.name == developmentName ) {
                return development;
            }
        }
    }

    /**
     * Attempt to purchase the development.
     */
    purchase(developmentName)
    {
        return this.development(developmentName).purchase();
    }

    /**
     * Check if the player owns the development
     */
    has(developmentName)
    {
        return this.development(developmentName).purchased;
    }

    /**
     * Get all purchased developments
     */
    allPurchased()
    {
        var purchasedDevelopments = [];
        for( var i in this.developments ) {
            var development = this.developments[i];
            if( development.purchased ) {
                purchasedDevelopments.push(development);
            }
        }
        return purchasedDevelopments;
    }

    /**
     * Get list of all purchaseable developments
     */
    allPurchaseable()
    {
        var purchaseable = [];
        var totalAvailableCoins = this.player.totalAvailableCoins();
        for( var i in this.developments ) {
            var development = this.developments[i];
            if( development.isPurchaseable() ) {
                purchaseable.push(development);
            }
        }
        return purchaseable;
    }

    /**
     * Total number of purchased developments.
     */
    totalPurchased()
    {
        return this.allPurchased().length;
    }

    /**
     * Total bonus points for a development
     */
    bonusPointsFor(developmentName)
    {
        return this.development(developmentName).bonusPoints();
    }

    /**
     * Total points for all developments (excludes bonus points)
     */
    totalPoints()
    {
        var points = 0;
        for( var i in this.developments ) {
            var development = this.developments[i];
            if( development.purchased ) {
                points += development.points;
            }
        }
        return points;
    }

    /**
     * Total bonus points for all developments
     */
    totalBonusPoints()
    {
        var bonusPoints = 0;
        for( var i in this.developments ) {
            bonusPoints += this.developments[i].bonusPoints();
        }
        return bonusPoints;
    }

    /**
     * Debug
     */
    debug()
    {
        var debug = "Developments:\n";
        for( var c in this.developments ) {
            debug += this.developments[c].debug();
        }
        console.log(debug);
    }
}
