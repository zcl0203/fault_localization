var fs = require("fs");
var esprima = require("esprima");
var readline = require('readline');

var traceData = getTrace();

var result = findRootCause(traceData);

var rootCause = result[0];
var errorStack = result[1];
console.log("\n\n");
console.log(rootCause);
console.log("\n\n");
console.log(errorStack);
console.log("\n\n");

/**
 * @输入trace信息
 * @param1 traceData
 * @return rootCause
 */
function findRootCause(traceData) {

    var rootCause = [];
    var errorStack = []; //save the propogation router

    const trace = traceData.trace;
    var errorMessage = traceData.errorMessage; //error point at where the program crash
    const currScript = traceData.currScript; //the file of the collapsed program
    const funcRetVar = traceData.funcRetVar; //the variable that function return null

    while (!rootCause.length) {
        errorStack.push(JSON.stringify(errorMessage));
        if (!trace.length) {
            break;
        }
        //every invocation of the function will update the errorMessage
        var result = findPrevError(errorMessage, trace, currScript, funcRetVar); 
        var errorMessage = result[0];
		rootCause = result[1];
    }
    return [rootCause, errorStack];
}

function findPrevError(errorMessage, trace, currScript, funcRetVar) {

    var tr = findTrace(errorMessage, trace); //find the corresponding trace
    
    var loc = parseLine(tr.line); //get the line and column number of the null position in the trace
    
    var astbody = findCodeLine(loc, currScript, tr); // get the ast structure of the trace generate line
    // [errorMessage, rootCause]
    var result = updateError(errorMessage, astbody, tr, funcRetVar);
    

    return result;
}

/**
 *input: errorMessage, trace
 *output: the corresponding trace
 */
function findTrace(errorMessage, trace) {
    var tr;
    for (var i = trace.length - 1; i >= 0; i--) {
        if (trace[i].func === errorMessage.error_func && trace[i].name === errorMessage.error_variable) {
            tr = trace[i];
            trace.pop();
            break;
        }
        trace.pop();
    }
    return tr;
}


/**
 *input: line, fileName
 *output: the corresponding code line
 */
function findCodeLine(loc, fileName, tr) {
    var ast = esprima.parseScript(fs.readFileSync(fileName, "utf-8"), { loc: true }); //get the ast of the script, and create ast with line number
    var astBody = ast.body;
    var astbody;    

    if (tr.func === "global") {
        for (var j = 0; j < astBody.length; j++) {
            if (astBody[j].loc.start.line === loc.start.line) {            	
                astbody = astBody[j];
            }
        }
    } else { //step into the corresponding function
        for (var j = 0; j < astBody.length; j++) {

            if (astBody[j].type == "FunctionDeclaration" && loc.start.line >= astBody[j].loc.start.line && loc.end.line <= astBody[j].loc.end.line) {
                var body = astBody[j].body.body;
                for (var t = 0; t < body.length; t++) {

                    if (body[t].loc.start.line === loc.start.line) {
                    	astbody = body[t];
                    }
                }
            }
        }
    }

    return astbody;
}

function updateError(errorMessage, astbody, tr, funcRetVar) {
    var rootCause = [];

    if (astbody.type === "ExpressionStatement" && astbody.expression.type === "AssignmentExpression" && astbody.expression.left.name == errorMessage.error_variable) {

        var right = astbody.expression.right;
        // console.log(right);
        switch (right.type) {
            case 'Literal': //a = num/string/null...
                if (right.value === null) {
                    errorMessage.error_variable = errorMessage.error_variable;
                    errorMessage.error_line = tr.line;
                    errorMessage.error_func = tr.func;
                    rootCause.push(JSON.stringify(errorMessage));
                }
                break;
            case 'Identifier': // a = b;
                errorMessage.error_variable = right.name;
                errorMessage.error_line = tr.line;
                errorMessage.error_func = tr.func;
                break;
            case 'CallExpression': //a = f();
                var func = right.callee.name;
                if (isNative(func)) {
                    errorMessage.error_variable = errorMessage.error_variable;
                    errorMessage.error_line = tr.line;
                    errorMessage.error_func = tr.func;
                    rootCause.push(JSON.stringify(errorMessage));
                } else {
                    for (var m = 0; m < funcRetVar.length; m++) {
                        item = funcRetVar[m];

                        if (item.func === func) {
                            errorMessage.error_variable = item.variable;
                            // errorMessage.error_line = item.line;
                            errorMessage.error_func = item.func;
                            errorMessage.error_line = tr.line;
                        }
                    }
                }
                break;
        }
    } else if (astbody.type === "VariableDeclaration") {
        for (var k = 0; k < astbody.declarations.length; k++) {
            if (astbody.declarations[k].id.name === errorMessage.error_variable && astbody.declarations[k].init.type) {

                switch (astbody.declarations[k].init.type) {
                    case 'Literal': //var a = num/string/null...
                        if (astbody.declarations[k].init.value === null) {
                            errorMessage.error_variable = errorMessage.error_variable;
                            errorMessage.error_line = tr.line;
                            errorMessage.error_func = tr.func;
                            rootCause.push(JSON.stringify(errorMessage));
                        }
                        break;
                    case 'Identifier': //var a = b;
                        errorMessage.error_variable = astbody.declarations[k].init.name;
                        errorMessage.error_line = tr.line;
                        errorMessage.error_func = tr.func;
                        break;
                    case 'CallExpression': //var a = f();
                        var func = astbody.declarations[k].init.callee.name;
                        if (isNative(func)) {
                            errorMessage.error_variable = errorMessage.error_variable;
                            errorMessage.error_line = tr.line;
                            errorMessage.error_func = tr.func;
                            rootCause.push(JSON.stringify(errorMessage));
                        } else {
                            for (var m = 0; m < funcRetVar.length; m++) {
                                item = funcRetVar[m];

                                if (item.func === func) {
                                    errorMessage.error_variable = item.variable;
                                    // errorMessage.error_line = item.line;
                                    errorMessage.error_func = item.func;
                                    errorMessage.error_line = tr.line;
                                }
                            }
                        }
                        break;
                }
            }
        }
    }

    return [errorMessage, rootCause];
}






//preparation stage, get the trace saved in the file
function getTrace() {
    var fileName = process.argv.splice(2)[0]; //trace saved file
    var traceData = JSON.parse(fs.readFileSync(fileName, "utf-8")); //read trace data
    return traceData;
}

//parse the line number to the format of esprima in order to search for the corresponding code line	
function parseLine(line) {
    var parseline = line.split(")")[0].split(":");
    var loc = {};
    loc.start = {};
    loc.end = {};
    loc.start.line = parseInt(parseline[1]);
    loc.start.column = parseInt(parseline[2]) - 1;
    loc.end.line = parseInt(parseline[3]);
    loc.end.column = parseInt(parseline[4]) - 1;

    return loc;
}

//determine whether a function is a native function
function isNative(fn) {
    return (/\{\s*\[native code\]\s*\}/).test('' + fn);
}