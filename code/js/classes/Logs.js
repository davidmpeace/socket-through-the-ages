"use strict";

class Logs
{    
    constructor(game)
    {
        this.game = game;
        this.reset();
    }

    reset()
    {
        this.all = [];
    }

    add(message)
    {
        var log = {
            "date": new Date(),
            "player": this.game.currentPlayerIndex,
            "message": message
        }
        this.all.push(log);
    }
}