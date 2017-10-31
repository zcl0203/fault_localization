
var fs = require("fs");
var esprima = require("esprima");

//step 1 : preparation stage, get all the information we needed
var fileName = process.argv.splice(2)[0];  //trace saved file
var traceData = JSON.parse(fs.readFileSync(fileName, "utf-8"));   //read trace data
var trace = traceData.trace;                //null trace
var errorMessage = traceData.errorMessage;  //error point at where the program crash
var currScript = traceData.currScript;	    //the file of the collapsed program
var funcRetVar = traceData.funcRetVar;     //the variable that function return null

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

//determine whether a function is a native function
function isNative(fn) {
	return (/\{\s*\[native code\]\s*\}/).test('' + fn);
}

//find the previous error point
function findPrevError(errorMessage) {

	for(var i = trace.length - 1; i >= 0; i--) {

		if(trace[i].func === errorMessage.error_func && trace[i].name === errorMessage.error_variable) {   // //parse the line number to the format of esprima in order to search for the corresponding code line	
			
			var loc = parseLine(trace[i].line);  //get the line and column number of the null position in the trace
			var astBody = ast.body;

			if(trace[i].func === "global") {
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
									case 'CallExpression': //a = f();
										var func = right.callee.name;
										if( isNative(func) ) {
											errorMessage.error_variable = errorMessage.error_variable;
											errorMessage.error_line = trace[i].line;
											errorMessage.error_func = trace[i].func;
											error_stack.push((JSON.stringify(errorMessage)));
											trace.pop();
											rootCause.push(JSON.stringify(errorMessage));
										} else {
											for(var m = 0; m < funcRetVar.length; m++) {
												item = funcRetVar[m];
											
												if(item.func === func) {
													errorMessage.error_variable = item.variable;
													// errorMessage.error_line = item.line;
													errorMessage.error_func = item.func;
													errorMessage.error_line = trace[i].line;									
													error_stack.push(JSON.stringify(errorMessage));
													trace.pop();
													break;
												}										
											}
										}										
										break;
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
											case 'CallExpression':   //var a = f();
												var func = astBody[j].declarations[k].init.callee.name;
												if( isNative(func) ) {
													errorMessage.error_variable = errorMessage.error_variable;
													errorMessage.error_line = trace[i].line;
													errorMessage.error_func = trace[i].func;
													error_stack.push((JSON.stringify(errorMessage)));
													trace.pop();
													rootCause.push(JSON.stringify(errorMessage));
												} else {
													for(var m = 0; m < funcRetVar.length; m++) {
														item = funcRetVar[m];
													
														if(item.func === func) {
															errorMessage.error_variable = item.variable;
															// errorMessage.error_line = item.line;
															errorMessage.error_func = item.func;
															errorMessage.error_line = trace[i].line;									
															error_stack.push(JSON.stringify(errorMessage));
															trace.pop();
															break;
														}											
													}
												}												
												break;
										}
									}
									break;
								}
							}
						}
						break;			
					}
				}
			} else {       //step into the corresponding function
				for(var j = 0; j < astBody.length; j++) {
	
					if(astBody[j].type == "FunctionDeclaration" && errorMessage.error_func == astBody[j].id.name && loc.start.line >= astBody[j].loc.start.line && loc.end.line <= astBody[j].loc.end.line) {
						var body = astBody[j].body.body;
						
						for(var t = 0; t < body.length; t++) {
							
							if(body[t].loc.start.line === loc.start.line) {
								if(body[t].type === "ExpressionStatement" && body[t].expression.type === "AssignmentExpression") {					
									if(body[t].expression.left.name == errorMessage.error_variable) {
										var right = body[t].expression.right;
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
											case 'CallExpression': //a = f();
												var func = right.callee.name;												
												for(var m = 0; m < funcRetVar.length; m++) {
													item = funcRetVar[m];
												
													if(item.func === func) {
														errorMessage.error_variable = item.variable;
														// errorMessage.error_line = item.line;
														errorMessage.error_func = item.func;
														errorMessage.error_line = trace[i].line;
														// errorMessage.error_func = trace[i].func;
														error_stack.push(JSON.stringify(errorMessage));
														trace.pop();
														break;
													}												
												}
												break;
										}
									}
								} else if(body[t].type === "VariableDeclaration") {
									for(var k = 0; k < body[t].declarations.length; k++) {
										if(body[t].declarations[k].id.name === errorMessage.error_variable) {
											if(body[t].declarations[k].init.type) {
												switch(body[t].declarations[k].init.type) {
													case 'Literal':      //var a = num/string/null...
														if(body[t].declarations[k].init.value === null) {
															errorMessage.error_variable = errorMessage.error_variable;
															errorMessage.error_line = trace[i].line;
															errorMessage.error_func = trace[i].func;
															error_stack.push((JSON.stringify(errorMessage)));
															trace.pop();
															rootCause.push(JSON.stringify(errorMessage));
														}
														break;
													case 'Identifier':    //var a = b;
														errorMessage.error_variable = body[t].declarations[k].init.name;
														errorMessage.error_line = trace[i].line;
														errorMessage.error_func = trace[i].func;
														error_stack.push(JSON.stringify(errorMessage)); 
														trace.pop();
														break;
													case 'CallExpression':   //var a = f();
														var func = body[t].declarations[k].init.callee.name;
														for(var m = 0; m < funcRetVar.length; m++) {
															item = funcRetVar[m];
														
															if(item.func === func) {
																errorMessage.error_variable = item.variable;
																// errorMessage.error_line = item.line;
																errorMessage.error_func = item.func;
																errorMessage.error_line = trace[i].line;									
																error_stack.push(JSON.stringify(errorMessage));
																trace.pop();
																break;
															}											
														}
														break;
												}
											}
											break;
										}
									}
								}
							}
							
						}
						break;
					}
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