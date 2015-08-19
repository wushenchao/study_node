// 数组排序

var compare = function (x, y) {
	return x - y;
};

var swap = function (a, i, j) {
	var t = a[i];
	a[i] = a[j];
	a[j] = t;
};

var bubbleSort = function (array) {
	console.log(array);
	for (var i = 0; i < array.length; i++) {
		for (var j = 0; j < array.length - i - 1; j++) {
			if (compare(array[j], array[j + 1]) > 0 ) {
				swap(array, j , j + 1);
			}
		}
	}
	console.log(array);
	return array;
};

var array = bubbleSort([13, 12, 15]);
console.log(array);



