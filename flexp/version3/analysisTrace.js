var fs = require("fs");
var esprima = require("esprima");

var rootCause = [];
var errorStack = []; //save the propogation router

var traceData = getTrace();

findRootCause(traceData); //update rootCause and errorStack


console.log("\n\n");
console.log("rootCause:");
console.log(rootCause);
console.log("\n\n");
console.log("errorStack:");
console.log(errorStack);
console.log("\n\n");

/**
 * @输入trace信息
 * @param1 traceData
 * @return rootCause
 */
function findRootCause(traceData) {    
 
    var trace = traceData.trace;
    var errorMessage = traceData.errorMessage; //error point at where the program crash
    const currScript = traceData.currScript; //the file of the collapsed program
    const funcRetVar = traceData.funcRetVar; //the variable that function return null
    const funcArgsVar = traceData.funcArgsVar;

    while (!rootCause.length) {
        errorStack.push(JSON.stringify(errorMessage));
        if (!trace.length) {
            break;
        }
        //every invocation of the function will update the errorMessage
        var result = findPrevError(errorMessage, trace, currScript, funcRetVar, funcArgsVar); 
        errorMessage = result[0];
		rootCause = result[1];
    }
   
}

function findPrevError(errorMessage, trace, currScript, funcRetVar, funcArgsVar) {
	//console.log(errorMessage);
    var tr = findTrace(errorMessage, trace, currScript, funcArgsVar); //find the corresponding trace
    //console.log(tr);
  
    var loc = parseLine(tr.line); //get the line and column number of the null position in the trace
    
    var astbody = findCodeLine(currScript, loc.start.line); // get the ast structure of the trace generate line
	
    // console.log(astbody);
    // [errorMessage, rootCause]
    var result = updateError(errorMessage, astbody, tr, funcRetVar);
    
    return result;
}

/**
 *input: errorMessage, trace
 *output: the corresponding trace 
 */
function findTrace(errorMessage, trace, currScript, funcArgsVar) {
    var tr;
    // convert error variable to object style
    var obj = varToObj(errorMessage.error_variable);
    var base = obj[0];
    var offset = obj[1];
    
    for (var i = trace.length - 1; i >= 0; i--) {
    	
        if (trace[i].func === errorMessage.error_func) {
            if(trace[i].name.base === "args") { 

                var index = getIndexOfFunctionArgs(getLineNum(trace[i].line), offset, currScript); 

                if(index == trace[i].name.offset) {                    
                    //get the line of function arguments, set the error variable to the arguments passed to the function
                    var j = funcArgsVar.length - 1;
                    while(j >= 0) {                         
                        if(funcArgsVar[j].currFunc === trace[i].func && funcArgsVar[j].index === index) {                           
                            errorMessage.error_variable = funcArgsVar[j].argVar;
                            errorMessage.error_func = funcArgsVar[j].prevFun;
                            errorMessage.error_line = trace[i].line;
                            errorStack.push(JSON.stringify(errorMessage));
                            obj = varToObj(errorMessage.error_variable);
                            base = obj[0];
                            offset = obj[1];
                            break;
                        }
                        j--;
                    }
                }
            } else if(trace[i].name.base === base && trace[i].name.offset === offset) {               
                tr = trace[i];
                trace.pop();
                break;
            }
            
        }
        trace.pop();
    }
    return tr;
}

/**
 *input: variable: startLine, the start line of the function body
 *output: the function 
*/
function getIndexOfFunctionArgs(startLine, variable, fileName) {
    var ast = esprima.parseScript(fs.readFileSync(fileName, "utf-8"), { loc: true }); //get the ast of the script, and create ast with line number
    var astBody = ast.body;

    for(var i = 0; i < astBody.length; i++) {        
        
        if(astBody[i].type === "FunctionDeclaration" && astBody[i].id.loc.start.line == startLine) {           
            var params = astBody[i].params;
            for(var j = 0; j < params.length; j++) {
                if(params[j].name === variable) {
                    return j;
                }
            }
        }
    }
}

/**
 *input: variable: a.b.c.b
 *output: base: a.b.c, offset: b
 */
function varToObj(variable) {
    var variableStack = variable.split(".");
    if(variableStack.length === 1) {
        var base = null;
        var offset = variableStack[0];
    } else {
        var base = variableStack.slice(0, variableStack.length - 1).join(".");
        var offset = variableStack[variableStack.length - 1];
    }
    return [base, offset];
}

/**
 *input: line, fileName
 *output: the corresponding code line
 */
 function findCodeLine(filePath,lineNum) {
    var str=fs.readFileSync(filePath,'utf-8');
    var strArr=str.split("\n");

    var ast = esprima.parseScript(strArr[lineNum - 1]);
    return ast.body[0];  //every time a line of code is accessed
 }

function updateError(errorMessage, astbody, tr, funcRetVar) {
    var rootCause = [];
    
    if (astbody.type === "ExpressionStatement" && astbody.expression.type === "AssignmentExpression") {
    	
        var right = astbody.expression.right;
        
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
            case 'MemberExpression': //xx = a.b.x
                var tmpVar = [];
                var base = right.object;            
                var offset = right.property;
                tmpVar.shift(offset.name);
                while(base.hasOwnProperty(property)) {
                    tmpVar.shift(base.property.name);
                    base = base.object;
                }
                tmpVar.shift(base.name);
                tmpVar = tmpVar.join(".");
                errorMessage.error_variable = tmpVar;
                errorMessage.error_line = tr.line;
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
                    case 'MemberExpression': //var xx = a.b.x
                        var tmpVar = [];
                        var base = astbody.declarations[k].init.object;
                        var offset = astbody.declarations[k].init.property;
                        tmpVar.shift(offset.name);
                        while(base.hasOwnProperty(property)) {
                            tmpVar.shift(base.property.name);
                            base = base.object;
                        }
                        tmpVar.shift(base.name);
                        tmpVar = tmpVar.join(".");
                        errorMessage.error_variable = tmpVar;
                        errorMessage.error_line = tr.line;
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

function getLineNum(line) {
    return line.split(":")[1];
}