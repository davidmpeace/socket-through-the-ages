"use strict";

class Good
{
    constructor(goods, name, color, values)
    {
        this.game   = goods.game;
        this.player = goods.player;
        this.name   = name;
        this.color  = color;
        this.values = values;
        this.reset();
    }

    /**
     * Reset the information for the City back to default.
     */
    reset()
    {
        this.quantity       = 0;
        this.maxQuantity    = this.values.length-1;
        this.selectedToSell = false;
    }

    /**
     * Add 1 (or 2 stone with quarrying) quantity to this good
     */
    add()
    {
        var quantityToAdd = (this.name == 'stone' && this.player.developments.has("Quarrying") ) ? 2 : 1;
        this.quantity     = Math.min( (this.quantity + quantityToAdd), this.maxQuantity );
    }

    /**
     * Discard all of this good
     */
    discard()
    {
        this.quantity = 0;
    }

    /**
     * Toggle this good if it's selected to sell
     */
    toggleSelectedToSell()
    {
        this.selectedToSell = !this.selectedToSell;
    }

    /**
     * Sell the good for coins, and return the good value
     */
    sell()
    {
        this.game.log( this.name + ": Selling for " + this.value() + " coins." );
        var totalCoins = this.value();
        this.discard();
        return totalCoins;
    }

    /**
     * Value of this good
     */
    value()
    {
        return this.values[this.quantity];
    }

    /**
     * Debug
     */
    debug()
    {
        debug = pad(this.name + ":", 10, ' ', STR_PAD_RIGHT);

        for( var i in this.values ) {
            var value = this.values[i]
            if( i == this.quantity ) {
                debug += pad("[" + value + "]", 5, ' ', STR_PAD_BOTH);
            } else {
                debug += pad(value, 5, ' ', STR_PAD_BOTH);
            }
        }

        debug += "\n";
        return debug;
    }
}