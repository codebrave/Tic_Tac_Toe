
$(document).ready(function(){
  // This stores the inputted characters
  // into this array.
  var cbd=['','','','','','','','',''];
  
  // Array win number locations for 3 of
  // the character locations.
  var winAr=[[0,1,2],
             [3,4,5],
             [6,7,8],
             [0,3,6],
             [1,4,7],
             [2,5,8],
             [0,4,8],
             [2,4,6]
            ]; 
  // This is for setting the flag on the player's
  // first turn.
  var fsfl=0;
  
  // Create a new tc object.
  var t= new tc();
  
  $("#hp").hide();
  $("#cp").hide();
  $("#oc").hide();
  $("#xc").hide();
  $("#hm").hide();
  $("#cpu").hide();
  $("#fhm").hide();
  $("#shm").hide();
  $("#ft").hide();
  $("#hmt").hide();
  $("#fhmt").hide();
  $("#shmt").hide();
  $("#rst").hide();
  $("#hmw").hide();
  $("#cpw").hide();
  $("#fhmw").hide();
  $("#shmw").hide();
  $("#dr").hide();
  
  // This activates when one of the game board's
  // buttons is pressed.
  $(".bn").click(function(){
    pl(Number(this.id));
  });
  
  // This activates when one of the game boad's
  // bottom buttons is pressed.
  $(".obn").click(function(){
    pl(Number(this.id));
  });
  
  // This function outputs the 'X' or 'O' characters
  // on the game board whenever a player's turn
  // is next.
  function pl(d){
    // If the game is on and the one of the cbd's
    // memory locations has a '' character, then
    // a 'X' or 'O' character is outputted depending
    // on the player's turn. 
    if(t.getGame()&&cbd[d]===''){      
      // If fsfl is 0 and t.getFirst is true, 
      // the first player goes first and outputs
      // his own character.
      if(fsfl===0&&t.getFirst()){
        choose(d,t.getHuman());
        
        // If the computer is in the game, then
        // it is the computer's turn to output
        // its own character. 
        if(t.getCp()){
          minMax(cbd,0,t.getOpt());
          t.setNext(t.getHuman());
        } // end of if
        
        // Otherwise, the opponent's turn
        // is next.
        else {
          t.setNext(t.getOpt());
          $("#fhmt").hide();
          $("#shmt").show();
        } // end of else
         
        fsfl=1;
      } // end of if
      
      // Otherwise, if fsfl is 0 and t.getFirst() is
      // false, then the opponent or computer goes
      // first to output the next character.
      else if(fsfl===0&&!t.getFirst()){
        // If the computer is in the game, then it
        // outputs on a random empty square.
        if(t.getCp()){
          var n=Math.floor((Math.random()*cbd.length)); 
          $("#hmt").show();          
          choose(n,t.getOpt());
          
        } // end of if
        
        // Otherwise, the opponent outputs his
        // own character on a specified empty
        // square.
        else {
          $("#shmt").hide();
          $("#fhmt").show();          
          choose(d,t.getOpt());  

        } // end of else
        
        t.setNext(t.getHuman());
        fsfl=1;
        
      } // end of else if 
      
      // Otherwise, display the other characters
      // that is not on the first turn.
      else {
        
        // If the first player's turn is next, 
        // then it's character is displayed on
        // an empty square.
        if(t.getNext()===t.getHuman()){
        
          // If the computer is not in the game,
          // then the first player displays
          // his assigned character. 
          if(!t.getCp()){
            t.setNext(t.getOpt());
            $("#fhmt").hide();
            $("#shmt").show();
            choose(d,t.getHuman());  
          }
          
          // Otherwise, both the first player
          // and computer display their characters.
          else {
           choose(d,t.getHuman());  
           minMax(cbd,0,t.getOpt());
            
          }
                 
        } // end of if
        
        // Otherwise, the opponent displays his
        // assigned character on an empty square.
        else {
          $("#shmt").hide();
          $("#fhmt").show();       
          choose(d,t.getOpt()); 
          t.setNext(t.getHuman());

        } // end of else
        
      } // end of else
      
    } // end of if
  } // end of pl function
  
  // This function displays the player's 
  // assigned character only if cbd has an
  // empty character.
  function choose(num,participant){
    // If cbd[num] has an empty character, the player
    // displays his character.
    if(cbd[num]===''){
      // If this is the 1st player, then the player's
      // character displays.
      if(participant===t.getHuman()){ 
        $("#"+String(num)).html("<h1 class='char'> <b>"
                          +t.getCh()+"</b></h1>");
        cbd[num]=t.getCh();
      } // end of if
      
      // Otherwise, the opponent's character displays
      else {
        $("#"+String(num)).html("<h1 class='char'> <b>"
                          +t.getOch()+"</b></h1>");
        cbd[num]=t.getOch();
      } // end of else
      
      // If 3 of the same characters have landed,
      // then the player wins.
      if(chwin(cbd,participant)){
        // If this is the 1st player, then
        // the first player wins.
        if(participant==t.getHuman()&&t.getCp()){
          $("#hmw").show();  
        } // end of if
        
        // Otherwise, if this is first player and the
        // computer is not in the game, then the player
        // wins.
        else if(participant&&!t.getCp()){
          $("#fhmw").show();
        } // end of else if
        
        // Otherwise, if this is the computer, then
        // the computer wins.
        else if(!participant&&t.getCp()){
          $("#cpw").show();
        } // end of else if
        
        // Otherwise, the second player wins.
        else {
          $("#shmw").show();
        } // end of else
        
        $("#hmt").hide();
        $("#fhmt").hide();
        $("#shmt").hide();        
        t.setGame(false);
        
      } // end of if
      
      // Otherwise, if there are no empty
      // characters, then the result is a draw.
      else if(isFull(cbd)){
        $("#hmt").hide();
        $("#fhmt").hide();
        $("#shmt").hide();  
        $("#dr").show();        
        t.setGame(false);       
      } // end of else if
      
    } // end of if
  } // end of choose function
  
  // This function checks if the player has
  // landed 3 of the same characters.
  function chwin(brd,participant){
    // If the paricipant is the 1st player, ch gets
    // t.getCh(). Otherwise, ch gets t.getOch().
    var ch = participant===t.getHuman() ? t.getCh()
          : t.getOch();  
    
    // Check if 3 of the same characters have 
    // landed in 2 for loops.
    for(var i=0;i<8;i++){
      var w=true;
      for (var j=0;j<3;j++){
        // If the characters do not match,
        // the 2nd for loop breaks out.
        if(brd[winAr[i][j]]!==ch){
          w=false;
          break;
        } // end of if
        
        // Otherwise, if w is true and j is 2,
        // return true.
        else if(w&&j==2){
          return true;
        } // end of else if
      } // end of for 
    } // end of for
    return false;
    
  } // end of chwin function
  
  // This function checks if there are no
  // empty characters on the game board.
  function isFull(brd){
    // Check any empty spaces in a for loop.
    // If no empty spaces, return true.
    for(var i=0;i<9;i++){
      if(brd[i]===''){
        return false;
      } // end of if
    } // end of for
    return true;
  } // end of isFull function

  // This function returns depth - 10 or
  // 10 -depth if the player or computer
  // wins on the future results of the
  // min-max algorithm.
  function sc(brd,depth,participant){
    // If the player wins, return the following
    // scores below.
    if(chwin(brd,participant)){

      // If this is the first player, return
      // depth - 10.
      if(participant==t.getHuman()){
        return depth - 10;
      } // end of if
      
      // Otherwise, return 10 - depth for the computer.
      else {
        return 10 - depth;
      } // end of else
       
    } // end of if

    // Otherwise, if there are no empty characters,
    // return 0.
    else if(isFull(brd)){
      return 0;
    } // end of else if 
    
    // Otherwise, do the minMax function of the 
    // opposite player.   
    else {
      return minMax(brd,depth+1,!participant);
    } // end of else.
    
  } // end of sc function
  
  // The minMax function bascially finds all the
  // outcomes of the minimum and maximum scores for
  // game board. The maximum score that is found
  // will be the best move that the computer or AI
  // chooses to win or block the opponent. 
  // The source of the min-max algorithm is directed
  // below.
  // Link: http://neverstopbuilding.com/minimax
  function minMax(brd,depth,participant){
    // If the paricipant is the 1st player, ch gets
    // t.getCh(). Otherwise, ch gets t.getOch().
    var ch = participant===t.getHuman() ? t.getCh()
          : t.getOch();    
    var best= -Infinity;
    var num=0;
    var score;
    var newbrd;
    
    // If the participant is the computer, finding the
    // maximum score gets executed.
    if(!participant){
      // Find the maximum score in a for loop.
      for(var i=0; i<9; i++){
        // Find the maximum score if the index is
        // ''.
        if(brd[i]===''){
          newbrd=brd.slice(0);
          newbrd[i]=ch;

          // Recursively return the score.
          score = sc(newbrd,depth,participant);  

          // If score is greater than best, best
          // gets score and num gets i.
          if(score > best){
            best = score;
            num = i;
          } // end of if
        } // end of if
      } // end of for
    } // end of if
    
    // Otherwise, find the minimum score of the first
    // player.
    else {
      best=Infinity;
      
      // Find the minimum score in a for loop.
      for(var j=0; j<9; j++){
        // Find the minimum score if the index
        // is ''.
        if(brd[j]===''){
          newbrd=brd.slice(0);
          newbrd[j]=ch;

          // Recursively return the score.
          score = sc(newbrd,depth,participant);  

          // If score is less than best, best gets
          // score and num gets j.
          if(score < best){
            best = score;
            num = j;
          } // end of if
        } // end of if
      } // end of for
    } // end of else   
    
    // If depth is 0, display the best move
    // for the computer.
    if(depth===0){
      choose(num,t.getOpt());
    } // end of if
    
    return best;
    
  } // end of minMax function
  
  // This function displays all squares 
  // with '' characters.
  function reset(){
    // Display '' characters in all
    // 9 squares.
    for(var i=0; i<9;i++){
      cbd[i]='';
      $("#"+String(i)).html("");     
    } // end of for
    fsfl=0;
  } // end of reset function
  
  // If this is clicked, then first player will
  // choose his own character.
  $("#cb").click(function(){
    // If the game is off, then the first player
    // chooses his character.
    if(!t.getGame()){
      t.setCp(true);
      $("#cb").hide();
      $("#pb").hide();
      $("#hw").hide();
      $("#cp").show();
      $("#oc").show();
      $("#xc").show();      
    } // end of if
  }); // end of function
  
  // If this gets clicked, the first player plays 
  // with another player(not the computer).
  $("#pb").click(function(){
    // If the game is off, the first player gets 
    // to play with another player.
    if(!t.getGame()){
      t.setCp(false);
      $("#cb").hide();
      $("#pb").hide();  
      $("#hw").hide();
      $("#hp").show();
      $("#oc").show();
      $("#xc").show();       
    } // end of if
  }); // end of function
  
  // If this gets clicked, then the first player
  // gets 'O'.
  $("#oc").click(function(){
    // If the game is off, the first player gets 'O'
    // while the opponent gets 'X'.
    if(!t.getGame()){
      t.setCh('O');
      t.setOch('X');
      $("#oc").hide();
      $("#xc").hide();
      $("#hp").hide();
      $("#cp").hide();
      $("#ft").show();
      
      // If the computer is in the game, the player 
      // decides who goes first.
      if(t.getCp()){
        $("#cpu").show();
        $("#hm").show();       
      } // end of if
      
      // Otherwise, the player or the opponent decide
      // who goes first.
      else {
        $("#fhm").show();
        $("#shm").show();        
      } // end of else
    } // end of if
  }); // end of function

  // If this gets clicked, then the first player
  // gets 'X'.  
  $("#xc").click(function(){
    // If the game is off, the first player gets 'X'
    // while the opponent gets 'O'.    
    if(!t.getGame()){
      t.setCh('X');
      t.setOch('O');
      $("#oc").hide();
      $("#xc").hide();
      $("#hp").hide();
      $("#cp").hide();
      $("#ft").show();  
      
      // If the computer is in the game, the player 
      // decides who goes first.      
      if(t.getCp()){
        $("#cpu").show();
        $("#hm").show();       
      } // end of if
      
      // Otherwise, the player or the opponent decide
      // who goes first.      
      else{
        $("#fhm").show();
        $("#shm").show();        
      } // end of else     
    } // end of if    
  }); // end of function
  
  // If this gets clicked, then the first player
  // goes first.
  $("#hm").click(function(){
    // If the game is off, then the first player
    // goes first.
    if(!t.getGame()){
      t.setFirst(true);
      $("#hm").hide();
      $("#cpu").hide();
      $("#ft").hide();
      $("#hmt").show();
      $("#rst").show();
      t.setGame(true);
    } // end of if
  }); // end of function
  
  // If this gets clicked, then the cpu goest first.
  $("#cpu").click(function(){
    // If the game is off, then the computer goes
    // first.
    if(!t.getGame()){
      t.setFirst(false);
      $("#hm").hide();
      $("#cpu").hide();
      $("#ft").hide();
      $("#rst").show();
      t.setGame(true);
      pl(0);
    } // end of if
  }); // end of function  
  
  // If this gets clicked, then the first player
  // goes first.
  $("#fhm").click(function(){
    // If the game is off, the first player goes
    // first.
    if(!t.getGame()){
      t.setFirst(true);
      $("#fhm").hide();
      $("#shm").hide();
      $("#ft").hide();
      $("#fhmt").show();
      $("#rst").show();
      t.setGame(true);      
    } // end of if
  }); // end of function 
  
  // If this gets clicked, then the second player 
  // goes first.
  $("#shm").click(function(){
    // if the game is off, the second player goes 
    // first.
    if(!t.getGame()){
      t.setFirst(false);
      $("#fhm").hide();
      $("#shm").hide();
      $("#ft").hide();
      $("#shmt").show();
      $("#rst").show();
      t.setGame(true);      
    } // end of if
  }); // end of function
  
  // If this gets clicked, then the game resets to
  // to the beginning.
  $("#rst").click(function(){
    reset();
    $("#hmt").hide();
    $("#fhmt").hide();
    $("#shmt").hide();
    $("#rst").hide();
    $("#hmw").hide();
    $("#cpw").hide();
    $("#fhmw").hide();
    $("#shmw").hide();
    $("#dr").hide();
    t.setGame(false);
    $("#hw").show();
    $("#cb").show();
    $("#pb").show();
  }); // end of function
  
}); // end of $(document).ready function

