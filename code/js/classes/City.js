"use strict";

class City
{
    constructor(cities, totalSpaces)
    {
        this.game        = cities.game;
        this.player      = cities.player;
        this.totalSpaces = totalSpaces;
        this.reset();
    }

    /**
     * Reset the information for the City back to default.
     */
    reset()
    {
        this.filledSpaces = 0;
        this.completed    = (this.totalSpaces == 0) ? true : false;
    }

    addWorker()
    {
        if( !this.completed ) {
            this.filledSpaces++;
            this.completed = (this.filledSpaces == this.totalSpaces);
        }
    }

    /**
     * Debug
     */
    debug()
    {
        debug = "";
        if( city.completed ) {
            debug += "[X] ";
        } else { 
            debug += "[ ] ";
        }
        debug += city.filledSpaces + "/" + city.totalSpaces
        debug += "\n";
        return debug;
    }
}