//colors - rgby
//  1
// 4+2
//  3
if(typeof levels == 'undefined') {
	levels = [];
}
levels.push({
	'cubes' : [
		['yyyy', 'bbbb'],
		['rrrr', 'yyyy'],
		['ggbb', 'gggg']
	]
})
levels.push({
	'cubes' : [
//		['g', 'g',    'b'],
//		['r', 'gbyr', 'b'],
//		['r', 'y',    'b'],
//		['y', 'y', 'y'],
		['yyyy', 'bbbb', 'yyyy'],
		['rrrr', 'yyyy', 'bbbb'],
		['gggg', 'bbbb', 'gbyr'],
		['gggg', 'yyyy', 'rrrr'],
	]
})
levels.push({
	'cubes' : [
//		['r', 'y',    'y',    'y'],
//		['r', 'r',    'y',    'g'],
//		['b', 'rygb', 'yggy', 'g'],
//		['b', 'g',    'gbbg', 'ggbb'],
//		['b', 'b',    'b',    'b' ]
		['rrrr', 'bbbb', 'gggg', 'rygb'],
		['yyyy', 'rrrr', 'bbbb', 'rrrr'],
		['bbbb', 'yyyy', 'yggy', 'yyyy'],
		['gggg', 'bbbb', 'yyyy', 'ggbb'],
		['bbbb', 'gggg', 'bbbb', 'gbbg']
	]
})

/*
var s = '';
for(y in Game.cubemap) {
	s += '[';
	for(x in Game.cubemap[y]) {
		s += '\'' + Game.cubemap[y][x].w +
					Game.cubemap[y][x].d +
					Game.cubemap[y][x].s +
					Game.cubemap[y][x].a + '\'';
		if(x < Game.cubemap[y].length - 1) {s += ', ';}
	}
	s += '],\n';
}
console.log(s);
*/