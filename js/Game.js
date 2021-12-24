class Game {
  constructor(){
    this.title = createElement('h1');
    this.title2 = createElement('h2');
  }


  //obtiene el estado del juego
  getState(){
    var gameStateRef  = database.ref('gameState');
    gameStateRef.on("value",function(data){
       gameState = data.val();
    })

  }

  //Actualiza el estado del juego (gameState)
  update(state){
    database.ref('/').update({
      gameState: state
    });
  }

  //Comienza la pagina principal del formulario
  async start(){
    if(gameState === 0){
      player = new Player();
      var playerCountRef = await database.ref('playerCount').once("value");
      if(playerCountRef.exists()){
        playerCount = playerCountRef.val();
        player.getCount();
      }
      form = new Form()
      form.display();
    }
    
    car1 = createSprite(100,200,200,200);
    car1.addImage("car1", c1Img);

    car2 = createSprite(300,200,200,200);
    car2.addImage("car2", c2Img);

    car3 = createSprite(500,200,200,200);
    car3.addImage("car3", c3Img);

    car4 = createSprite(700,200,200,200);
    car4.addImage("car4", c4Img);

    cars = [car1, car2, car3, car4];
  }

  //Inicia todo el juego
  play(){
    form.hide();

    Player.getPlayerInfo();
    player.getCarsAndEnd();
    
    if(allPlayers !== undefined){
      background("blue");

      image(trackImg,0,-displayHeight*4,displayWidth,displayHeight*5);

      //var display_position = 100;
      
      //index of the array
      var index = 0;

      //x and y position of the cars
      var x = 210;
      var y;

      for(var plr in allPlayers){
        //add 1 to the index for every loop
        index = index + 1 ;

        //position the cars a little away from each other in x direction
        x = x + 300;
        //use data form the database to display the cars in y direction
        y = displayHeight - allPlayers[plr].distance;
        cars[index-1].x = x;
        cars[index-1].y = y;
        
        if(player.distance === 5460){
          cars[index-1].visible = false;
        }

        if (index === player.index){
          cars[index - 1].shapeColor = "red";
          camera.position.x = displayWidth/2;
          camera.position.y = cars[index-1].y
          //console.log(cars[index-1].y);
          if (player.distance <= 5460) {
            stroke("red");
            fill("red"); 
            ellipse(x,y,60);
          }
        }
       
        //textSize(15);
        //text(allPlayers[plr].name + ": " + allPlayers[plr].distance, 120,display_position)
      }

    }


    if(keyIsDown(UP_ARROW) && player.index !== null){
      player.distance +=10
      player.update();
    }

    if (player.distance === 5230) {

      player.rank += 1;
      game.update(2);
      Player.updateCarsAndEnd(player.rank);
    }

    drawSprites();
  }

  end() {
    console.log("Juego terminado!");
    this.title.html("Juego Terminado!");
    this.title.position(displayWidth/2, displayHeight/2-400);

    console.log(player.rank);
    this.title2.html("Posicion: " + player.rank);
    this.title2.position(displayWidth/2+30, displayHeight/2-350);
  }

  
}
