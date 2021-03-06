"use strict";

var TURN_STAGE_WAITING        = 0;
var TURN_STAGE_START          = 1;
var TURN_STAGE_ROLLING        = 2;
var TURN_STAGE_LEADERSHIP     = 3;
var TURN_STAGE_ROLL_COMPLETE  = 4;
var TURN_STAGE_DICE_FINALIZED = 5;
var TURN_STAGE_COLLECT        = 6;
var TURN_STAGE_WORKERS        = 7;
var TURN_STAGE_PURCHASE       = 8;
var TURN_STAGE_DISCARD        = 9;
var MAX_STAGES                = 9;

class Player
{
    constructor(game, name)
    {
        this.game                  = game;
        this.name                  = name;
        this.lastStageIndex        = 8;
        this.turnStageDescriptions = [
            "Waiting for turn",
            "Ready to Roll",
            "Roll Dice",
            "Leadership Roll",
            "Rolling Complete",
            "Dice Finalized",
            "Collect Goods and Food",
            "Apply Workers",
            "Purchase Development",
            "Discard Excess Goods"
        ];

        this.reset();
    }

    reset()
    {
        this.goods                 = new Goods(this);
        this.cities                = new Cities(this);
        this.monuments             = new Monuments(this);
        this.developments          = new Developments(this);
        this.developmentToPurchase = null;
        this.foodToSell            = 0;
        this.stoneToSell           = 0;
        this.turnStage             = 0;
        
        this.dice                  = null;
        this.food                  = 3;
        this.disasters             = 0;
    }

    log(message)
    {
        this.game.log(message);
    }

    currentStageDescription()
    {
        return this.turnStageDescriptions[this.turnStage];
    }

    isMyTurn()
    {
        return (this.game.currentPlayer().name == this.name);
    }

    isStage( stageName )
    {
        switch( stageName )
        {
            case "TURN_STAGE_WAITING": return this.turnStage == TURN_STAGE_WAITING;
            case "TURN_STAGE_START": return this.turnStage == TURN_STAGE_START;
            case "TURN_STAGE_ROLLING": return this.turnStage == TURN_STAGE_ROLLING;
            case "TURN_STAGE_LEADERSHIP": return this.turnStage == TURN_STAGE_LEADERSHIP;
            case "TURN_STAGE_ROLL_COMPLETE": return this.turnStage == TURN_STAGE_ROLL_COMPLETE;
            case "TURN_STAGE_DICE_FINALIZED": return this.turnStage == TURN_STAGE_DICE_FINALIZED;
            case "TURN_STAGE_COLLECT": return this.turnStage == TURN_STAGE_COLLECT;
            case "TURN_STAGE_WORKERS": return this.turnStage == TURN_STAGE_WORKERS;
            case "TURN_STAGE_PURCHASE": return this.turnStage == TURN_STAGE_PURCHASE;
            case "TURN_STAGE_DISCARD": return this.turnStage == TURN_STAGE_DISCARD;
        }
    }

    canRoll()
    {
        return this.isMyTurn() && (this.turnStage == TURN_STAGE_START || (this.turnStage == TURN_STAGE_ROLLING && this.dice.canRoll));
    }

    isInOneOfStages(arrayOfAcceptableStages)
    {
        for( var i in arrayOfAcceptableStages ) {
            if( this.turnStage == arrayOfAcceptableStages[i] ) {
                return true;
            }
        }

        return false;
    }

    startTurn()
    {
        this.dice      = null;
        this.turnStage = TURN_STAGE_START;
        this.log(this.name + "'s Turn.");
    }

