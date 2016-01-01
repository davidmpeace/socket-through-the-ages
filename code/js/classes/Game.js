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
        this.players            = [];
        this.currentPlayerIndex = null;
        this.started            = false;
        this.addPlayer();
    }

    addPlayer()
    {
        if( !this.started ) {
            var player = new Player( "Player " + (this.players.length+1), this );
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

    start()
    {
        if( !this.started ) {
            for( var p1 in this.players ) {
                for( var p2 in this.players ) {
                    if( p1 != p2 && this.players[p1].playerName == this.players[p2].playerName ) {
                        alert("All players must have different names.");
                        return;
                    }
                }
            }

            this.started = true;
            
            arrayShuffle(this.players); // Randomly assign turn order

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