// Create a tc class for the game board.
var tc=function(){
  var game=false,player, ch,
      och,first,next;
  var human=true, opponent=false;
  
  // This is for setting the game.
  this.setGame=function(s){
    game=s;
    return game;
  };
  
  // This gets the state of the game.
  this.getGame=function(){
    return game;
  };
  
  // This sets if the computer is in the
  // game.
  this.setCp=function(b){
    player=b;
    return player;
  };
  
  // This gets the status of the computer.
  this.getCp=function(){
    return player;
  };
  
  // This sets the character for the
  // first player.
  this.setCh=function(c){
    ch=c;
    return ch;
    
  };
  
  // This gets the first player's character.
  this.getCh=function(){
    return ch; 
  };
  
  // This sets the opponent's character.
  this.setOch=function(oc){
    och=oc;
    return och;
  };
 
  // This gets the opponent's character.
  this.getOch=function(){
    return och;
  };
 
  // This sets whoever goes first.
  this.setFirst=function(f){
    first=f;
    return first;
  };
  
  // This gets on who goes first.
  this.getFirst=function(){
    return first;
  };
  
  // This sets who goes next.
  this.setNext=function(n){
    next=n;
    return next;  
  };
  
  // This gets the value of the player's turn.
  this.getNext=function(){
    return next;
  };
  
  // This gets the value of human.
  this.getHuman=function(){
    return human;
  };
  
  // This gets the value of the opponent.
  this.getOpt=function(){
    return opponent;
  };
}; // end of tc function