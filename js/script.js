var gWidth = 800;
var gHeight = 500;
var xmlns = "http://www.w3.org/2000/svg";

//Game Variables

//Castle variable
var castleWidth = 40;
var castleHeight = 200;
var positionCastleLeft = 120;
var positionCastleRight = gWidth-positionCastleLeft-castleWidth;

//Other variables
var cardPack;
var Game;
var actualPlayer = 0; 


function Game(argument) {
	//Set up variables
	actualPlayer = 0;
	cardPack = new CardPack();
		//svg	
	this.g = document.createElementNS(xmlns,"svg");

	this.g.setAttributeNS(null, "viewBox", "0 0 " + gWidth + " " + gHeight);
	this.g.setAttributeNS(null, "width", gWidth);
	this.g.setAttributeNS(null, "height", gHeight);

	//Creating player 1
	this.player1 = new Player("player1",positionCastleLeft); 
	this.player1Castle = this.player1.castle; 
    this.g.appendChild(this.player1Castle.castle());        	

	//Creating player 2 
	this.player2 = new Player("player2",positionCastleRight); 
	this.player2Castle = this.player2.castle; 
    this.g.appendChild(this.player2Castle.castle());        	

	initCardPack(this.player1Castle,1,this.player2Castle);
	initCardPack(this.player2Castle,2,this.player1Castle);

    //Append svg node
	this.svgContainer = document.querySelector(".svgContainer");
    this.svgContainer.appendChild(this.g);         	
    Game = this;
	updateStats();
	nextRound();
}


//Castle
function Castle(name,xOffset){
	this.width = castleWidth;
	this.height = castleHeight;
	this.name = name;

	this.castle = function(){
		this.castle = document.createElementNS(xmlns,"rect");
		this.castle.setAttributeNS (null, "width", 	this.width);
		this.castle.setAttributeNS (null, "height", this.height);
		this.castle.setAttributeNS (null, "x", xOffset);
		this.castle.setAttributeNS (null, "y", gHeight-this.height);
		this.castle.setAttributeNS (null, "class", "castle" + " " + this.name);
		return this.castle;
	};
}

Castle.prototype.increaseHeight = function(step){
	this.height += 10*step;

	//Koeficient for timing the amount to increase or decrease
	var castleElement = document.querySelector("."+this.name);
 	var timerFunction = setInterval(animate, 20);

	var castleY = parseInt(castleElement.getAttribute("y"));
	limitCastleY = castleY - 10*step;

	var castleHeight = parseInt(castleElement.getAttribute("height"));
	limitCastleHeight = castleHeight + 10*step;

	function animate(){
	    var castleY = parseInt(castleElement.getAttribute("y"));	
 		var castleHeight = parseInt(castleElement.getAttribute("height"));

	    var newCastleY =  castleY - 2;
	    var newCastleHeight = castleHeight + 2; 

	    if(newCastleY <= limitCastleY){
	    	clearInterval(timerFunction);
	    	timerFunction = null;
	    }

		castleElement.setAttribute("y",newCastleY); 
		castleElement.setAttribute("height",newCastleHeight);
	}
}

Castle.prototype.decreaseHeight = function(step){
	this.height -= 10*step;
	
	//Koeficient for timing the amount to increase or decrease
	var castleElement = document.querySelector("."+this.name);
 	var timerFunction = setInterval(animate, 20);

	var castleY = parseInt(castleElement.getAttribute("y"));
	limitCastleY = castleY + 10*step;

	var castleHeight = parseInt(castleElement.getAttribute("height"));
	limitCastleHeight = castleHeight - 10*step;

	function animate(){
	    var castleY = parseInt(castleElement.getAttribute("y"));	
 		var castleHeight = parseInt(castleElement.getAttribute("height"));

	    var newCastleY =  castleY + 2;
	    var newCastleHeight = castleHeight - 2; 

	    if(newCastleY >= limitCastleY){
	    	clearInterval(timerFunction);
	    	timerFunction = null;
	    }

		castleElement.setAttribute("y",newCastleY); 
		castleElement.setAttribute("height",newCastleHeight);
	}
}

var Shield = function(xOffset){
	var shieldWidth = 10; 
	var shieldHeight = 200; 
	var shieldOffset = 70;
	this.xOffset = xOffset;

	var shield = document.createElementNS(xmlns,"rect");
	shield.setAttributeNS (null, "width", shieldWidth);
	shield.setAttributeNS (null, "height", shieldHeight);
	shield.setAttributeNS (null, "x", xOffset + shieldOffset);
	shield.setAttributeNS (null, "y", gHeight-shieldHeight);
	shield.setAttributeNS (null, "class", "shield");

	return shield;
}


var incButton = document.querySelector(".increase");
var decButton = document.querySelector(".decrease");

