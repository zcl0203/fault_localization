var trace = {};
var variable = [];
var currFun = "window";
// function callStack
var funStack = ["window"];
var tracepath;   //trace path
var tracename;
var errorline;

//store the originated line of null or undefined
var annotatedValue = [];

(function(sandbox) {

	var Constants = sandbox.Constants;
	var fs = (!Constants.isBrowser) ? require('fs') : undefined;
	var path = (!Constants.isBrowser) ? require('path') : undefined;
	var util = (!Constants.isBrowser) ? require("util") : undefined;

		
	// get the line number of the iid
	function getLineNum(iid) {
		var location = sandbox.iidToLocation(sandbox.getGlobalIID(iid)) //get the location of iid
		var line = location.split(":")[1];
		return line;
	}

	//perform deepcopy of object and array
	function clone(obj) {
	    // Handle the 3 simple types, and null or undefined
	    if (null == obj || "object" != typeof obj) return obj;

	    // Handle Date
	    if (obj instanceof Date) {
	        var copy = new Date();
	        copy.setTime(obj.getTime());
	        return copy;
	    }

	    // Handle Array
	    if (obj instanceof Array) {
	        var copy = [];
	        for (var i = 0, len = obj.length; i < len; ++i) {
	            copy[i] = clone(obj[i]);
	        }
	        return copy;
	    }

	    // Handle Object
	    if (obj instanceof Object) {
	        var copy = {};
	        for (var prop in obj) {
	            if (obj.hasOwnProperty(prop)) copy[prop] = clone(obj[prop]);
	        }
	        return copy;
	    }

	    throw new Error("Unable to copy obj! Its type isn't supported.");
	}

	// function reportError(sMessage, sUrl, sLine) {
	// 	var str = "";
	// 	str += " 错误信息:" + sMessage + "\n";
 //        str += " 错误地址:" + sUrl + "\n";
 //        str += " 错误行数:" + sLine + "\n";
 //        str += "<=========调用堆栈=========>\n";

 //        var func = window.onerror.caller;
 //        var index = 0;
 //        while (func != null) {
 //            //str += "第" + index + "个函数：" + func + "\n";
 //            //str += "第" + index + "个函数：参数表："
 //            //for(var i=0;i<func.arguments.count;i++)
 //            //str += func.arguments[i] + ",";
 //            //}
 //            str += func;
 //            str += "\n===================\n";
 //            func = func.caller;
 //            index++;
 //        }
 //        alert(str);
 //        return false;
	// }

	




	// determine the scope of the variable
	function writeFlags(isGlobal, isScriptLocal) {
        if (isGlobal && isScriptLocal) { return "global and script-local?!" }
        else if (isGlobal) { return "global" }
        else if (isScriptLocal) { return "script-local" }
        else { return "local" }
    }

	function MyAnalysis() {

		this.scriptEnter = function(iid, instrumentedFileName, originalFileName) {	
			console.log(originalFileName);
			if(fs) {
				var temp = originalFileName.split("/");
				tracename = temp[temp.length - 1].split(".")[0] + "_trace.txt";
				tracepath = path.join(__dirname, "tmp", temp[temp.length - 2]);			
				if(fs && !fs.existsSync(tracepath)) {
					fs.mkdirSync(tracepath);
				}
			}	

		};

		// this.endExpression = function(iid) {
		// 	var line = getLineNum(iid);			
			
		// 	trace.currFun = currFun;
		// 	trace.line = line;
		// 	trace.variables = variable;
			
		// 	if(fs) {
		// 		fs.appendFileSync(path.join(tracepath, tracename), clone(trace));
		// 		fs.appendFileSync(path.join(tracepath, tracename), "\n");
		// 	} else {
		// 		console.log(clone(trace));
		// 	}

		// 	variable = [];
 	// 	}

		this.functionEnter = function(iid, f, dis, args) {
			currFun = f.name;			
			funStack.push(currFun);
		};


		this.functionExit = function(iid, returnVal, wrappedExceptionVal) {		
			funStack.pop();
			currFun = funStack[funStack.length - 1];
		};

		this.write = function(iid, name, val, lhs, isGlobal, isScriptLocal) {
			var scope = writeFlags(isGlobal, isScriptLocal);
			if(lhs == undefined) {
				lhs = "none";
			}		
					
			variable.push({name: name, scope: scope, val: val, lhs: lhs});		
		};


		// this.getFieldPre = function(iid, base, offset, isComputed, isOpAssign, isMethodCall) {
		// 	window.onerror = reportError;
		// 	if(base == null || base == undefined) {
		// 		errorline = getLineNum(iid);
		// 		var errorMessage = "error line:" + errorline + ",base is :" + base + ",offset is :" + offset;
		// 		console.log(errorMessage);

		// 	} 
		// };


		// this.invokeFunPre = function(iid, f, base, args, isConstructor, isMethod, functionIid, functionSid) {

		// 	if(base == null || base == undefined) {
				
		// 	}
			
		// };

		this.literal = function(iid, val, hasGetterSetter) {
			if(val == null || val == undefined) {
				var line = getLineNum(iid);
				console.log({val: val, line: line});
			}
			return {result: val};
		};

		this.getField = function (iid, base, offset, val, isComputed, isOpAssign, isMethodCall) {
			if(val == null || val == undefined) {
				var line = getLineNum(iid);
				console.log({val: val, line: line});
			}
            return {result: val};
        };
        this.invokeFun = function (iid, f, base, args, result, isConstructor, isMethod, functionIid, functionSid) {
        	if(result == null || result == undefined) {
				var line = getLineNum(iid);
				console.log({result: result, line: line});
			}
            return {result: result};
        };


		

		// this.literal = function (iid, val, hasGetterSetter) {
		// 	console.log(val);
  //           return {result: val};
  //       };



	}

	sandbox.analysis = new MyAnalysis();
	
})(J$);