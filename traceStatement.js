var	trace = [],
	funcRetVar = [],	
	errorMessage = {},
	currScript;    //define the message that need to be saved in the file

var funcStack = ["global"],
	currFun = "global",
	scriptStack = [],
	curr_read_var;
	

(function(sandbox) {

	// get the line number of the iid
	function getLineNum(iid) {
		var location = sandbox.iidToLocation(sandbox.getGlobalIID(iid)); //get the location of iid		
		return location;
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
		
		file = currScript.split("/").pop().split(".")[0];              //use the relative way to get the file path to make code more flexible
		var fileName = process.cwd() + '/tmp/test3/' + file + '.json';
		// console.log(fileName);
		// var fileName = "/home/aiyanxu/experiment/jalangi2-new/fault_localization/tmp/test3/test2.json";		

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

		this.write = function(iid, name, val, lhs, isGlobal, isScriptLocal) {

			if(val === null) {
				var line = getLineNum(iid);
				trace.push({func:currFun, name:name, val:val, line:line});
			}
		};
 
		this.functionEnter = function(iid, f, dis, args) {
			currFun = f.name;
			funcStack.push(currFun);
		};

		this.read = function(iid, name, val, isGlobal, isScriptLocal) {
			if(val === null) {
				var line = getLineNum(iid);
				curr_read_var = {name:name, line:line};
			}
		};

		this.functionExit = function(iid, returnVal, wrappedExceptionVal) {
			if(returnVal === null) {
				funcRetVar.push({func:currFun, variable: curr_read_var.name, line:curr_read_var.line});
				funcStack.pop();
				currFun = funcStack[funcStack.length - 1];
			}
		};

		this.getFieldPre = function(iid, base, offset, isComputed, isOpAssign, isMethodCall) {
			if(base === null) {                     //if the base is null and get a field of base, then an error will occur in the next step
				var line = getLineNum(iid);
				errorMessage.error_variable = curr_read_var.name;
				errorMessage.error_line = line
				errorMessage.error_func = currFun;
				writeTrace();
			}
		};
	}

	sandbox.analysis = new MyAnalysis();
})(J$);