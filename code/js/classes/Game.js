"use strict";

var MAX_PLAYERS      = 4;
var MAX_FOOD         = 15;
var MAX_DEVELOPMENTS = 5;
var MAX_ROLLS        = 3;
var MAX_GOODS        = 6;

class Game
{
    constructor()
    {
        this.newGame();
    }

    newGame()
    {
        this.logs               = new Logs(this);
        this.players            = [];
        this.error              = null;
        this.currentPlayerIndex = null;
        this.started            = false;
        this.addPlayer();
    }

    log(message)
    {
        this.logs.add(message);
    }

    addPlayer()
    {
        if( !this.started ) {
            var player = new Player( this, "Player " + (this.players.length+1) );
            this.players.push( player );
            return player;
        }
    }

    removePlayer( playerIndex )
    {
        if( !this.started ) {
            this.players.splice( playerIndex, 1 );
        }
    }

    currentPlayer()
    {
        return this.players[this.currentPlayerIndex];
    }

    otherPlayers(fromPlayer)
    {
        var otherPlayers = [];
        for( var i in this.players ) {
            var player = this.players[i];
            if( player.name != fromPlayer.name ) {
                otherPlayers.push(player);
            }
        }
        return otherPlayers;
    }

    start()
    {
        if( !this.started ) {
            for( var p1 in this.players ) {
                for( var p2 in this.players ) {
                    if( p1 != p2 && this.players[p1].name == this.players[p2].name ) {
                        throw "All players must have different names.";
                    }
                }
            }

            this.log("Game Started. Randomizing Turn Order.");
            this.started = true;
            
            arrayShuffle(this.players); // Randomly assign turn order

            for( var p in this.players ) {
                this.log( p + ") " + this.players[p].name );
            }

            this.currentPlayerIndex = 0;
            this.currentPlayer().startTurn();
        }
    }

    nextPlayersTurn()
    {
        this.currentPlayerIndex = (this.currentPlayerIndex == this.players.length-1) ? 0 : this.currentPlayerIndex + 1;
        this.currentPlayer().startTurn();
    }

    maxFood()
    {
        return MAX_FOOD;
    }

    maxDevelopments() 
    {
        return MAX_DEVELOPMENTS;
    }

    maxRolls()
    {
        return MAX_ROLLS;
    }

    maxPlayers()
    {
        return MAX_PLAYERS;
    }

    maxGoods()
    {
        return MAX_GOODS;
    }
}
