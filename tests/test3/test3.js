function createNull() {
	var a, b, c;
	a = null;
	b = a;
	a = 1;
	c = a;
	c = b;

	return c;
}

var x, y, z;
x = null;
z = createNull();
y = x;
z.f();
