filename=$1 
node ../src/js/commands/jalangi.js --inlineIID --inlineSource --analysis traceStatement.js tests/test3/${filename}.js
# node analysisTrace.js tmp/test3/${filename}.json
