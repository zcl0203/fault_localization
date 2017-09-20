var func_trace = [],
	trace = [],
	curr_read_var;
var funcStack = ["window"],
	currFun = "window";

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

	function findCause(name) {
		var trace_len = trace.length;
		for(var i = trace_len - 1; i >= 0; i--) {
			
		}
		console.log(trace);
	}

	
	function MyAnalysis() {

		this.write = function(iid, name, val, lhs, isGlobal, isScriptLocal) {

			if(val == null) {
				var line = getLineNum(iid);
				trace.push({func:currFun, name:name, val:val, line:line});
			} else if(val == undefined) {
				var line = getLineNum(iid);
				trace.push({func:currFun, name:name, val:val, line:line});
			}
		};
 
		this.functionEnter = function(iid, f, dis, args) {
			currFun = f.name;
			funcStack.push(currFun);
		};

		this.read = function(iid, name, val, isGlobal, isScriptLocal) {
			if(val == null || val == undefined) {
				var line = getLineNum(iid);
				curr_read_var = {name:name, line:line};
			}
		}

		this.functionExit = function(iid, returnVal, wrappedExceptionVal) {
			if(returnVal == null || returnVal == undefined) {
				var line = findCause(curr_read_var.name);
				func_trace.push({func:currFun, line:line, val:returnVal});
				funcStack.pop();
			}
		};
	}

	sandbox.analysis = new MyAnalysis();
})(J$);