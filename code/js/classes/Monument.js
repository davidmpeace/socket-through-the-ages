"use strict";

class Monument
{
    constructor(monuments, name, totalSpaces, pointsFirst, pointsNotFirst)
    {
        this.game                   = monuments.game;
        this.player                 = monuments.player;
        this.name                   = name;
        this.effect                 = null;
        this.totalSpaces            = totalSpaces;
        this.pointsFirst            = pointsFirst;
        this.pointsNotFirst         = pointsNotFirst;
        this.invalidWhenPlayerCount = null;
        this.reset();
    }

    /**
     * Reset the information for the Monument back to default.
     */
    reset()
    {
        this.filledSpaces           = 0;
        this.openSpaces             = this.totalSpaces;
        this.completed              = false;
        this.completedFirst         = false;
        this.points                 = 0;
    }

    /**
     * Returns true if the number of players in the game is valid for this monument.
     */
    isValid()
    {
        return (this.invalidWhenPlayerCount != this.game.players.length );
    }

    /**
     * Add workers to this monument
     */
    addWorkers(numberOfWorkers)
    {
        if( !this.player.isMyTurn() || !this.isValid() ) { throw "Cannot add workers to Monument." }

        if( numberOfWorkers > this.openSpaces ) {
            this.game.log("WARNING: Applying " + numberOfWorkers + " workers to " + this.name + ", when it only has " + this.openSpaces + " open spaces." );
        }

        this.filledSpaces = Math.min( this.totalSpaces, (this.filledSpaces + numberOfWorkers) );
        this.openSpaces   = Math.max(this.totalSpaces - this.filledSpaces, 0);
        this.completed    = (this.openSpaces == 0);
        
        if( this.completed ) {
            this.completedFirst = true;

            // Check to see if others completed the monument before this player.
            var otherPlayers = this.game.otherPlayers(this.player);
            for( var i in otherPlayers ) {
                 var otherPlayer = otherPlayers[i];

                if( otherPlayer.monuments.hasCompleted(monumentName) ) {
                    this.completedFirst = false;
                }
            }

            this.points = (this.completedFirst) ? this.pointsFirst : this.pointsNotFirst;
        } else {
            this.points = 0;
        }

        this.game.log( this.name + ": Added " + numberOfWorkers + " workers. ["+this.filledSpaces+"/"+this.totalSpaces+"]" );

        if( this.completed ) {
            if( this.completedFirst ) {
                this.game.log( this.name + ": Completed First for " + this.points + " pts." );
            } else {
                this.game.log( this.name + ": Not Completed First for " + this.points + " pts." );
            }
        }
    }

    /**
     * Debug
     */
    debug()
    {
        var debug = "";
        if( this.completed ) {
            debug += "[X] ";
        } else { 
            debug += "[ ] ";
        }
        debug += this.name + " " + this.filledSpaces + "/" + this.totalSpaces;
        debug += "\n";
        return debug;
    }
}