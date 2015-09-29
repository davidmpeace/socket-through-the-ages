"use strict";
class Developments
{
    constructor(game, player)
    {
        this.game   = game;
        this.player = player;
        this.reset();
    }

    reset()
    {
        this.developments = [];

        this.developments.push( this.newDevelopment('Leadership',   'Reroll 1 die (after last roll)', 10, 2) );
        this.developments.push( this.newDevelopment('Irrigation',   'Drought has no effect',          10, 2) );
        this.developments.push( this.newDevelopment('Agriculture',  '+1 food / food die',             15, 3) );
        this.developments.push( this.newDevelopment('Quarrying',    '+1 stone if collecting stone',   15, 3) );
        this.developments.push( this.newDevelopment('Medicine',     'Pestilence has no effect',       15, 3) );
        this.developments.push( this.newDevelopment('Coinage',      'Coin die results are worth 12',  20, 4) );
        this.developments.push( this.newDevelopment('Caravans',     'No need to discard goods',       20, 4) );
        this.developments.push( this.newDevelopment('Religion',     'Revolt affects opponents',       20, 6) );
        this.developments.push( this.newDevelopment('Granaries',    'Sell food for 4 coins each',     30, 6) );
        this.developments.push( this.newDevelopment('Masonry',      '+1 worker / worker die',         30, 6) );
        this.developments.push( this.newDevelopment('Engineering',  'Use stone for 3 workers each',   40, 6) );
        this.developments.push( this.newDevelopment('Architecture', 'Bonus pts: 1 / monument',        50, 8) );
        this.developments.push( this.newDevelopment('Empire',       'Bonus pts: 1 / city',            60, 8) );
    }

    newDevelopment(name, effect, cost, points)
    {
        var newDevelopment = {
            "name": name,
            "effect": effect,
            "cost": cost,
            "points": points,
            "purchased": false
        }
        return newDevelopment;
    }

    purchase(developmentName)
    {
        for( var i in this.developments ) {
            var development = this.developments[i];
            if( development.name == developmentName && !development.purchased ) {
                development.purchased = true;
                return true;
            }
        }
        return false;
    }

    has(developmentName)
    {
        for( var i in this.developments ) {
            var development = this.developments[i];
            if( development.name == developmentName ) {
                return development.purchased;
            }
        }
        return false;
    }

    totalPurchased()
    {
        var totalPurchased = 0;
        for( var i in this.developments ) {
            var development = this.developments[i];
            if( development.purchased ) {
                totalPurchased++;
            }
        }
        return totalPurchased;
    }

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

    debug()
    {
        var debug = "Developments:\n";
        for( var c in this.developments ) {
            var development = this.developments[c];
            debug += development.cost + " ";
            if( development.purchased ) {
                debug += "[X] ";
            } else { 
                debug += "[ ] ";
            }
            debug += development.name + " (" + development.points + " pts) " + development.effect;
            debug += "\n";
        }
        console.log(debug);
    }
}
