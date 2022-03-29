// Array with the solution to the truth table
var solution;


/*

Library for the TruthTables script

The information of the truthtable is stored in an array which contains
the list of formulas and the dependencies. 

The format of the array 'arr':
- arr[0] : array of formulas (in array representation)
- arr[1] : information of alive (1) or dead (0) formulas
- arr[2] : information about dependencies of each formula

Given an index 'i',
- arr[0][i] containt the formula number 'i'
- arr[1][i] indicates if the formula is 'alive' (not repeated after)
- arr[2][i][0] indicates the first dependency (all except atoms)
- arr[2][i][1] indicates the second dependency (all except atoms and negations)

Some functions are used to manipulate the list. 

*/


/*
  This is the main formula to construct the array. 
  The input is a formula in array representation.
*/
function subForms(Fml){
    var arr = new Array();
    arr[0] = new Array(); // for formulas
    arr[1] = new Array(); // for alive
    arr[2] = new Array(); // for dependencies

    // creates lists 0 and 0 and return number of formulas
    var size = subFAux(Fml, arr[0], arr[2], 0);   
    
    // remove rpeated formulas
    checkAlive(arr);
    return arr;    
    
}

// auxiliary function
// Fml: the formula to process
// arr: the array to write the formulas
// dep: the array to write the dependencies
// initIndex: number of the following formula to write
function subFAux(Fml, arr, dep, initIndex){
    var op = Fml[0];  // operator
    arr[initIndex]=Fml; // includes the formula
    dep[initIndex]= new Array();
    if(op=="at"){	           // if atom
	dep[initIndex][0] = null;  // not dependencies
	dep[initIndex][1] = null;
	return initIndex+1;
    } else if(op=="neg"){          // if negation
	dep[initIndex][0] = initIndex+1; // one dependencie
	dep[initIndex][1] = null;
	return subFAux(Fml[1], arr, dep, initIndex+1); // continue
    } else { // other case
	var n = subFAux(Fml[2], arr, dep, initIndex+1); 
	dep[initIndex][1] = initIndex+1;  // two dependencies
	dep[initIndex][0] = n;             
	return subFAux(Fml[1], arr, dep, n);
    }
}


/* 
   
   We want to remove repetitions on the list, to include just once
   each formula in the truth table. This functions manipulates the 
   list to remove (alive=0) repeated formulas and update pointers
   to them. 

*/
function checkAlive(arr){
    var i=0;
    var j=0;
    for(i=0;i<arr[0].length;i++){  // we visit all formulas
	arr[1][i]=1;
	for(j=i+1;j<arr[0].length;j++){  // check the following
	    if(equalFmls(arr[0][i], arr[0][j])){ // matching
		arr[1][i]=0;   // alive=0
		// change dependencies pointing to it
		var k=0;
		for(k=0;k<arr[0].length;k++){ // visits all formulas
		    if(arr[2][k][0]==i) // changes pointers
			arr[2][k][0]=j; // to the removed one
		    if(arr[2][k][1]==i) // if any exists
			arr[2][k][1]=j;
		}
	    }
	}
    }
}

