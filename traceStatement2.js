var func_trace = [],
	trace = [],
	curr_read_var,
	errorMessage = {};

var funcStack = ["global"],
	currFun = "global",
	scriptStack = [],
	currScript;

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
			errorMessage: errorMessage,
			currScript: currScript
		}
		var jsonData = JSON.stringify(data);
		var fileName = "/home/aiyanxu/experiment/jalangi2-new/fault_localization/tmp/test3/test1.json";		

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
				var line = findCause(curr_read_var.name);
				func_trace.push({func:currFun, line:line, val:returnVal});
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