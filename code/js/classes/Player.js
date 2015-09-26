"use strict";
class Player
{
    constructor(playerName, game)
    {
        this.playerName = playerName;
        this.game       = game;
        this.reset();
    }

    reset()
    {
        this.rolling      = false;
        this.goods        = new Goods(this.game, this);
        this.cities       = new Cities(this.game, this);
        this.monuments    = new Monuments(this.game, this);
        this.developments = new Developments(this.game, this);
        this.dice         = null;
        this.food         = 3;
        this.disasters    = 0;
    }

    roll( diceIndices )
    {
        this.rolling = true;
        if( !this.dice ) {
            this.dice = new Dice(this.game, this);
        }
        this.dice.roll(diceIndices);
    }

    doneRolling()
    {
        this.rolling = false;
        this.addFood(this.dice.totalFixedFood());
        this.goods.add(this.dice.totalGoods());


    }

    addFood(amountToAdd)
    {
        this.food = Math.min( this.game.maxFood, (this.food + amountToAdd) );
    }

    feedCities()
    {
        var remainingFood = this.food - this.cities.totalCompleted();
        this.food = Math.max( 0, remainingFood );
        var famines = 0;
        if( remainingFood < 0 ) {
            var famines    = -remainingFood;
            this.disasters += famines;
        }
        return famines;
    }

    resolveDisasters()
    {
        if( this.dice.totalSkulls() == 2 && !this.developments.has("Irrigation") ) {
            this.disasters += 2;
        } else if( this.dice.totalSkulls() == 3 ) {
            for( var p in this.game.players ) {
                var otherPlayer = this.game.players[p];
                if( otherPlayer.playerName != this.playerName && !otherPlayer.developments.has("Medicine") ) {
                    otherPlayer.disasters += 3;
                }
            }
        } else if( this.dice.totalSkulls() == 4 && !this.monuments.completed("Great Wall") ) {
            this.disasters += 4;
        } else if( this.dice.totalSkulls() >= 5 ) {
            if( this.developments.has("Religion") ) {
                for( var p in this.game.players ) {
                    var otherPlayer = this.game.players[p];
                    if( otherPlayer.playerName != this.playerName && !otherPlayer.developments.has("Medicine") ) {
                        otherPlayer.goods.reset();
                    }
                }
            } else {
                this.goods.reset();
            }
        }
    }

    developmentPoints()
    {
        return this.developments.totalPoints();
    }

    monumentPoints()
    {
        return this.monuments.totalPoints();
    }

    bonusPoints()
    {
        var points = 0;
        if( this.developments.has("Architecture") ) {
            points += this.cities.totalCompleted();
        }
        if( this.developments.has("Empire") ) {
            points += this.monuments.totalCompleted();
        }
        return points;
    }

    subtotal()
    {
        return this.developmentPoints() + this.monumentPoints() + this.bonusPoints();
    }

    totalPoints()
    {
        return this.subtotal() - this.disasters;
    }

    debug()
    {
        this.cities.debug();
        this.developments.debug();
        this.monuments.debug();
        this.goods.debug();

        var debug = pad("Food:", 10, ' ', STR_PAD_RIGHT);
        for( var f = 0; f <= MAX_FOOD; f++ ) {
            if( this.food == f ) {
                debug += pad("["+f+"]", 5, ' ', STR_PAD_BOTH);
            } else {
                debug += pad(""+f, 5, ' ', STR_PAD_BOTH);
            }
        }
        console.log(debug);

        debug = pad("Disasters:", 10, ' ', STR_PAD_RIGHT) + "\n" + this.disasters;
        console.log(debug);
    }
}
