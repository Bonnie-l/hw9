/*Author: Bonnie Liu
Email:yueying_liu@student.uml.edu
Student_id: 01661781
 */
const numberLetters=7;
const DOUBLE_WORD=2;
const DOUBLE_LETTER=-2;
var pieces = JSON.parse(piecesJson);
var board=[0,0,DOUBLE_WORD,0,0,0,DOUBLE_LETTER,0,DOUBLE_LETTER,0,0,0,DOUBLE_WORD,0,0];
var busy=[];
var placedOnBoard=[];
var usedInRound=[];
var totalScore=0;
var words=[];
var nWords=0;


//set initial "busy" to not busy for all letters
for(i=0;i<100;i++)
	busy[i]=0;
//set initial board state to "empty"
for(i=0;i<board.length;i++)
	placedOnBoard[i]=-1;

//select random value from 0 to 99
function getRandom() {
return Math.floor(Math.random()*100);
}


//generate letters for hand
function generateSet(amount)
{
  //generate set of numbers (different):
  var numbers=[];  
  var i=0;
  while(i<amount)
  {
	t=getRandom();
	if(busy[t]==0) //if not busy=>can use
	{
		numbers[i]=t;
		busy[t]=1;
		i++;
	}
  }
  
  //convert to letters' indexes:
  var resSet=[];
  for(i=0;i<amount;i++)
  {
	  s=0;
	  j=0;
	  while(s+pieces[j].amount<numbers[i])
	  {
		  s+=pieces[j].amount; //accomulate relative position letter in alphabet
		  j++;
	  }
	  resSet[i]=j;
  }
  return resSet;
}

//draw board in corresponding to board array
function drawBoard()
{
	var str="";
	for(i=0;i<board.length;i++)
	{
		switch(board[i])
		{
			case 0: name="board_empty.png"; break;
			case DOUBLE_WORD: name="board_w2.png"; break;
			case DOUBLE_LETTER: name="board_l2.png"; break;
		}
		str=str+'<img class="boardPart" src="images/'+name+'" id="board'+(i+1)+'">';
	}
	$('#board').html(str);
}

//draw letters from generated indexes
function drawSet(setIndex)
{
	var parent=$('#pieceHolder');
	var str="";
	for(i=0;i<setIndex.length;i++)
		str=str+' <img class="letter" src="images/Scrabble_Tile_'+pieces[setIndex[i]].letter+'.jpg" alt="'+pieces[setIndex[i]].letter+'" id="letter'+(setIndex[i])+'">';
	parent.html(str+parent.html());
}



/*find score of the given words*/
function calc(){		
	var words=[];
	var wordsScore=[];
	var nWords=0;
	var isNewWord=1;
	var isDouble=1;
	var score=0;
	for(i=0;i<board.length;i++)
		if(placedOnBoard[i]>=0)
		{
			if(isNewWord==1) //first letter after empty
			{
				nWords++; //increase amount words
				isNewWord=2; //set state to middle of the word
				words[nWords-1]="";
				wordsScore[nWords-1]=0;
			}
			words[nWords-1]+=pieces[placedOnBoard[i]].letter;
			wordsScore[nWords-1]+=pieces[placedOnBoard[i]].value;
			if(board[i]==DOUBLE_LETTER)
			   wordsScore[nWords-1]+=pieces[placedOnBoard[i]].value;
			if(board[i]==DOUBLE_WORD)
			   isDouble=2;
		}
		else
		{
		 if(isNewWord==2) //if empty is end of word =>multiply score of word, if needed:
		   {
			 wordsScore[nWords-1]*=isDouble;
			 isNewWord=1;
			 //set initial values to isDouble:
			 isDouble=1;
			 score+=wordsScore[nWords-1];
		   }
		  
		}
	//check for last word:
	if(isNewWord==2) //if empty is end of word =>multiply score of word, if needed:
	   {
		 wordScore[nWords-1]*=isDouble;
		 score+=wordScore[nWords-1];
	   }
	return score;
}

//remove letter with selected number from used list
function remove(arr, item) {
    for (var i = arr.length; i--;) {
        if (arr[i] === item) {
            arr.splice(i, 1);
        }
    }
}

function addLetters()
{
	totalScore+=calc();
	//clear board:
	var countRemoved=$('.beCleared').length;
	$('.beCleared').remove();
	//add letters:
	var addSet=generateSet(countRemoved);
	drawSet(addSet);
	//clear style:
	$('.board').removeClass("hover");
	$('.board').addClass("normal");
	$('.board').removeClass("active");
}


/*check existing words*/
function checkWords(){		
	var wordsScore=[];
	var isNewWord=1;
	var isDouble=1;
	var score=0;
	for(i=0;i<board.length;i++)
		if(placedOnBoard[i]>=0)
		{
			if(isNewWord==1) //first letter after empty
			{
				nWords++; //increase amount words
				isNewWord=2; //set state to middle of the word
				words[nWords-1]="";
			}
			words[nWords-1]+=pieces[placedOnBoard[i]].letter;
			wordsScore[nWords-1]+=pieces[placedOnBoard[i]].value;			
		}
		else
		{
		 if(isNewWord==2) //if empty is end of word =>multiply score of word, if needed:
		   {			 
			 isNewWord=1;
			 //set initial values to isDouble:
			 isDouble=1;
			}
		  
		}
	//read file:
	jQuery.get('/usr/share/dict/words', function(data) {
		for(i=0;i<nWords;i++)
		{
			expr=new RegExp('(^|\\s)' + words[i] + '(?=\\s|$)', 'g');
			if(re.test(data)==0)
				alert(words[i]+" did not exist in the dictionary");
		}
	});
}

function AddEventListeners() {
    $("#new").click(function() {
        location.reload();
    });
    
     $('#check').click(function(){
        checkWords();
    });
    $('#nextRound').click(function(){
        addLetters();$('.letter').draggable();
    });
}

$(function() {
    drawBoard();
    var mySet=generateSet(7);
    drawSet(mySet);
    $('.letter').draggable();
    
    
    $('.boardPart').droppable({
        drop: function(event, ui) {
            $(this).removeClass("hover");
            $(this).removeClass("normal");
            //set index of letter into corresponding item of the board:
            indexBoard=$(this).attr('id').substr(5);
            indexLetter=ui.draggable.attr('id').substr('id').substr(6);
            ui.draggable.addClass("beCleared");
            placedOnBoard[indexBoard-1]=indexLetter;
            $(this).addClass("active");
            $('#Score').html(calc()+totalScore);
            //ui.draggable( "enable" );
        },
        over: function(event, ui) {
            $(this).removeClass("active");
            $(this).removeClass("normal");
            $(this).addClass("hover");
            
        },
        out: function(event, ui) {
            $(this).removeClass("hover");
            $(this).removeClass("active");
            $(this).addClass("normal");
            indexBoard=$(this).attr('id').substr(5);
            indexLetter=ui.draggable.attr('id').substr('id').substr(6);
            placedOnBoard[indexBoard-1]=-1;
            $('#Score').html(calc()+totalScore);
            ui.draggable.removeClass("beCleared");
        }
        
    });
  AddEventListeners();
    
});
