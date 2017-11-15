var a, createNull = function() {
	var b, c;
	var a = null;
	b = a;
	a = 1;
	c = a;
	c = b;

	return c;
}

var x, y;
x = null;
var z = createNull();
y = x;
z.f();
