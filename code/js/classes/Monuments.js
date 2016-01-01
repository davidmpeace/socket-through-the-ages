"use strict";

class Monuments
{
    /**
     * The Monuments Class is a collection of Monument objects for a player in a game.
     */
    constructor(player)
    {
        this.player = player;
        this.game   = player.game;
        this.reset();
    }

    /**
     * Reset the Monuments collection back to it's default state of monuments.
     */
    reset()
    {
        this.monuments = [];

        //                                      Name               Spaces, Points 1st, Points Other
        this.monuments.push( new Monument(this, "Step Pyramid",    3,      1,          0) );
        this.monuments.push( new Monument(this, "Stone Circle",    5,      2,          1) );
        this.monuments.push( new Monument(this, "Temple",          7,      4,          2) );
        this.monuments.push( new Monument(this, "Hanging Gardens", 11,     8,          4) );
        this.monuments.push( new Monument(this, "Great Pyramid",   15,     12,         6) );
        this.monuments.push( new Monument(this, "Great Wall",      13,     10,         5) );
        this.monuments.push( new Monument(this, "Obelisk",         9,      6,          3) );

        this.monument("Temple").invalidWhenPlayerCount          = 2;
        this.monument("Hanging Gardens").invalidWhenPlayerCount = 3;
        this.monument("Great Pyramid").invalidWhenPlayerCount   = 2;
        this.monument("Great Wall").effect                      = "(Invasion has no effect)";
    }

    /**
     * Return the monument with the matching name.
     */
    monument(monumentName)
    {
        for( var i in this.monuments ) {
            var monument = this.monuments[i];
            if( monument.name == monumentName ) {
                return monument;
            }
        }
    }

    /**
     * Add workers to a specific monument.
     */
    addWorkersTo(monumentName, numberOfWorkers)
    {
        this.monument(monumentName).addWorkers(numberOfWorkers);
    }

    /**
     * Convenience method to return if a monument is completed.
     */
    hasCompleted(monumentName)
    {
        return this.monument(monumentName).completed;
    }

    /**
     * Return an array of monuments that are not completed for this player, either empty or in progress.
     */
    getAllIncomplete()
    {
        var incomplete = [];
        for( var i in this.monuments ) {
            var monument = this.monuments[i];
            if( !monument.completed && monument.isValid() ) {
                incomplete.push(monument);
            }
        }
        return incomplete;
    }

    /**
     * Return an array of monuments that currently have workers on them, either in progress or completed.
     */
    getAllWithWorkers()
    {
        var monuments = [];
        for( var i in this.monuments ) {
            var monument = this.monuments[i];
            if( monument.filledSpaces > 0 && monument.isValid() ) {
                monuments.push(monument);
            }
        }
        return monuments;
    }

    /**
     * Return an array of monuments that are completed.
     */
    getAllCompleted()
    {
        var completed = [];
        for( var i in this.monuments ) {
            var monument = this.monuments[i];
            if( monument.completed && monument.isValid() ) {
                completed.push(monument);
            }
        }
        return completed;
    }

    /**
     * Return count of total completed monuments.
     */
    totalCompleted()
    {
        return this.getAllCompleted().length;
    }

    /**
     * Total points for all monuments.
     */
    totalPoints()
    {
        var points = 0;
        for( var i in this.monuments ) {
            var monument = this.monuments[i];
            points += monument.points;
        }
        return points;
    }

    /**
     * Debug out the monument information.
     */
    debug()
    {
        var debug = "Monuments:\n";
        for( var i in this.monuments ) {
            debug += this.monuments[i].debug();
        }
        console.log(debug);
    }
}
