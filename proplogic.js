// Propositional logic utilities


// Checks whether two forms (in array representation) are equal
function equalFmls(f1,f2){
    if(f1[0]!=f2[0])   // Checking the main operator
	return false; 
    if(f1[0]=="at")    // for atoms, check only the variable
	return (f1[1]==f2[1])
    else if(f1[0]=="neg")      // negations
	return (equalFmls(f1[1],f2[1])) 
    else return (equalFmls(f1[1],f2[1]) && equalFmls(f1[2],f2[2])) // others
}

// Given a formula in array representation, prints it in LaTeX notation
function toLaTeX(fml){
    var op = fml[0];
    var left ="";
    var right ="";
    var opL="";
    var opR="";
    if(op=="imp"){  // implication
	opL=fml[1][0];
	opR=fml[2][0];
	if(opL=="imp"){ // implication at the left
	    left=" \\left( "+toLaTeX(fml[1])+" \\right) ";
	} else {
	    left=toLaTeX(fml[1]);
	}
	if(opR=="imp"){ // implication at the left
	    right=" \\left( "+toLaTeX(fml[2])+" \\right) ";
	} else {
	    right=toLaTeX(fml[2]);
	}	
	return left+" \\to "+right;
    } else if(op=="dis"){
	opL=fml[1][0];
	opR=fml[2][0];
	if(opL=="imp" || opL=="dis"){
	    left=" \\left( "+toLaTeX(fml[1])+" \\right) ";
	} else {
	    left=toLaTeX(fml[1]);
	}
	if(opR=="imp"){
	    right=" \\left( "+toLaTeX(fml[2])+" \\right) ";
	} else {
	    right=toLaTeX(fml[2]);
	}
	return left+" \\vee "+right;
    } else if(op=="con"){
	opL=fml[1][0];
	opR=fml[2][0];
	if(opL=="imp" || opL=="dis" || opL=="con"){
	    left=" \\left( "+toLaTeX(fml[1])+" \\right) ";
	} else {
	    left=toLaTeX(fml[1]);
	}
	if(opR=="imp" || opR=="dis"){
	    right=" \\left( "+toLaTeX(fml[2])+" \\right) ";
	} else {
	    right=toLaTeX(fml[2]);
	}
	return left+" \\wedge "+right;
    } else if(op=="neg"){
	opL=fml[1][0];
	if(opL!="at"){
	    left="\\left("+toLaTeX(fml[1])+"\\right)";
	} else {
	    left=toLaTeX(fml[1]);
	}
	return " \\lnot "+left;
    } else
	return fml[1];    
}



// Given a formula in array representation, prints it in LaTeX notation
function toHTML(fml){
    var op = fml[0];
    var left ="";
    var right ="";
    var opL="";
    var opR="";
    if(op=="imp"){  // implication
	opL=fml[1][0];
	opR=fml[2][0];
	if(opL=="imp"){ // implication at the left
	    left="("+toHTML(fml[1])+")";
	} else {
	    left=toHTML(fml[1]);
	}
	if(opR=="imp"){ // implication at the left
	    right="("+toHTML(fml[2])+")";
	} else {
	    right=toHTML(fml[2]);
	}	
	return left+"&rarr;"+right;
    } else if(op=="dis"){
	opL=fml[1][0];
	opR=fml[2][0];
	if(opL=="imp" || opL=="dis"){
	    left="("+toHTML(fml[1])+")";
	} else {
	    left=toHTML(fml[1]);
	}
	if(opR=="imp"){
	    right="("+toHTML(fml[2])+")";
	} else {
	    right=toHTML(fml[2]);
	}
	return left+"&or;"+right;
    } else if(op=="con"){
	opL=fml[1][0];
	opR=fml[2][0];
	if(opL=="imp" || opL=="dis" || opL=="con"){
	    left="("+toHTML(fml[1])+")";
	} else {
	    left=toHTML(fml[1]);
	}
	if(opR=="imp" || opR=="dis"){
	    right="("+toHTML(fml[2])+")";
	} else {
	    right=toHTML(fml[2]);
	}
	return left+"&and;"+right;
    } else if(op=="neg"){
	opL=fml[1][0];
	if(opL!="at"){
	    left="("+toHTML(fml[1])+")";
	} else {
	    left=toHTML(fml[1]);
	}
	return "&not;"+left;
    } else
	return fml[1];    
}