    rollDice()
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_START, TURN_STAGE_ROLLING]) ) { return; }

        if( this.turnStage == TURN_STAGE_START) {
            this.dice      = new Dice( this, this.cities.totalCompleted() );
            this.turnStage = TURN_STAGE_ROLLING;
        }

        this.dice.roll();

        if( !this.dice.canRoll ) {
            if( this.dice.canRollLeadershipDie() ) {
                this.turnStage = TURN_STAGE_LEADERSHIP;
            } else {
                this.rollComplete();
            }
        }
    }

    completeRolling()
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_ROLLING]) ) { return; }

        this.dice.completeRolling();

        if( this.dice.canRollLeadershipDie() ) {
            this.turnStage = TURN_STAGE_LEADERSHIP;
        } else {
            this.rollComplete();
        }
    }

    rollLeadershipDie( dieIndex )
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_LEADERSHIP]) ) { return; }

        this.dice.rollLeadershipDie(dieIndex);
        this.rollComplete();
    }

    skipLeadershipDie()
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_LEADERSHIP]) ) { return; }
        
        this.dice.skipLeadershipDie();
        this.rollComplete();
    }

    rollComplete()
    {
        this.turnStage = TURN_STAGE_ROLL_COMPLETE;

        if( !this.dice.hasOptionalDice() ) {
            this.finalizeDice();
        }
    }

    canFinalizeDice()
    {
        if( this.isMyTurn() && this.isInOneOfStages([TURN_STAGE_ROLLING, TURN_STAGE_LEADERSHIP, TURN_STAGE_ROLL_COMPLETE]) ) { 
            return true; 
        }

        return false;
    }

    finalizeDice()
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_ROLLING, TURN_STAGE_LEADERSHIP, TURN_STAGE_ROLL_COMPLETE]) ) { return; }

        if( this.dice.finalizeDice() ) {
            this.turnStage = TURN_STAGE_DICE_FINALIZED;
            this.collectGoodsAndFood();

            this.developmentToPurchase = null;
            this.foodToSell            = 0;
            this.stoneToSell           = 0;
        }
    }

    collectGoodsAndFood()
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_DICE_FINALIZED]) ) { return; }
        
        var totalFood  = this.dice.takeFood();
        var totalGoods = this.dice.takeGoods();

        this.food = Math.min( MAX_FOOD, (this.food+totalFood) );
        this.goods.add( totalGoods );

        this.feedCities();
        this.resolveDisasters();
    }

    feedCities()
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_DICE_FINALIZED]) ) { return; }

        var remainingFood = this.food - this.cities.totalCompleted();
        this.food = Math.max( 0, remainingFood );
        var famines = 0;
        if( remainingFood < 0 ) {
            var famines    = -remainingFood;
            this.disasters += famines;
        }
        this.dice.resultingFamines = famines;
    }

    resolveDisasters()
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_DICE_FINALIZED]) ) { return; }

        var disasterEffect = this.dice.disasterEffect();

        if( disasterEffect == DISASTER_EFFECT_DROUGHT ) {
            // Drought - 2 disasters
            this.disasters += 2;
        } else if( disasterEffect == DISASTER_EFFECT_PESTILENCE ) {
            // Pestilence - Other players get 3 disasters unless they have Medicine
            var otherPlayers = this.game.otherPlayers(this);
            for( var i in otherPlayers ) {
                var otherPlayer = otherPlayers[i];
                if( !otherPlayer.developments.has("Medicine") ) {
                    otherPlayer.disasters += 3;
                }
            }
        } else if( disasterEffect == DISASTER_EFFECT_INVASION ) {
            // Invasion - 4 disasters
            this.disasters += 4;
        } else if( disasterEffect == DISASTER_EFFECT_REVOLT ) {
            // Revolt - discard all goods
            this.goods.discardAll();
        } else if( disasterEffect == DISASTER_EFFECT_REVOLT_WITH_RELIGION ) {
            // Revolt affects opponents
            var otherPlayers = this.game.otherPlayers(this);
            for( var i in otherPlayers ) {
                otherPlayers[i].goods.discardAll();
            }
        }
    }

    moveToWorkersStage()
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_DICE_FINALIZED]) ) { return; }

        this.turnStage = TURN_STAGE_WORKERS;
    }

    workersFromStone()
    {
        return (this.stoneToSell * 3);
    }

    applyWorkersToCities( totalWorkers )
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_WORKERS]) ) { return; }

        var totalWorkers = this.dice.takeWorkers(totalWorkers);
        this.cities.addWorkers(totalWorkers);
    }

    applyWorkersToMonument( monumentName, totalWorkers )
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_WORKERS]) ) { return; }

        var totalWorkers = this.dice.takeWorkers(totalWorkers);
        this.monuments.addWorkersTo( monumentName, totalWorkers );
    }

    doneWithWorkers()
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_WORKERS]) ) { return; }

        if( this.stoneToSell > 0 ) {
            this.goods.good('stone').remove(this.stoneToSell);
        }

        this.turnStage = TURN_STAGE_PURCHASE;
    }

    totalAvailableCoins()
    {
        if( !this.isMyTurn() ) { return 0; }

        var foodCoins = 0;
        if( this.developments.has("Granaries") && this.foodToSell >= 0 && this.foodToSell <= this.food ) {
            foodCoins = (this.foodToSell * 4);
        }

        return this.dice.totalCoins() + this.goods.totalValueForSelectedGoods() + foodCoins;
    }

    selectDevelopment( development )
    {
        if( this.developmentToPurchase == development.name ) {
            this.developmentToPurchase = null;
        } else {
            this.developmentToPurchase = development.name;
        }
    }

    sellThenPurchaseSelected()
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_PURCHASE]) ) { return; }

        if( this.developmentToPurchase ) {
            var development = this.developments.development(this.developmentToPurchase);
            if( development.isPurchaseable() ) {
                development.purchase();
            }
        }

        this.purchaseCompleted();
    }

    useAvailableCoins()
    {
        this.dice.takeCoins();
        if( this.foodToSell > 0 ) {
            this.food -= this.foodToSell;
        }

        var selectedGoods = this.goods.selectedGoodsToSell();
        for( var i in selectedGoods ) {
            selectedGoods[i].sell();
        }
    }

    purchaseCompleted()
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_PURCHASE]) ) { return; }

        this.goods.deselectAllGoodsForSale();
        this.developmentToPurchase = null;

        if( this.goods.quantityNeededToDiscard() > 0 ) {
            this.turnStage = TURN_STAGE_DISCARD;
        } else {
            this.completeTurn();
        }
    }

    discardGoods()
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_DISCARD]) ) { return; }

        var selectedGoods = this.goods.selectedGoodsToSell();
        for( var i in selectedGoods ) {
            selectedGoods[i].discard();
        }

        this.goods.deselectAllGoodsForSale();

        this.completeTurn();
    }

    completeTurn()
    {
        if( !this.isMyTurn() ) { return; }
        if( !this.isInOneOfStages([TURN_STAGE_PURCHASE, TURN_STAGE_DISCARD]) ) { return; }

        if( this.goods.quantityNeededToDiscard() > 0 ) {
            alert("Must discard goods to be 6 or less.  Get Caravans next time!");
            return;
        }

        this.turnStage = TURN_STAGE_WAITING;
        this.game.nextPlayersTurn();
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
        return this.developments.totalBonusPoints();
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
        console.log("Player State Debug for: " + this.name);
        console.log("Stage: " + this.currentStageDescription());

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
