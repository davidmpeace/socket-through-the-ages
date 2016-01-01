"use strict";
class Goods
{
    constructor(player)
    {
        this.player = player;
        this.game   = player.game;
        this.goodTypes          = ['wood','stone','pottery','cloth','spearhead'];
        this.goodTypesReversed  = ['spearhead','cloth','pottery','stone','wood'];
        this.goodTypeColors = {
            "spearhead": "#d64705",
            "cloth":     "#114683",
            "pottery":   "#981719",
            "stone":     "#727278",
            "wood":      "#462f3a"
        };
        this.goodValues = {
            "spearhead": [0,5,15,30,50],
            "cloth":     [0,4,12,24,40,60],
            "pottery":   [0,3,9,18,30,45,63],
            "stone":     [0,2,6,12,20,30,42,56],
            "wood":      [0,1,3,6,10,15,21,28,36]
        };
        this.selectedGoodsForCoins = [];

        this.reset();
    }

    reset()
    {
        this.goods = {
            "spearhead": 0,
            "cloth":     0,
            "pottery":   0,
            "stone":     0,
            "wood":      0
        }
        this.selectedGoodsForCoins = [];
    }

    toggleSelectedGood(goodType)
    {
        var selectedGoodIndex = this.selectedGoodsForCoins.indexOf(goodType);
        if( selectedGoodIndex > -1 ) {
            this.selectedGoodsForCoins.splice(selectedGoodIndex, 1);
        } else {
            this.selectedGoodsForCoins.push(goodType);
        }
    }

    totalValueForSelectedGoods()
    {
        var totalValue = 0;
        for( var i in this.selectedGoodsForCoins ) {
            var goodType = this.selectedGoodsForCoins[i];
            totalValue += this.valueOf(goodType);
        }
        return totalValue;
    }

    isSelected(goodType)
    {
        var selectedGoodIndex = this.selectedGoodsForCoins.indexOf(goodType);
        return (selectedGoodIndex > -1);
    }

    emptyGoodsForTypes( goodTypes )
    {
        for( var i in goodTypes ) {
            this.emptyGood(goodTypes[i]);
        }
    }

    emptyGood(goodType)
    {
        this.goods[goodType] = 0;
    }

    total()
    {
        var totalGoodsQuantity = 0;
        for( var key in this.goods ) {
            var amountOfGood = this.goods[key];
            totalGoodsQuantity += amountOfGood;
        }
        return totalGoodsQuantity;
    }

    value()
    {
        var totalGoodsValue = 0;
        for( var goodType in this.goods ) {
            var goodCount   = this.goods[goodType];
            // console.log(goodCount);
            // console.log(goodType);
            var valueOfGood = this.goodValues[goodType][goodCount];
            totalGoodsValue += parseInt(valueOfGood);
        }
        return totalGoodsValue;
    }

    amountOf(goodType)
    {
        return this.goods[goodType];
    }

    valueOf(goodType)
    {
        var amount = this.amountOf(goodType);
        return this.goodValues[goodType][amount];
    }

    add(totalGoodsToAdd)
    {
        var goodIndex = 0;
        for( var i = 0; i < totalGoodsToAdd; i++ ) {
            var goodType         = this.goodTypes[goodIndex];
            var maxForGood       = (this.goodValues[goodType].length - 1);
            var currentGoodCount = this.goods[goodType];
            var amountToAdd      = (goodType == 'stone' && this.player.developments.has("Quarrying") ) ? 2 : 1;
            var newGoodTotal     = Math.min( maxForGood, (currentGoodCount + amountToAdd) );

            this.goods[goodType] = newGoodTotal;

            goodIndex = ((goodIndex + 1) < this.goodTypes.length) ? (goodIndex + 1) : 0;
        }
    }

    debug()
    {
        var debug = "Goods:\n";
        debug += "Total Value of Goods: " + this.value() + "\n";
        for( var i = (this.goodTypes.length - 1); i >= 0; i-- ) {
            var goodType   = this.goodTypes[i];
            debug += pad(goodType+":", 10, ' ', STR_PAD_RIGHT);
            var goodValues = this.goodValues[goodType];
            var goodCount  = this.goods[goodType];

            for( var valueIndex in goodValues ) {
                var goodValue = goodValues[valueIndex]
                if( valueIndex == goodCount ) {
                    debug += pad("["+goodValue+"]", 5, ' ', STR_PAD_BOTH);
                } else {
                    debug += pad(""+goodValue, 5, ' ', STR_PAD_BOTH);
                }
            }

            debug += "\n";
        }
        console.log(debug);
    }
}
