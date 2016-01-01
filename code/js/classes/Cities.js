"use strict";
class Cities
{
    constructor(player)
    {
        this.player = player;
        this.game   = player.game;
        this.reset();
    }

    /**
     * Reset the Cities collection back to it's default state of cities.
     */
    reset()
    {
        this.cities = [];

        //                               Spaces
        this.cities.push( new City(this, 0) );
        this.cities.push( new City(this, 0) );
        this.cities.push( new City(this, 0) );
        this.cities.push( new City(this, 3) );
        this.cities.push( new City(this, 4) );
        this.cities.push( new City(this, 5) );
        this.cities.push( new City(this, 6) );
    }

    /**
     * Incrementally add workers to cities
     */
    addWorkers(workers) 
    {
        for( var i = 0; i < workers; i++ ) {
            for( var j in this.cities ) {
                var city = this.cities[j];
                if( !city.completed ) {
                    city.addWorker();
                    break;
                }
            }
        }
    }

    /**
     * Total number of completed cities
     */
    totalCompleted()
    {
        var totalCompleted = 0;
        for( var i in this.cities ) {
            var city = this.cities[i];
            if( city.completed ) {
                totalCompleted++;
            }
        }
        return totalCompleted;
    }

    /**
     * A total number of open remaining spaces in cities
     */
    remainingSpaces()
    {
        var remaining = 0;
        for( var i in this.cities ) {
            var city = this.cities[i];
            remaining += (city.totalSpaces - city.filledSpaces);
        }
        return remaining;
    }

    /**
     * Returns true if all cities are full
     */
    full()
    {
        return (this.totalCompleted() == this.cities.length);
    }

    /**
     * Get the next city object
     */
    nextCity()
    {
        return this.cities[this.totalCompleted()];
    }

    /**
     * Debug
     */
    debug()
    {
        var debug = "Cities:\n";
        for( var c in this.cities ) {
            var city = this.cities[c];
            debug += "City " + parseInt(parseInt(c)+1) + ") ";
            debug += city.debug();
        }
        console.log(debug);
    }
}
