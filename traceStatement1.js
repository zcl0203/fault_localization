var trace = [];
var current_var;
var script_stack = [];
var func_stack = [];

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


	function MyAnalysis() {

		this.scriptEnter = function(iid, instrumentedFileName, originalFileName) {
			script_stack.push(originalFileName);
		};


		this.write = function(iid, name, val, lhs, isGlobal, isScriptLocal) {
			
			if(val == null || val == undefined) {
				var line = getLineNum(iid);
				trace.push({name: name, line: line});				
			}
		};

		this.read = function(iid, name, val, isGlobal, isScriptLocal) {
			if(val == null || val == undefined) {
				var line = getLineNum(iid);
				current_var = {name: name, line: line};
			}
		}

		this.getFieldPre = function (iid, base, offset, isComputed, isOpAssign, isMethodCall) {
			if(base == null || base == undefined) {
				
				var line = getLineNum(iid);
				var originalLineNum;

				//get original line number
				for (var i = 0; i < trace.length; i++) {
					if(trace[i].name == current_var.name) {
						originalLineNum = trace[i].line;
						break;
					}
				}

				console.log("At line: " + line + " error occured! " + current_var.name + " is " + base);
				console.log("root cause line number is " + originalLineNum);			
			}
            return {base: base, offset: offset, skip: false};
        };

        this.functionEnter = function(iid, f, dis, args) {
        	func_stack.push(f);
        };

        this.functionExit = function(iid, returnVal, wrappedExceptionVal) {
        	// console.log(func_stack);
        	func_stack.pop();
        };

	}
	
	sandbox.analysis = new MyAnalysis();

})(J$);