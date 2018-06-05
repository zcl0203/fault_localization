var trace = [], //store the null variables using [base, offset]
    funcRetVar = [],
    funcArgsVar = [],
    errorMessage = {},
    currScript; //define the message that need to be saved in the file

var funcStack = ["global"],
    currFun = "global",
    scriptStack = [],
    curr_read_var = []; //the data structure is {variable, operation, type, line}

var traceData = {};
var fs = require("fs");
var esprima = require("esprima");

(function (sandbox) {

    // get the line number of the iid
    function getLocation(iid) {
        var location = sandbox.iidToLocation(sandbox.getGlobalIID(iid)); //get the location of iid		
        return location;
    }

    //parse the line number to the format of esprima in order to search for the corresponding code line	
    function parseLine(line) {
        var parseline = line.split(")")[0].split(":");
        var loc = {};
        loc.start = {};
        loc.end = {};
        loc.start.line = parseInt(parseline[1]);
        loc.start.column = parseInt(parseline[2]);
        loc.end.line = parseInt(parseline[3]);
        loc.end.column = parseInt(parseline[4]);

        return loc;
    }

    function getLineNum(line) {
        return line.split(":")[1];
    }

    // determine the scope of the variable
    function writeFlags(isGlobal, isScriptLocal) {
        if (isGlobal) {
            return "global"
        } else if (isScriptLocal) {
            return "script-global"
        } else {
            return "local"
        }
    }

    //write the tace information into JSON file
    function writeTrace() {
        
        traceData = {
            trace: trace,
            funcRetVar: funcRetVar,
            funcArgsVar: funcArgsVar,
            errorMessage: errorMessage,
            currScript: currScript
        }

        var jsonData = JSON.stringify(traceData);
        // console.log(jsonData);
        var tmpArr = currScript.split("/");

        var file = tmpArr.pop().split(".")[0]; //use the relative way to get the file path to make code more flexible
        var folder = tmpArr.pop();
        var fileName = process.cwd() + '/version3/temp/' + file + '.json';
        //console.log(fileName);

        fs.writeFileSync(fileName, jsonData);
    }

    function executeAnalysis() {

        // var findRootCause = require("./analysisTrace");

        var temp = findRootCause(traceData); //update rootCause and errorStack
        var rootCause = temp[0];
        var errorStack = temp[1];


        console.log("\n\n");
        console.log("rootCause:");
        console.log(rootCause);
        console.log("\n\n");
        console.log("errorStack:");
        console.log(errorStack);
        console.log("\n\n");
    }

    //analysis callback overwrite, in order to collect trace information

    function MyAnalysis() {

        this.scriptEnter = function (iid, instrumentedFileName, originalFileName) {
            currScript = originalFileName;
            scriptStack.push(currScript);
        };

        this.scriptExit = function (iid, wrappedExceptionVal) {
            scriptStack.pop();
            currScript = scriptStack[scriptStack.length - 1];
        };

        this.functionEnter = function (iid, f, dis, args) {
            var prevFun = currFun;
            if (f.name) {
                currFun = f.name;
            } else {
                func = curr_read_var.pop();
                currFun = func.name;
            }
            funcStack.push(currFun);

            var line = getLocation(iid);
            for (var i = 0; i < args.length; i++) {
                if (args[i] === null) {
                    trace.push({
                        func: currFun,
                        name: {
                            base: "args",
                            offset: i
                        },
                        val: null,
                        line: line
                    });
                }
            }

            //get the variable passed to the function arguments
            for (var i = args.length - 1; i >= 0; i--) {
                if (args[i] === null) {
                    var argVar = getReadVar(i);
                    funcArgsVar.push({
                        prevFun: prevFun,
                        currFunc: currFun,
                        argVar: argVar,
                        index: i
                    });
                }
            }
        };




        //get all the variables passed to the function invocation
        function getReadVar(index) {

            var variables = [],
                currVariable = [];
            for (var i = curr_read_var.length - 1; i >= 0 && curr_read_var[i].type !== 'function'; i--) {

                if (curr_read_var[i].operation === "getField") {
                    currVariable.unshift(curr_read_var[i]);
                } else if (curr_read_var[i].operation === "read") {
                    if (currVariable.length === 0) {
                        variables.unshift(curr_read_var[i].name);
                    } else {
                        currVariable.unshift(curr_read_var[i].name);
                        variables.unshift(currVariable.join("."));
                    }
                    currVariable = [];
                }
            }

            return variables[index];
        }

        this.functionExit = function (iid, returnVal, wrappedExceptionVal) {
            if (returnVal === null) {
                var retVar = curr_read_var.pop();
                funcRetVar.push({
                    func: currFun,
                    variable: retVar.name,
                    line: retVar.line
                });
            }

            funcStack.pop();
            currFun = funcStack[funcStack.length - 1];
        };

        this.write = function (iid, name, val, lhs, isGlobal, isScriptLocal) {

            if (val === null) {
                var line = getLocation(iid);
                trace.push({
                    func: currFun,
                    name: {
                        base: null,
                        offset: name
                    },
                    val: val,
                    line: line
                });
            }
        };

        this.putField = function (iid, base, offset, val, isComputed, isOpAssign) {
            if (val === null) {
                var line = getLocation(iid);
                var consBase = '';
                var count = 0;
                for (var i = curr_read_var.length - 1; i >= 0; i--) {
                    var temp_var = curr_read_var.pop();
                    if (getLineNum(temp_var.line) !== getLineNum(line)) {
                        break;
                    } else {
                        if (temp_var.operation === "read") {
                            count++;
                        }
                        consBase = temp_var.name + '.' + consBase;
                    }
                }
                consBase = consBase.split('.');
                if (count !== 1) {
                    consBase.pop();
                }
                consBase.pop();
                consBase = consBase.join(".");

                trace.push({
                    func: currFun,
                    name: {
                        base: consBase,
                        offset: offset
                    },
                    val: val,
                    line: line
                });

            }
        };

        this.getField = function (iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {

            var line = getLocation(iid);
            if (curr_read_var.length >= 10) curr_read_var.shift();
            curr_read_var.push({
                name: offset,
                val: val,
                type: typeof val,
                line: line,
                operation: "getfield",
                isComputed: isComputed
            });

        };

        this.read = function (iid, name, val, isGlobal, isScriptLocal) {

            var line = getLocation(iid);
            if (curr_read_var.length >= 10) curr_read_var.shift();
            curr_read_var.push({
                name: name,
                val: val,
                type: typeof val,
                line: line,
                operation: "read"
            });

        };

        this.getFieldPre = function (iid, base, offset, isComputed, isOpAssign, isMethodCall) {

            if (base === null) { //if the base is null and get a field of base, then an error will occur in the next step

                var loc = parseLine(getLocation(iid));
                var consBase = '';

                while (curr_read_var) {
                    var temp_var = curr_read_var.pop();
                    var tempLoc = parseLine(temp_var.line);

                    if (tempLoc.start.line !== loc.start.line) {
                        break;
                    }

                    if (temp_var.operation === "read" && tempLoc.start.column === loc.start.column) {
                        consBase = temp_var.name + '.' + consBase;
                        break;
                    } else if (temp_var.operation === "getfield") {
                        if (tempLoc.start.column === loc.start.column) {
                            consBase = temp_var.name + '.' + consBase;
                        }
                    }
                }

                consBase = consBase.split('.');
                consBase.pop();
                consBase = consBase.join(".");

                errorMessage.error_variable = consBase;
                errorMessage.error_line = getLocation(iid);
                errorMessage.error_func = currFun;
                writeTrace();
                executeAnalysis();
            }
        };

        this.putFieldPre = function (iid, base, offset, val, isComputed, isOpAssign) {

            if (base === null) { //if the base is null and get a field of base, then an error will occur in the next step
                var loc = parseLine(getLocation(iid));
                var consBase = '';

                while (curr_read_var) {
                    var temp_var = curr_read_var.pop();
                    var tempLoc = parseLine(temp_var.line);

                    if (tempLoc.start.line !== loc.start.line) {
                        break;
                    }

                    if (temp_var.operation === "read" && tempLoc.start.column === loc.start.column) {
                        consBase = temp_var.name + '.' + consBase;
                        break;
                    } else if (temp_var.operation === "getfield") {
                        if (tempLoc.start.column === loc.start.column) {
                            consBase = temp_var.name + '.' + consBase;
                        }
                    }
                }


                consBase = consBase.split('.');
                consBase.pop();
                consBase = consBase.join(".");

                errorMessage.error_variable = consBase;
                errorMessage.error_line = getLocation(iid);
                errorMessage.error_func = currFun;
                writeTrace();
                executeAnalysis();
            }
        };

    }

    /**
     * @输入trace信息
     * @param1 traceData
     * @return rootCause
     */

    function findRootCause(traceData) {     
        var rootCause = [];
        var errorStack = []; //save the propogation router

        var trace = traceData.trace;
        var errorMessage = traceData.errorMessage; //error point at where the program crash
        const currScript = traceData.currScript; //the file of the collapsed program
        const funcRetVar = traceData.funcRetVar; //the variable that function return null
        const funcArgsVar = traceData.funcArgsVar;

        while (!rootCause.length) {
            // console.log(rootCause);
            errorStack.push(JSON.stringify(errorMessage));
            if (!trace.length) {
                break;
            }
            //every invocation of the function will update the errorMessage
            var result = findPrevError(errorMessage, trace, currScript, funcRetVar, funcArgsVar);            
            errorMessage = result[0];
            rootCause = result[1];
        }

        return [rootCause, errorStack];
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
                if (trace[i].name.base === "args") {

                    var index = getIndexOfFunctionArgs(getLineNum(trace[i].line), offset, currScript);

                    if (index == trace[i].name.offset) {
                        //get the line of function arguments, set the error variable to the arguments passed to the function
                        var j = funcArgsVar.length - 1;
                        while (j >= 0) {
                            if (funcArgsVar[j].currFunc === trace[i].func && funcArgsVar[j].index === index) {
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
                } else if (trace[i].name.base === base && trace[i].name.offset === offset) {
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
        var ast = esprima.parseScript(fs.readFileSync(fileName, "utf-8"), {
            loc: true
        }); //get the ast of the script, and create ast with line number
        var astBody = ast.body;

        for (var i = 0; i < astBody.length; i++) {

            if (astBody[i].type === "FunctionDeclaration" && astBody[i].id.loc.start.line == startLine) {
                var params = astBody[i].params;
                for (var j = 0; j < params.length; j++) {
                    if (params[j].name === variable) {
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
        if (variableStack.length === 1) {
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
    function findCodeLine(filePath, lineNum) {
        var str = fs.readFileSync(filePath, 'utf-8');
        var strArr = str.split("\n");

        var ast = esprima.parseScript(strArr[lineNum - 1]);
        return ast.body[0]; //every time a line of code is accessed
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
                    while (base.hasOwnProperty(property)) {
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
                            while (base.hasOwnProperty(property)) {
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

    

    sandbox.analysis = new MyAnalysis();

})(J$);