/*

  This is the main function to create the truth table. 
  It solves it while creating and stores the 'solution' list
  for later validation. 

*/
function print_table(arr){

    // restarts the global variable (overwrite previous solutions)
    solution= new Array();

    // CREATING THE HEADING

    // 'columns' indicates which is the formula (in 'arr') which
    // corresponds to each column in the table
    var columns = new Array(); 
    var atoms = 0; // number of atoms
    var nextCol=0; // next colums to create
    
    // 'outout' will store the table HTML code
    var output ="";
    var i=0; 
    for(i=arr[0].length-1;i>=0;i--){ // looking for atoms 
	if(arr[1][i]==1 && arr[0][i][0]=="at"){
	    // Creates the LaTeX encoding
	    output=output+"<td>"+"$$"+toLaTeX(arr[0][i])+"$$</td>";	    
	    atoms++; // new atom
	    columns[nextCol]=i; // reference to the formula
	    nextCol++;          
	}
    }
    for(i=arr[0].length-1;i>=0;i--){ // including other formulas
	if(arr[1][i]==1 && arr[0][i][0]!="at"){
	    output=output+"<td>"+"$$"+toLaTeX(arr[0][i])+"$$</td>";
	    columns[nextCol]=i;
	    nextCol++;
	}
    }

    output = "<tr valign='bottom'>"+output+"</tr>"; // heading

    // CREATING OTHER ROWS
    var newRow;  // to write the HTML of the row
    var n=0;     // number of the row, from 0 to 2^atoms-1
    for(n=0;n<Math.pow(2,atoms);n++){
	newRow = "";
	nBin = toBinary(n,atoms);  // binary representation
	
	var cells = new Array();   // correct value of each cell
	
	// Calculating the row
	var f = 0;

	for(f=0;f<nextCol;f++){
	    if(f<atoms){ // the binary representation feeds the atoms
		cells[f]=nBin[f];

		// The correct value is included
		newRow=newRow+"<td>"+cells[f]+"</td>";

	    } else {
		// Calculating the value of a formula
		var nf = columns[f]; // number of the formula in 'arr'
		var d1, d2;     // number of the dependencies 1 and 3
		var dep1, dep2; // to store values of the dependencies
		
		if(arr[0][nf][0] == "neg"){ // NEGATIONS
		    d1 = arr[2][nf][0];     // number of the child
		    for(m=0;m<f;m++){
			if(columns[m]==d1)   // looks for it
			    dep1=cells[m]; } // gets the value
		    cells[f]=1-dep1; // calculates the negation
		} else { // BINARY OPERATORS 
		    d1 = arr[2][nf][0]; // dependencie 1 (formula number)
		    d2 = arr[2][nf][1]; // dependencie 2 (formula number)
		    
		    // look at the values
		    var m=0;
		    for(m=0;m<f;m++){
			if(columns[m]==d1) // first
			    dep1=cells[m];
			if(columns[m]==d2) // second
			    dep2=cells[m];
		    }		    
		    // Composing the value:
		    var op = arr[0][nf][0]; // operator
		    
		    if(op=="dis"){
			if(dep1 || dep2)
			    cells[f]=1;
			else 
			    cells[f]=0;
		    }
		    if(op=="con"){
			if(dep1 && dep2)
			    cells[f]=1;
			else 
			    cells[f]=0; }
		    if(op=="imp"){
			if(dep1==0 || dep2==1)
			    cells[f]=1;
			else 
			    cells[f]=0; }
		}		
		// input form for the new cell
		newRow=newRow+"<td id='c"+solution.length+"'>"+
		"<input type=text id='s"+solution.length+"' size=1>"+"</td>";
		
		// Storing the actual solution
		// hopping the user doesn't have a debugger ;-)
		solution[solution.length]=cells[f];		
	    }
	}
	// Whole row
	newRow="<tr valign='bottom' align='center'>"+newRow+"</tr>";
	
	// put the row in the table
	output=output+newRow;
    }

    // Code of the table
    return "<form name='Tab'><table border=1 valign='bottom' cellspacing=0 cellpadding=6>"+output+"</table></form>";

}

/*
  The function to validate the numbers written by the user
*/

function validateTable(){
    var i = 0;    
    var inpValue; 
    var errors=0; // counts errors
    for(i=0;i<solution.length;i++){
	inpValue = document.getElementById("s"+i).value;  // user value
	if(inpValue=="" || inpValue!=solution[i]){ // compare to the actual
	    // if fails, change color and increase counter
	    document.getElementById("c"+i).bgColor="#FF0066";	    
	    errors++;
	}
	// writes the solution in any case
	document.getElementById("c"+i).innerHTML=solution[i];
    }

    // Informing the user about the number of errors
    var message="";
    if(errors==0){
	message="Congratulations! No errors found.";
    } else
	message="Errors: "+errors;
    document.getElementById("warning").innerHTML=message;
}


// to read a formula from the user's input 
function readFml(form){
    
    try{
	// lowercase the remove white spaces
	var fml=form.toLowerCase().replace(/\s*/g, "");
	// parse the formula
	var pFml=parser.parse(fml);

	// removes previous warnings if any
	document.getElementById("warning").innerHTML="";
	
	// prints the table in the MathJax box
	document.getElementById("MathOutput").innerHTML=print_table(subForms(pFml));

	// Creates the validate button
	var validButt = "<input type='button' onclick='validateTable()' value='Validate' />"
	// Puts it in its place
	document.getElementById("valid").innerHTML=validButt;
    
    }
    catch(err) // if some error...
    { // ...it's an user error!! Tell her to stick to the syntax! 
	document.getElementById("warning").innerHTML="Error: Check the syntax of the formula";
    }
}


// Given a natural number returns the binary representation 
// with the given number of atoms
function toBinary(number, atoms){
   a1 = new Array();
   var i=0;
   for(i=0;i<atoms;i++) { a1[i]=0 }
   return toBinary_aux(number, a1, atoms-1);
}
// auxiliary function
function toBinary_aux(number, array, pos){
   if(number==0){
     return array;
   } else {
     array[pos]=number%2;
     return toBinary_aux(Math.floor(number/2), array, pos-1);
   }
}

// Show/hide instructions text
function toggle() {
    var ele = document.getElementById("toggleText");
    var text = document.getElementById("displayText");
    if(ele.style.display == "block") {
	ele.style.display = "none";
	text.innerHTML = "Show info";
    }
    else {
	ele.style.display = "block";
	text.innerHTML = "Hide info";
    }
} 
