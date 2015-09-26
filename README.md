# Socket Through the Ages

```JavaScript
var game = new Game();
var player1 = game.addPlayer();
var player2 = game.addPlayer();
var player3 = game.addPlayer();
var player4 = game.addPlayer();
player1.developments.purchase("Quarrying");
player1.developments.purchase("Agriculture");
player1.developments.purchase("Coinage");
player1.developments.purchase("Masonry");
player1.cities.addWorkers(4);
player1.goods.add(13);
player1.roll();
player1.dice.debug();
player1.roll();
player1.dice.debug();
player1.roll();
player1.dice.debug();

player1.debug();
```
