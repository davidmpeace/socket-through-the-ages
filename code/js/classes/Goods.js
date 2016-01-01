"use strict";
class Goods
{
    constructor(player)
    {
        this.player = player;
        this.game   = player.game;

        this.reset();
    }

    /**
     * Reset the Developments collection back to it's default state of developments.
     */
    reset()
    {
        this.goods = [];

        //                              Name         Color      Values
        this.goods.push( new Good(this, "spearhead", "#d64705", [0,5,15,30,50])           );
        this.goods.push( new Good(this, "cloth",     "#114683", [0,4,12,24,40,60])        );
        this.goods.push( new Good(this, "pottery",   "#981719", [0,3,9,18,30,45,63])      );
        this.goods.push( new Good(this, "stone",     "#727278", [0,2,6,12,20,30,42,56])   );
        this.goods.push( new Good(this, "wood",      "#462f3a", [0,1,3,6,10,15,21,28,36]) );
    }

    /**
     * Return the Good with the matching name.
     */
    good(goodName)
    {
        for( var i in this.goods ) {
            var good = this.goods[i];
            if( good.name == goodName ) {
                return good;
            }
        }
    }

    quantityNeededToDiscard()
    {
        if( this.totalQuantity() > this.game.maxGoods() && !this.player.developments.has("Caravans") ) {
            return this.totalQuantity() - this.game.maxGoods();
        }
        return 0;
    }

    /**
     * Return an array of selected goods to sell.
     */
    selectedGoodsToSell()
    {
        var goods = [];
        for( var i in this.goods ) {
            var good = this.goods[i];
            if( good.selectedToSell ) {
                goods.push(good);
            }
        }
        return goods;
    }

    totalQuantityForSelectedGoods()
    {
        var totalQuantity    = 0;
        var selectedGoods = this.selectedGoodsToSell();
        for( var i in selectedGoods ) {
            totalQuantity += selectedGoods[i].quantity;
        }
        return totalQuantity;
    }

    /**
     * Return the total value for all selected goods to sell.
     */
    totalValueForSelectedGoods()
    {
        var totalValue    = 0;
        var selectedGoods = this.selectedGoodsToSell();
        for( var i in selectedGoods ) {
            totalValue += selectedGoods[i].value();
        }
        return totalValue;
    }

    deselectAllGoodsForSale()
    {
        for( var i in this.goods ) {
            this.goods[i].selectedToSell = false;
        }
    }

    /**
     * Return the total quantity of all goods.
     */
    totalQuantity()
    {
        var totalGoodsQuantity = 0;
        for( var i in this.goods ) {
            totalGoodsQuantity += this.goods[i].quantity;
        }
        return totalGoodsQuantity;
    }

    /**
     * Return the total value of all goods.
     */
    totalValue()
    {
        var totalGoodsValue = 0;
        for( var i in this.goods ) {
            totalGoodsValue += parseInt(this.goods[i].value());
        }
        return totalGoodsValue;
    }

    /**
     * Add a certain amount of goods
     */
    add(totalGoodsToAdd)
    {
        var goodIndex = this.goods.length-1; // Start with the last (cheapest) good
        for( var i = 0; i < totalGoodsToAdd; i++ ) {
            this.goods[goodIndex].add();
            goodIndex = (goodIndex == 0) ? this.goods.length-1 : goodIndex - 1;
        }
    }

    discardAll()
    {
        for( var i in this.goods ) {
            this.goods[i].discard();
        }
    }

    /**
     * Debug
     */
    debug()
    {
        var debug = "Goods:\n";
        debug += "Total Value of Goods: " + this.totalValue() + "\n";
        for( var i in this.goods ) {
            var good = this.goods[i];
            debug += good.debug();
        }
        console.log(debug);
    }
}
