filename=$1 
node ../src/js/commands/jalangi.js --inlineIID --inlineSource --analysis traceStatement2.js tests/test3/${filename}.js
node analysisTrace.js