incButton.addEventListener("click",function(){
	var step = 2;
	var castle = Game.castleLeft;
	castle.increaseHeight(step);
})

decButton.addEventListener("click",function(){
	var step = 2;
	var castle = Game.castleLeft;
	castle.decreaseHeight(step);
})



//**************** Player **********************

function Player(name,positionOfCastle){
	this.builds = 0;
	this.attacks = 0;
	this.spells = 0;

	this.buildsInc = 2;
	this.attacksInc = 2;
	this.spellsInc = 2;
	this.name = name;

	this.castle = new Castle(this.name,positionOfCastle);

	this.cardPack = new CardPack();
}

Player.prototype.increaseResources = function(){
	this.builds += thisBuildsInc;
	this.attacks += thisAttacksInc;
	this.spells += thisSpellsInc;
}

//**************** Card **********************
function Card(cost,val,type){
	this.cost = cost;
	this.val = val;
	this.type = type;
	this.disable = 0;
	this.cardHeight = 120;
	this.cardWidth = 70;
}


function CardPack(){
	this.pack = new Array();

	//generate build cards, type = 0 
	for (var i = 1; i < 4; i++) {
		this.pack.push(new Card(i,i+1*2,0))
	};

	//generate magic cards, type = 1
	for (var i = 1; i < 4; i++) {
		this.pack.push(new Card(i,i*2,1))
	};

	//generate attack cards, type = 2
	for (var i = 1; i < 4; i++) {
		this.pack.push(new Card(i,i*2,2))
	};

	this.getCard = function(){
		var numOfCards = this.pack.length;
		var index = Math.floor((Math.random() * numOfCards)); 		
		return this.pack[index];
	};
}

function initCardPack(castle,player,castleOponent){

	if (player === 1) {
		var pack = document.querySelector(".js-cardPack1");
	}else{
		var pack = document.querySelector(".js-cardPack2");
	};

	function createCardNode(){
		var internalCard = cardPack.getCard();
		var card = document.createElement("li");
		card.setAttribute("class","cardPack__card");
		card.setAttribute("data-value",internalCard.val);
		card.setAttribute("data-cost",internalCard.cost);
		card.setAttribute("data-type",internalCard.type);

		var cardType = internalCard.type;
		if (cardType == 0) {
			card.className += " " + "cardPack__card--build";
		}else if(cardType == 1){
			card.className += " " + "cardPack__card--magic";
		}else{
			card.className += " " + "cardPack__card--attack";
		};
		return card;
	}

	for (var i = 0; i < 8; i++) {
		var card = createCardNode();
		pack.appendChild(card);
	};
	
	var cards;

	if (player === 1) {
		cards = document.querySelectorAll(".js-cardPack1 > .cardPack__card");	
			console.log("cards1");
	}else{
		cards = document.querySelectorAll(".js-cardPack2 > .cardPack__card");	
			console.log("cards2");
	};

	for (var i = cards.length - 1; i >= 0; i--) {
		cards[i].addEventListener("click", function(){
			var step = parseInt(this.getAttribute("data-value"));
			var type = parseInt(this.getAttribute("data-type"));
			if (type == 0) {
				//build
				castle.increaseHeight(step);
			}else if(type == 1){
			}else{
				//attack
				castleOponent.decreaseHeight(step);
			};

  			var newInternalCard = cardPack.getCard();
  			this.setAttribute("data-value", newInternalCard.val);
  			this.setAttribute("data-cost", newInternalCard.cost);
  			this.setAttribute("data-type", newInternalCard.type);
  			this.removeAttribute("class");

			var cardType = newInternalCard.type;
			var basicCardClass = "cardPack__card";


			if (cardType == 0) {
				this.className += basicCardClass + " " + "cardPack__card--build";
			}else if(cardType == 1){
				this.className += basicCardClass + " " + "cardPack__card--magic";
			}else{
				this.className += basicCardClass + " " + "cardPack__card--attack";
			};
				updateStats();
				nextRound();
		})
	};
}

function updateStats(playerName){
	this.playerName = playerName;
	//player1
	var statsHeight = document.querySelector(".js-player1 .js-stats .js-castleHeight")	
	statsHeight.textContent = Game.player1.castle.height;

	//player2
	var statsHeight = document.querySelector(".js-player2 .js-stats .js-castleHeight")	
	statsHeight.textContent = Game.player2.castle.height;
}


function nextRound(){
	var player1Bar = document.querySelector(".js-player1");
	var player2Bar = document.querySelector(".js-player2");
	if(actualPlayer === 0){
		player1Bar.className = player1Bar.className.replace( "disabled" , '' );
		player2Bar.className += " disabled";
		actualPlayer = 1;
	}else{
		player2Bar.className = player2Bar.className.replace(  "disabled" , '' );
		player1Bar.className += " disabled";
		actualPlayer = 0;
	}
}