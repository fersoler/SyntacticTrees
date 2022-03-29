/*

  Functions used by parser.js to obtain an array representation 
  of a propositional formula

  Each formula is an array 'f' where:
  - f[0] is the name os the main operator: 'at' (atom), 'neg', 
  'dis', 'con', 'imp'.
  - f[1] is the left subformula (or the atom)
  - f[2] is the right subformula (if any)

*/

function fml_imp(f1,f2){
    var f = new Array();
    f[0] = "imp";
    f[1] = f1;
    f[2] = f2;
    return f;
}

function fml_dis(f1,f2){
    var f = new Array();
    f[0] = "dis";
    f[1] = f1;
    f[2] = f2;
    return f;
}

function fml_con(f1,f2){
    var f = new Array();
    f[0] = "con";
    f[1] = f1;
    f[2] = f2;
    return f;
}

function fml_neg(f1){
    var f = new Array();
    f[0] = "neg";
    f[1] = f1;
    return f;
}

function fml_at(f1){
    var f = new Array();
    f[0] = "at";
    f[1] = f1;
    return f;
}
