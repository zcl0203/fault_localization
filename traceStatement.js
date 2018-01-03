var	trace = [],   //store the null variables using [base, offset]
	funcRetVar = [],
	funcArgsVar = [],	
	errorMessage = {},
	currScript;    //define the message that need to be saved in the file

var funcStack = ["global"],
	currFun = "global",
	scriptStack = [],
	curr_read_var = []; //the data structure is {variable, operation, type, line}


(function(sandbox) {

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

	// function getLineNum(line) {
	// 	return line.split(":")[1];
	// }

	// determine the scope of the variable
	function writeFlags(isGlobal, isScriptLocal) {
        if (isGlobal) { return "global" }
        else if (isScriptLocal) { return "script-global" }
        else { return "local" }
    }

	//write the tace information into JSON file
	function writeTrace() {
		var fs = require("fs");
		var data = {
			trace: trace,
			funcRetVar: funcRetVar,
			funcArgsVar: funcArgsVar,
			errorMessage: errorMessage,
			currScript: currScript
		}

		var jsonData = JSON.stringify(data);
		// console.log(jsonData);
		var tmpArr = currScript.split("/");
		
		var file = tmpArr.pop().split(".")[0];              //use the relative way to get the file path to make code more flexible
		var folder = tmpArr.pop();
		var fileName = process.cwd() + '/tmp/' + folder + '/' + file + '.json';
		//console.log(fileName);
		
		fs.writeFileSync(fileName, jsonData);
	}

	//analysis callback overwrite, in order to collect trace information

	function MyAnalysis() {

		this.scriptEnter = function(iid, instrumentedFileName, originalFileName) {
			currScript = originalFileName;
			scriptStack.push(currScript);
		};

		this.scriptExit = function(iid, wrappedExceptionVal) {
			scriptStack.pop();
			currScript = scriptStack[scriptStack.length - 1];
		};

		this.functionEnter = function(iid, f, dis, args) {	
			var prevFun = currFun;
			if(f.name) {
				currFun = f.name;
			} else {
				func = curr_read_var.pop();
				currFun = func.name;
			}
			funcStack.push(currFun);	
			
			var line = getLocation(iid);
			for(var i = 0; i < args.length; i++) {
				if(args[i] === null) {
					trace.push({func:currFun, name:{base: "args", offset: i}, val:null, line:line});
				}
			}

			//get the variable passed to the function arguments
			for(var i = args.length - 1; i >= 0; i--) {
				if(args[i] === null) {
					var argVar = getReadVar(i);					
					funcArgsVar.push({prevFun: prevFun, currFunc: currFun, argVar: argVar, index: i});
				}
			}
		};

		
		

		//get all the variables passed to the function invocation
		function getReadVar(index) {
			
			var variables = [], currVariable = [];
			for(var i = curr_read_var.length -1 ; i >= 0 && curr_read_var[i].type !== 'function'; i--) {
				
				if(curr_read_var[i].operation === "getField") {
					currVariable.unshift(curr_read_var[i]);				
				} else if(curr_read_var[i].operation === "read") {					
					if(currVariable.length === 0) {
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

		this.functionExit = function(iid, returnVal, wrappedExceptionVal) {
			if(returnVal === null) {
				var retVar = curr_read_var.pop();
				funcRetVar.push({func:currFun, variable: retVar.name, line: retVar.line});				
			}

			funcStack.pop();
			currFun = funcStack[funcStack.length - 1];
		};

		this.write = function(iid, name, val, lhs, isGlobal, isScriptLocal) {

			if(val === null) {
				var line = getLocation(iid);
				trace.push({func:currFun, name:{base: null, offset: name}, val:val, line:line});
			}
		};

		this.putField = function(iid, base, offset, val, isComputed, isOpAssign) {
			if(val === null) {
				var line = getLocation(iid);
				var consBase = '';
				var count = 0;
				for(var i = curr_read_var.length - 1; i >= 0; i--) {
					var temp_var = curr_read_var.pop();
					if(getLineNum(temp_var.line) !== getLineNum(line)) {
						break;
					} else {
						if(temp_var.operation === "read") {
							 count++;
						}
						consBase = temp_var.name + '.' + consBase;
					}
				}
				consBase = consBase.split('.');
				if(count !== 1) {
					consBase.pop();
				}
				consBase.pop();
				consBase = consBase.join(".");

				trace.push({func: currFun, name:{base: consBase, offset: offset}, val: val, line: line});
				
			}
		};

		this.getField = function(iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
			
			var line = getLocation(iid);
			if(curr_read_var.length >= 10) curr_read_var.shift();
			curr_read_var.push({name: offset, val: val, type: typeof val, line: line, operation: "getfield", isComputed: isComputed});
			
		}; 

		this.read = function(iid, name, val, isGlobal, isScriptLocal) {

			var line = getLocation(iid);
			if(curr_read_var.length >= 10) curr_read_var.shift();
			curr_read_var.push({name:name, val: val, type: typeof val, line:line, operation: "read"});	
			
		};

		this.getFieldPre = function(iid, base, offset, isComputed, isOpAssign, isMethodCall) {			
			
			if(base === null) {                   //if the base is null and get a field of base, then an error will occur in the next step
				
				var loc = parseLine(getLocation(iid));
				var consBase = '';
				
				while(curr_read_var) {
					var temp_var = curr_read_var.pop();
					var tempLoc = parseLine(temp_var.line);

					if(tempLoc.start.line !== loc.start.line) {
						break;
					}

					if(temp_var.operation === "read" && tempLoc.start.column === loc.start.column) {
						consBase  = temp_var.name + '.' + consBase;
						break;
					} else if(temp_var.operation === "getfield") {
						consBase  = temp_var.name + '.' + consBase;
					}
				}
				 
				consBase = consBase.split('.');
				consBase.pop();
				consBase = consBase.join(".");
				
				errorMessage.error_variable = consBase;
				errorMessage.error_line = getLocation(iid);
				errorMessage.error_func = currFun;
				writeTrace();
			}			
		};
		
		this.putFieldPre = function(iid, base, offset, val, isComputed, isOpAssign) {
			
			if(base === null) {                     //if the base is null and get a field of base, then an error will occur in the next step
				var loc = parseLine(getLocation(iid));
				var consBase = '';

				
				




				consBase.pop();
				consBase = consBase.join(".");

				errorMessage.error_variable = consBase;
				errorMessage.error_line = line
				errorMessage.error_func = currFun;
				writeTrace();
			}
		};
		
	}

	sandbox.analysis = new MyAnalysis();

})(J$);