var	trace = [],   //store the null variables using [base, offset]
	funcRetVar = [],	
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

	function getLineNum(line) {
		return line.split(":")[1];
	}

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
			errorMessage: errorMessage,
			currScript: currScript
		}

		var jsonData = JSON.stringify(data);
		// console.log(jsonData);
		
		file = currScript.split("/").pop().split(".")[0];              //use the relative way to get the file path to make code more flexible
		var fileName = process.cwd() + '/tmp/test3/' + file + '.json';
		
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
			
			if(f.name) {
				currFun = f.name;
			} else {
				func = curr_read_var.pop();
				currFun = func.name;
			}
			funcStack.push(currFun);
		};

		// this.invokeFunPre = function(iid, f, base, args, isConstructor, isMethod, functionIid) {
		// 	// judge the invoked function is a function or function expression
		// 	if(f.name) {
		// 		currFun = f.name;
		// 	} else {
		// 		func = curr_read_var.pop();
		// 		currFun = func.name;
		// 	}		
		// }

		this.functionExit = function(iid, returnVal, wrappedExceptionVal) {
			if(returnVal === null) {
				var retVar = curr_read_var.pop();
				funcRetVar.push({func:currFun, variable: retVar.name, line: retVar.line});
				funcStack.pop();
				currFun = funcStack[funcStack.length - 1];
			}
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
		}

		this.getField = function(iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
			
			var line = getLocation(iid);
			curr_read_var.push({name: offset, type: typeof val, line: line, operation: "getfield"});
			
		}; 

		this.read = function(iid, name, val, isGlobal, isScriptLocal) {

			var line = getLocation(iid);
			curr_read_var.push({name:name, type: typeof val, line:line, operation: "read"});	
			
		};

		this.getFieldPre = function(iid, base, offset, isComputed, isOpAssign, isMethodCall) {

			if(base === null) {                   //if the base is null and get a field of base, then an error will occur in the next step
				var line = getLocation(iid);
				var consBase = '';
				for(var i = curr_read_var.length - 1; i >= 0; i--) {
					var temp_var = curr_read_var.pop();
					
					if(getLineNum(temp_var.line) !== getLineNum(line)) {
						break;
					} else {
						consBase = temp_var.name + '.' + consBase;
					}
				}

				consBase = consBase.split('.');
				consBase.pop();
				consBase = consBase.join(".");
				
				errorMessage.error_variable = consBase;
				errorMessage.error_line = line;
				errorMessage.error_func = currFun;
				writeTrace();
			}			
		};
		
		this.putFieldPre = function(iid, base, offset, val, isComputed, isOpAssign) {
			if(base === null) {                     //if the base is null and get a field of base, then an error will occur in the next step
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

				errorMessage.error_variable = consBase;
				errorMessage.error_line = line
				errorMessage.error_func = currFun;
				writeTrace();
			}
		}
		
	}

	sandbox.analysis = new MyAnalysis();

})(J$);