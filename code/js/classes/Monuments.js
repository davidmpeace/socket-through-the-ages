"use strict";
class Monuments
{
    constructor(game, player)
    {
        this.game   = game;
        this.player = player;
        this.reset();
    }

    reset()
    {
        this.monuments = [];

        this.monuments.push( this.newMonument("Step Pyramid", 3, 1, 0, null) );
        this.monuments.push( this.newMonument("Stone Circle", 5, 2, 1, null) );
        this.monuments.push( this.newMonument("Temple", 7, 4, 2, 2) );
        this.monuments.push( this.newMonument("Hanging Gardens", 11, 8, 4, 3) );
        this.monuments.push( this.newMonument("Great Pyramid", 15, 12, 6, 2) );
        this.monuments.push( this.newMonument("Great Wall", 13, 10, 5, null) );
        this.monuments.push( this.newMonument("Obelisk", 9, 6, 3, null) );
    }

    newMonument(name, spaces, pointsFirst, pointsNotFirst, excludeWhenPlayerCount)
    {
        var newMonument = {
            "name": name,
            "totalSpaces": spaces,
            "filledSpaces": 0,
            "pointsFirst": pointsFirst,
            "pointsNotFirst": pointsNotFirst,
            "excludeWhenPlayerCount": excludeWhenPlayerCount,
            "completed": false,
            "completedFirst": false
        }

        return newMonument;
    }

    monument(monumentName)
    {
        for( var i in this.monuments ) {
            var monument = this.monuments[i];
            if( monument.name == monumentName ) {
                return monument;
            }
        }
    }

    validPlayerCount(monumentName)
    {
        var monument = this.monument(monumentName);
        return (monument.excludeWhenPlayerCount != this.game.players.length);
    }

    addWorkersTo(monumentName, workers)
    {
        if( !this.validPlayerCount(monumentName) ) {
            return; // Invalid player count
        }

        var monument            = this.monument(monumentName);
        monument.filledSpaces   = Math.min( monument.totalSpaces, (monument.filledSpaces + workers) );
        monument.completed      = (monument.filledSpaces == monument.totalSpaces);
        
        if( monument.completed ) {
            monument.completedFirst = true;

            for( var p in this.game.players ) {
                var otherPlayer = this.game.players[p];
                if( otherPlayer.playerName != this.player.playerName ) {
                    if( otherPlayer.monuments.completed(monumentName) ) {
                        monument.completedFirst = false;
                        return;
                    }
                }
            }
        }
    }

    totalCompleted()
    {
        var totalCompleted = 0;
        for( var i in this.monuments ) {
            var monument = this.monuments[i];
            if( monument.completed ) {
                totalCompleted++;
            }
        }
        return totalCompleted;
    }

    completed(monumentName)
    {
        var monument = this.monument(monumentName);
        return monument.completed;
    }

    totalPoints()
    {
        var points = 0;
        for( var i in this.monuments ) {
            var monument = this.monuments[i];
            if( monument.completed ) {
                points += (monument.completedFirst) ? monument.pointsFirst : monument.pointsNotFirst;
            }
        }
        return points;
    }

    debug()
    {
        var debug = "Monuments:\n";
        for( var c in this.monuments ) {
            var monument = this.monuments[c];
            if( monument.completed ) {
                debug += "[X] ";
            } else { 
                debug += "[ ] ";
            }
            debug += monument.name + " " + monument.filledSpaces + "/" + monument.totalSpaces;
            debug += "\n";
        }
        console.log(debug);
    }
}
