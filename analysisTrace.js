
var fs = require("fs");
var esprima = require("esprima");

//step 1 : preparation stage, get all the information we needed
var fileName = process.argv.splice(2)[0];  //trace saved file
var traceData = JSON.parse(fs.readFileSync(fileName, "utf-8"));   //read trace data
var trace = traceData.trace;                //null trace
var errorMessage = traceData.errorMessage;  //error point at where the program crash
var currScript = traceData.currScript;	    //the file of the collapsed program

var ast = esprima.parseScript(fs.readFileSync(currScript, "utf-8"), {loc: true});  //get the ast of the script, and create ast with line number
// console.log(ast);
// console.log(trace);
// console.log(errorMessage);
// console.log(currScript);

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


//step 2 : analysis stage
var error_stack = [];    //save the propogation router
error_stack.push(JSON.stringify(errorMessage));

var rootCause = [];      //save the root cause line;


//find the previous error point
function findPrevError(errorMessage) {

	for(var i = trace.length - 1; i >= 0; i--) {

		if(trace[i].func === errorMessage.error_func && trace[i].name === errorMessage.error_variable) {   // //parse the line number to the format of esprima in order to search for the corresponding code line	
				
			var loc = parseLine(trace[i].line);  //get the line and column number of the null position in the trace
			var astBody = ast.body;

			//find the source code of the error point and trace the prev cause point 
			for(var j = 0; j < astBody.length; j++) {
				if(astBody[j].loc.start.line === loc.start.line) {
					if(astBody[j].type === "ExpressionStatement" && astBody[j].expression.type === "AssignmentExpression") {					
						if(astBody[j].expression.left.name == errorMessage.error_variable) {
							var right = astBody[j].expression.right;
							// console.log(right);
							switch(right.type) {
								case 'Literal':      //a = num/string/null...
									if(right.value === null) {
										errorMessage.error_variable = errorMessage.error_variable;
										errorMessage.error_line = trace[i].line;
										errorMessage.error_func = trace[i].func;
										error_stack.push((JSON.stringify(errorMessage)));
										trace.pop();
										rootCause.push(JSON.stringify(errorMessage));
									}
									break;
								case 'Identifier':    // a = b;
									errorMessage.error_variable = right.name;
									errorMessage.error_line = trace[i].line;
									errorMessage.error_func = trace[i].func;
									error_stack.push(JSON.stringify(errorMessage)); 
									trace.pop();
									break;
								// case ''
							}
						}
					} else if(astBody[j].type === "VariableDeclaration") {
						for(var k = 0; k < astBody[j].declarations.length; k++) {
							if(astBody[j].declarations[k].id.name === errorMessage.error_variable) {
								if(astBody[j].declarations[k].init.type) {
									switch(astBody[j].declarations[k].init.type) {
										case 'Literal':      //var a = num/string/null...
											if(astBody[j].declarations[k].init.value === null) {
												errorMessage.error_variable = errorMessage.error_variable;
												errorMessage.error_line = trace[i].line;
												errorMessage.error_func = trace[i].func;
												error_stack.push((JSON.stringify(errorMessage)));
												trace.pop();
												rootCause.push(JSON.stringify(errorMessage));
											}
											break;
										case 'Identifier':    //var a = b;
											errorMessage.error_variable = astBody[j].declarations[k].init.name;
											errorMessage.error_line = trace[i].line;
											errorMessage.error_func = trace[i].func;
											error_stack.push(JSON.stringify(errorMessage)); 
											trace.pop();
											break;
										// case ''
									}
								}
								break;
							}
						}
					}
					break;			
				}
			}
			break;
		}
		trace.pop();
	}	
}

while (!rootCause.length) {
	if(!trace.length) {
		break;
	}
	findPrevError(errorMessage);  //every invocation of the function will update the errorMessage
}
console.log("\n\nroot cause : ");
console.log(rootCause);
console.log("\n\n");
console.log(error_stack);


