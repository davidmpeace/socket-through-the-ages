"use strict";

var MAX_PLAYERS      = 4;
var MAX_FOOD         = 15;
var MAX_DEVELOPMENTS = 5;
var MAX_ROLLS        = 3;

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
        this.turnNumber         = 0;
        this.roundNumber        = 0;
        this.started            = false;
    }

    addPlayer()
    {
        if( !this.started ) {
            var player = new Player( "Player " + (this.players.length+1), this );
            this.players.push( player );
            return player;
        }
    }
}
