"use strict";
class Cities
{
    constructor(game, player)
    {
        this.game   = game;
        this.player = player;
        this.reset();
    }

    reset()
    {
        this.cities = [];

        this.cities.push( this.newCity(0) );
        this.cities.push( this.newCity(0) );
        this.cities.push( this.newCity(0) );
        this.cities.push( this.newCity(3) );
        this.cities.push( this.newCity(4) );
        this.cities.push( this.newCity(5) );
        this.cities.push( this.newCity(6) );
    }

    newCity(spaces)
    {
        var newCity = {
            "totalSpaces": spaces,
            "filledSpaces": 0,
            "completed": (spaces == 0) ? true : false
        }
        return newCity;
    }

    addWorkers(workers) 
    {
        for( var i = 0; i < workers; i++ ) {
            for( var j in this.cities ) {
                var city = this.cities[j];
                if( !city.completed ) {
                    city.filledSpaces++;
                    city.completed = (city.filledSpaces == city.totalSpaces);
                    break;
                }
            }
        }
    }

    totalCompleted()
    {
        var totalCompleted = 0;
        for( var i in this.cities ) {
            var city = this.cities[i];
            if( city.completed ) {
                totalCompleted++;
            }
        }
        return totalCompleted;
    }

    debug()
    {
        var debug = "Cities:\n";
        for( var c in this.cities ) {
            var city = this.cities[c];
            debug += "City " + parseInt(parseInt(c)+1) + ") ";
            if( city.completed ) {
                debug += "[X] ";
            } else { 
                debug += "[ ] ";
            }
            debug += city.filledSpaces + "/" + city.totalSpaces
            debug += "\n";
        }
        console.log(debug);
    }
}
