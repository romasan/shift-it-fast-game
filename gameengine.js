var POINTS = 0,
	BUTTONSIZE = 100,
	levels = [],
	level = 0;
//----------------------------------------------------------------------------------------
function scaling(i) {
	//if(typeof SCALINGFACTOR == 'undefined') {
	var _w = document.body.clientWidth,
		_h = document.body.clientHeight,
		SCALINGFACTOR = _w / ((_w > _h)?480:320); 
	//}
	return i * SCALINGFACTOR;
}
function splash(x, y, s, f, t) {
	t = (typeof t == 'undefined') ? 1000 : t;
	$('body').append(
		$('<div>')
			.css({
				position      : 'absolute',
				top           : y - 50 + 'px',
				left          : x - 150 + 'px',
				'text-align'  : 'center',
				width         : '300px',
				height        : '100px',
				'line-height' : '100px',
				'font-size'   : '1pt',
				'text-shadow' : '0px 1px #fff'
			})
			.html(s)
			.attr({id : 'splash'})
			.animate({
				'font-size' : '27pt'
			}, function() {
				setTimeout(function() {
					$('#splash')
						.animate({
							'font-size' : '1pt'
						}, function() {
							$('#splash').remove();
							if(typeof f == 'function') {f();}
						})
				}, t);
			})
	);
}
//----------------------------------------------------------------------------------------
function o(){}
o.prototype.move = function() {
	$(this.el).css({
		left   : this.l,
		bottom : this.b
	});
}
//-----------------------------------------------------------------------------------------
map.o = false;
function map(g, v) {}
//-----------------------------------------------------------------------------------------
function cube(a) {
	this.checked = false;
	this.debug = false;
	if(typeof a == 'undefined') {return;}
	if(
		typeof a.g == 'undefined' ||
		typeof a.v == 'undefined'
	) {return;}
	//this.type  = (typeof a.type  == 'undefined')?(a.g >= 0 && a.g < Game.g && a.v >= 0 && a.v < Game.v)?'in':'out':a.type;
	this.removed = false;
	this.w = a.colors[0];
	this.d = a.colors[1];
	this.s = a.colors[2];
	this.a = a.colors[3];
	var _layer_r = '';
	var _layer_g = '';
	var _layer_b = '';
	var _layer_y = '';
	for(i = 0; i < a.colors.length; i++) {
		if(a.colors[i] == 'r') {
			_layer_r += 'r';
		} else {
			_layer_r += '_';
		}
		if(a.colors[i] == 'g') {
			_layer_g += 'g';
		} else {
			_layer_g += '_';
		}
		if(a.colors[i] == 'b') {
			_layer_b += 'b';
		} else {
			_layer_b += '_';
		}
		if(a.colors[i] == 'y') {
			_layer_y += 'y';
		} else {
			_layer_y += '_';
		}
	}
	this.g = a.g;
	this.v = a.v;
	this.size = (Game.w - cube.l * 2) / this.g;
	this.gvtocoord();
	this.cubeid = (this.type == 'out')?(typeof Game.cubes.length == 'undefined')?0:Game.cubes.length:'z';
	var layer_r = $('<div>')
					.addClass('layer')
					.css({
						'background-image' : 'url(./cubes/' + _layer_r + '.png)'
					});
	var layer_g = $('<div>')
					.addClass('layer')
					.css({
						'background-image' : 'url(./cubes/' + _layer_g + '.png)'
					});
	var layer_b = $('<div>')
					.addClass('layer')
					.css({
						'background-image' : 'url(./cubes/' + _layer_b + '.png)'
					});
	var layer_y = $('<div>')
					.addClass('layer')
					.css({
						'background-image' : 'url(./cubes/' + _layer_y + '.png)'
					});
	this.el = $('<div>')
		.addClass('el cube')
		.data({
			x : this.g,
			y : this.v
		})
		.css({
			left   : this.x    + 'px',
			top    : this.y    + 'px',
			width  : cube.size + 'px',
			height : cube.size + 'px'
		})
		.append(layer_r)
		.append(layer_g)
		.append(layer_b)
		.append(layer_y);
	$(Game.map).append(this.el);
	if(typeof a.debug != 'undefined') {
		console.log('constructor ', this.v, this.g, a.v, a.g, this.type, this.direction);
	}
}
cube.prototype.moveline = function() {
	// direction?
	// el clone
	// move all in line
}
cube.prototype.gvtocoord = function() {
	this.x = this.g * cube.size;// + cube.l;
	this.y = this.v * cube.size;// + cube.t;
}
cubesgo = function(a) {
	if(typeof a == 'undefined') {return;}
	var gline = a.y;
	var vline = a.x;
	// after swipe
	//alert(a.direction);
	switch(a.direction) {
		case 'left':
//-----------------
			var _xi0 = 0;                                   //first cube x index
			var _t   = Game.cubemap[a.y][_xi0];             //temporary copy first cube
			var _xi  = Game.cubemap[a.y].length - 1;        //last cube x index
			var _x   = Game.cubemap[a.y][_xi].x + cube.size;//last cube position
			var _y   = Game.cubemap[a.y][_xi].y;
			var _el  = $(Game.cubemap[a.y][_xi0].el)        //clone first cube after LAST CUBE
				.clone()
				.css({
					left : _x + 'px',
					top  : _y + 'px'
				})
			$('#map').append(_el);
			var f_el = _t.el;//link to first cube element
			$(f_el)//move first cube
				.animate({
					left : -cube.size + 'px',
					top  : _y + 'px'
				})
			for(i = _xi0; i < Game.cubemap[a.y].length - 1;i++) {//move cubes
				Game.cubemap[a.y][i] = Game.cubemap[a.y][i + 1];
				var _this = Game.cubemap[a.y][i];
				_this.g = i;
				_this.gvtocoord();
				$(_this.el)
					.data({
						x : _this.g,
						y : _this.v
					})
					.animate({
						left : _this.x + 'px',
						top  : _this.y + 'px'
					})
			}
			Game.cubemap[a.y][_xi] = _t;
			Game.cubemap[a.y][_xi].el = _el;
			var _this = Game.cubemap[a.y][_xi];
			_this.g = _xi;
			_this.gvtocoord();
			var _f = function() {
				$(f_el).remove();
			}
			$(Game.cubemap[a.y][_xi].el)//move last cube
				.data({
					x : _this.g,
					y : _this.v
				})
				.animate({
					left : _this.x + 'px',
					top  : _this.y + 'px'
				}, _f);
//-----------------
			break;
		case 'right':
//-----------------
			var _i0 = Game.cubemap[a.y].length - 1;        //first cube x index
			var _t  = Game.cubemap[a.y][_i0];              //temporary copy first cube
			var _i  = 0;                                   //last cube x index
			var _x  = -cube.size;                          //last cube position
			var _x0 = Game.cubemap[a.y][_i0].x + cube.size;//first cube position
			var _y  = Game.cubemap[a.y][_i].y;
			var _el = $(Game.cubemap[a.y][_i0].el)         //clone first cube after LAST CUBE
				.clone()
				.css({
					left : _x + 'px',
					top  : _y + 'px'
				})
			$('#map').append(_el);
			var __el = _t.el;//link to first cube element
			$(__el)//move first cube
				.animate({
					left : _x0 + 'px',
					top  : _y + 'px'
				})
			for(i = _i0; i > _i;i--) {//move cubes
				Game.cubemap[a.y][i] = Game.cubemap[a.y][i - 1];
				var _this = Game.cubemap[a.y][i];
				_this.g = i;
				_this.gvtocoord();
				$(_this.el)
					.data({
						x : _this.g,
						y : _this.v
					})
					.animate({
						left : _this.x + 'px',
						top  : _this.y + 'px'
					})
			}
			Game.cubemap[a.y][_i] = _t;
			Game.cubemap[a.y][_i].el = _el;
			var _this = Game.cubemap[a.y][_i];
			_this.g = _i;
			_this.gvtocoord();
			var _f = function() {
				$(__el).remove();
			}
			$(Game.cubemap[a.y][_i].el)//move last cube
				.data({
					x : _this.g,
					y : _this.v
				})
				.animate({
					left : _this.x + 'px',
					top  : _this.y + 'px'
				}, _f);
//-----------------
			break;
		case 'up':
//-----------------
			var _yi0 = 0;                                  //first cube y index
			var _t  = Game.cubemap[_yi0][a.x];             //temporary copy first cube
			var _yi = Game.cubemap.length - 1;             //last cube y index
			var _y0 = -cube.size;                          //first cube position
			var _y  = Game.cubemap[_yi][a.x].y + cube.size;//last cube position
			var _x  = Game.cubemap[_yi][a.x].x;
			var _el = $(Game.cubemap[_yi0][a.x].el)        //clone first cube after LAST CUBE
				.clone()
				.css({
					left : _x + 'px',
					top  : _y + 'px'
				})
			$('#map').append(_el);
			var f_el = _t.el;//link to first cube element
			$(f_el)//move first cube
				.animate({
					left : _x  + 'px',
					top  : _y0 + 'px'
				})
			for(i = _yi0; i < Game.cubemap.length - 1;i++) {//move cubes
				Game.cubemap[i][a.x] = Game.cubemap[i + 1][a.x];
				var _this = Game.cubemap[i][a.x];
				_this.v = i;
				_this.gvtocoord();
				$(_this.el)
					.data({
						x : _this.g,
						y : _this.v
					})
					.animate({
						left : _this.x + 'px',
						top  : _this.y + 'px'
					})
			}
			Game.cubemap[_yi][a.x] = _t;
			Game.cubemap[_yi][a.x].el = _el;
			var _this = Game.cubemap[_yi][a.x];
			_this.v = _yi;
			_this.gvtocoord();
			var _f = function() {
				$(f_el).remove();
			}
			$(Game.cubemap[_yi][a.x].el)//move last cube
				.data({
					x : _this.g,
					y : _this.v
				})
				.animate({
					left : _this.x + 'px',
					top  : _this.y + 'px'
				}, _f);
//-----------------
			break;
		case 'down':
//-----------------
			var _i0 = Game.cubemap.length - 1;        //first cube x index
			var _t  = Game.cubemap[_i0][a.x];              //temporary copy first cube
			var _i  = 0;                                   //last cube x index
			var _y  = -cube.size;                          //last cube position
			var _y0 = Game.cubemap[_i0][a.x].y + cube.size;//first cube position
			var _x  = Game.cubemap[_i][a.x].x;
			var _el = $(Game.cubemap[_i0][a.x].el)         //clone first cube after LAST CUBE
				.clone()
				.css({
					left : _x + 'px',
					top  : _y + 'px'
				})
			$('#map').append(_el);
			var __el = _t.el;//link to first cube element
			$(__el)//move first cube
				.animate({
					left : _x + 'px',
					top  : _y0 + 'px'
				})
			for(i = _i0; i > _i;i--) {//move cubes
				Game.cubemap[i][a.x] = Game.cubemap[i - 1][a.x];
				var _this = Game.cubemap[i][a.x];
				_this.v = i;
				_this.gvtocoord();
				$(_this.el)
					.data({
						x : _this.g,
						y : _this.v
					})
					.animate({
						left : _this.x + 'px',
						top  : _this.y + 'px'
					})
			}
			Game.cubemap[_i][a.x] = _t;
			Game.cubemap[_i][a.x].el = _el;
			var _this = Game.cubemap[_i][a.x];
			_this.v = _i;
			_this.gvtocoord();
			var _f = function() {
				$(__el).remove();
			}
			$(Game.cubemap[_i][a.x].el)//move last cube
				.data({
					x : _this.g,
					y : _this.v
				})
				.animate({
					left : _this.x + 'px',
					top  : _this.y + 'px'
				}, _f);
//-----------------
			break;
	}
	if(cubescheck()) {
		this.splash(document.body.clientWidth / 2, document.body.clientHeight / 2, lang.youwin, function() {
			//win
			if(level < levels.length - 1) {level += 1;}
			new Game();
			//document.location.reload();
		}, 1000);
	}
}
var ainb = function(a, b) {//a - {x,y}, b - [{x,y}]
	for(i in b) {
		if(
			b[i].x == a.x &&
			b[i].y == a.y
		) {return true;}
	}
	return false;
}
//cube.prototype.checkcolors = function(a) {
/*
//--------------
	if(this.w == a.color) {
		var _c = {x : this.g, y : this.v};
		if(!ainb(_c, a.p2)) {
			a.p2.push(_c);
			if(this.v > 0) {
				if(Game.cubemap[parseInt(this.v) - 1][this.g].s == a.color) {
					var _c = {x : this.g, y : parseInt(this.v) - 1};
					if(!ainb(_c, a.p1)) {
						a.p1.push(_c);
					}
				}
			}
		}
	}
//--------------
	if(this.d == a.color) {
		var _c = {x : this.g, y : this.v};
		if(!ainb(_c, a.p2)) {
			a.p2.push(_c);
			if(this.g < Game.cubemap[this.v].length) {
				if(Game.cubemap[parseInt(this.v) - 1][this.g].a == a.color) {
					var _c = {x : parseInt(this.g) + 1, y : this.v};
					if(!ainb(_c, a.p1)) {
						a.p1.push(_c);
					}
				}
			}
		}
	}
//--------------
	if(this.s == a.color) {
		var _c = {x : this.g, y : this.v};
		if(!ainb(_c, a.p2)) {
			a.p2.push(_c);
			if(this.v < Game.cubemap.length) {
				if(Game.cubemap[parseInt(this.v) - 1][this.g].w == a.color) {
					var _c = {x : this.g, y : parseInt(this.v) + 1};
					if(!ainb(_c, a.p1)) {
						a.p1.push(_c);
					}
				}
			}
		}
	}
//--------------
	if(this.a == a.color) {
		var _c = {x : this.g, y : this.v};
		if(!ainb(_c, a.p2)) {
			a.p2.push(_c);
			if(this.g > 0) {
				if(Game.cubemap[parseInt(this.v) - 1][this.g].d == a.color) {
					var _c = {x : parseInt(this.g) - 1, y : this.v};
					if(!ainb(_c, a.p1)) {
						a.p1.push(_c);
					}
				}
			}
		}
	}
//--------------
	for(i in a.p1) {
		if(typeof a.p1[i] != 'undefined') {
			Game.cubemap[a.p1[i].y][a.p1[i].x].checkcolors(a);
			delete a.p1[i];
		}
	}
	return a;
}
*/
/*cube.prototype.checkcolors = function(a) {
	if(!ainb({x : this.g, y : this.v}, a.patch
	if(a.direction == 'w') {
		if(this.w == a.color && this.v > 0) {//up
			if(!ainb({x : this.g, y : this.v}, a.patch)) {
				a.patch.push({
					x : this.g,
					y : this.v,
					wasd : 'w',
					color : a.color
				});
				a.patch.concat(Game.cubemap[parseInt(this.v) - 1][this.g].checkcolors(a).patch);
			}
		}
		a.direction = 'd';
	}
	if(this.d == a.color && this.g < Game.cubemap[this.v].length - 1) {//right
		if(!ainb({x : this.g, y : this.v}, a.patch)) {
			a.patch.push({
				x : this.g,
				y : this.v,
				wasd : 'd',
				color : a.color
			});
			a.patch.concat(Game.cubemap[this.v][parseInt(this.g) + 1].checkcolors(a).patch);
		}
	}
	if(this.s == a.color && this.v < Game.cubemap.length - 1) {//down
		if(!ainb({x : this.g, y : this.v}, a.patch)) {
			a.patch.push({
				x : this.g,
				y : this.v,
				wasd : 's',
				color : a.color
			});
			a.patch.concat(Game.cubemap[parseInt(this.v) + 1][this.g].checkcolors(a).patch);
		}
	}
	if(this.a == a.color && this.g > 0) {//left
		if(!ainb({x : this.g, y : this.v}, a.patch)) {
			a.patch.push({
				x : this.g,
				y : this.v,
				wasd : 'a',
				color : a.color
			});
			a.patch.concat(Game.cubemap[this.v][parseInt(this.g) - 1].checkcolors(a).patch);
		}
	}
	return a;
}
*/
cubescheck = function() {
	var colors = 'rgby';
	var cpatches = [];
	for(var cr = 0; cr < colors.length; cr++) {
		//cpatches[cr] = [];
		//var _a = {color : colors[cr], p1 : [], p2 : []}
		var f = false;
		for(y in Game.cubemap) {//ищем первый подходящий
			for(x in Game.cubemap[y]) {
				if(
					Game.cubemap[y][x].w == colors[cr] ||
					Game.cubemap[y][x].a == colors[cr] ||
					Game.cubemap[y][x].s == colors[cr] ||
					Game.cubemap[y][x].d == colors[cr]
				) {
					if(!f) {
						f = true;
						//$(Game.cubemap[y][x].el).css({border : '3px dashed #fff'});
						Game.cubemap[y][x].checked = true;//помечаем
					}
				}
			}
		}
		while(f) {
			var count = 0;
			for(y in Game.cubemap) {
				for(x in Game.cubemap[y]) {
					var _x = parseInt(x),
						_y = parseInt(y);
					if(Game.cubemap[y][x].checked) {//помечаем все "подходящие" рядом
						//----------------
						//$(Game.cubemap[y][x].el).css({border : '3px dashed #f00'});
						//console.log('♥♦♣♠');
						if(Game.cubemap[y][x].w == colors[cr]) {
							if(y > 0) {
								if(Game.cubemap[_y - 1][x].s == colors[cr]) {
									if(!Game.cubemap[_y - 1][x].checked) {
										Game.cubemap[_y - 1][x].checked = true;
										count += 1;
										//console.log('*** w');
										//$(Game.cubemap[_y - 1][x].el).css({border : '3px dashed #f00'});
									}
								}
							}
						}
						//----------------
						if(Game.cubemap[y][x].d == colors[cr]) {
							if(x < Game.cubemap[y].length - 1) {
								if(Game.cubemap[y][_x + 1].a == colors[cr]) {
									if(!Game.cubemap[y][_x + 1].checked) {
										Game.cubemap[y][_x + 1].checked = true;
										count += 1;
										//console.log('*** d');
										//$(Game.cubemap[y][_x + 1].el).css({border : '3px dashed #f00'});
									}
								}
							}
						}
						//----------------
						if(Game.cubemap[y][x].s == colors[cr]) {
							if(y < Game.cubemap.length - 1) {
								if(Game.cubemap[_y + 1][x].w == colors[cr]) {
									if(!Game.cubemap[_y + 1][x].checked) {
										Game.cubemap[_y + 1][x].checked = true;
										count += 1;
										//console.log('*** s');
										//$(Game.cubemap[_y + 1][x].el).css({border : '3px dashed #f00'});
									}
								}
							}
						}
						//----------------
						if(Game.cubemap[y][x].a == colors[cr]) {
							if(x > 0) {
								if(Game.cubemap[y][_x - 1].d == colors[cr]) {
									if(!Game.cubemap[y][_x - 1].checked) {
										Game.cubemap[y][_x - 1].checked = true;
										count += 1;
										//console.log('*** a');
										//$(Game.cubemap[y][_x - 1].el).css({border : '3px dashed #f00'});
									}
								}
							}
						}
						//----------------
					}
				}
			}
			if(count == 0) {f = false;}
		}
		for(y in Game.cubemap) {//если "подходящих" рядом нет ищем другие "подходящие"
			for(x in Game.cubemap[y]) {
				if(
					Game.cubemap[y][x].w == colors[cr] ||
					Game.cubemap[y][x].a == colors[cr] ||
					Game.cubemap[y][x].s == colors[cr] ||
					Game.cubemap[y][x].d == colors[cr]
				) {
					if(!Game.cubemap[y][x].checked) {//если нашли, пути нет
						return false;
					}
				}
			}
		}
		for(y in Game.cubemap) {//убрать у всех пометки
			for(x in Game.cubemap[y]) {
				Game.cubemap[y][x].checked = false;
			}
		}
	}
//				if(_a.p2.length) {
//					var f = true;
//					if(!ainb({x : x, y : y}, _a.p2)) {
//						console.log(y, x, _a.p2);
//						if(
//							Game.cubemap[y][x].w == _a.color ||
//							Game.cubemap[y][x].a == _a.color ||
//							Game.cubemap[y][x].s == _a.color ||
//							Game.cubemap[y][x].d == _a.color
//						) {
							//for(i in _a.p2) {console.log('>', _a.p2[i]);}
//							return false;
//						}
//					}
//				}
//				_a = {color : colors[cr], p1 : [], p2 : []};
				//поиск путей из точки
				//точки в которые надо ходить (при добавлении смотреть не была ли такая раньше) p1
				//точки в которые не надо ходить p2
				//переходим в точку только если есть связь (один и тот же цвет у стенки)
//				var _tmp = Game.cubemap[y][x].checkcolors(_a);
//				_a.p1 = _a.p1.concat(_tmp.p1);
//				_a.p2 = _a.p2.concat(_tmp.p2);
				/*
				console.log('A', y, x, cpatches[cr].length);
				if(!ainb({x : x, y : y}, cpatches[cr])) {
//-----------------
					if(Game.cubemap[y][x].w == colors['cr']) {
						//not in patch
						if(!ainb({x : x, y : y}, cpatches[cr])) {
							//push this
							cpatches[cr].push({x : x, y : y});
							//search patch
							if(y > 0) {
								var _a = Game.cubemap[y - 1][x].checkcolors({color : colors[cr], patch : [], direction : 'w'});
								//return false if patch > 0 and _a > 0
								if(cpatches[cr].length > 0 && _a.patch.length > 0) {return false;}
							}
						}
					}
//-----------------
					if(Game.cubemap[y][x].d == colors['cr']) {
						//not in patch
						if(!ainb({x : x, y : y}, cpatches[cr])) {
							//push this
							cpatches[cr].push({x : x, y : y});
							//search patch
							if(x < Game.cubemap[y].length - 1) {
								var _a = Game.cubemap[y][x + 1].checkcolors({color : colors[cr], patch : [], direction : 'd'});
								//return false if patch > 0 and _a > 0
								if(cpatches[cr].length > 0 && _a.patch.length > 0) {return false;}
							}
						}
					}
//-----------------
					if(Game.cubemap[y][x].s == colors['cr']) {
						//not in patch
						if(!ainb({x : x, y : y}, cpatches[cr])) {
							//push this
							cpatches[cr].push({x : x, y : y});
							//search patch
							if(y < Game.cubemap.length - 1) {
								var _a = Game.cubemap[y + 1][x].checkcolors({color : colors[cr], patch : [], direction : 's'});
								//return false if patch > 0 and _a > 0
								if(cpatches[cr].length > 0 && _a.patch.length > 0) {return false;}
							}
						}
					}
//-----------------
				if(Game.cubemap[y][x].a == colors['cr']) {
					//not in patch
					if(!ainb({x : x, y : y}, cpatches[cr])) {
						//push this
						cpatches[cr].push({x : x, y : y});
						//search patch
						if(x > 0) {
							var _a = Game.cubemap[y][x - 1].checkcolors({color : colors[cr], patch : [], direction : 'a'});
							//return false if patch > 0 and _a > 0
							if(cpatches[cr].length > 0 && _a.patch.length > 0) {return false;}
						}
					}
				}
//-----------------
					var _a = Game.cubemap[y][x].checkcolors({color : colors[cr], patch : [], direction : 'w'});
					console.log('C', cpatches[cr].length, _a.patch.length);
					if(cpatches[cr].length > 0 && _a.patch.length > 0) {
						console.log('Z', y, x, cpatches[cr].length, _a.patch);
						return false;
					}
					cpatches[cr] = cpatches[cr].concat(_a.patch);
				}
				*/
//			}
//		}
		//проверка один ли путь
		//if(cpatches[cr])
//	}
	return true;
}
cube.prototype.move = function(c) {
	$(this.el).animate({
		left : this.x + 'px',
		top  : this.y + 'px'
	});
}
//-----------------------------------------------------------------------------------------
Game.map = '#map';
Game.audience = 1;
Game.g = 3;
Game.v = 3;
Game.cubes = [];
Game.cubemap = [];
Game.o = false;
function Game(a) {
	/*
	if(Game.o) {
		return;
	} else {
		Game.o = true;
	}
	*/
	this.name = "colorcubes";
	Game.v = levels[level].cubes.length;
	Game.g = levels[level].cubes[0].length;
	this.init();
	this.draw();
}
Game.prototype.init = function() {
	console.log('*** init');
	/*
	if(typeof a == 'undefined') {
		this.g = Game.g;
		this.v = Game.v;
	} else {
		this.g = (typeof a.g == 'undefined')?Game.g:a.g;
		this.v = (typeof a.v == 'undefined')?Game.v:a.v;
	}
	*/
	this.screen = {
		w : document.body.clientWidth,
		h : document.body.clientHeight
	}
	cube.l = scaling(40);
	cube.t = scaling(50);
	Game.w = this.screen.w - cube.l * 2;
	cube.size = Game.w / Game.g;
}
Game.prototype.draw = function() {
	console.log('*** draw');
	$('#startscreen').click(function() {
		$('#screen').show();
		$(this).hide();
	});
	$('#screen').css({
		width  : this.screen.w + 'px',
		height : this.screen.h + 'px'
	});
	Game.cubemap = [];
	$('.cube').remove();
	for(y in levels[level].cubes) {
		Game.cubemap[y] = [];
		for(x in levels[level].cubes[y]) {
			var _c = levels[level].cubes[y][x];
			if(_c.length == 1) {
				_c = _c + _c + _c + _c; 
			}
			//console.log('add cube ', x, y);
			//Game.cubes.push(new cube({g : x, v : y, colors : _c}));
			Game.cubemap[y][x] = new cube({g : x, v : y, colors : _c});
		}
	}
	//alert('draw3');
	$('#map')
		.css({
			height : levels[level].cubes.length    * cube.size + 'px',
			width  : levels[level].cubes[0].length * cube.size + 'px',
			left   : cube.l + 'px',
			top    : cube.t + 'px'
		})
		.swipe({
			swipeStatus : function(event, phase, direction, distance, duration, fingers) {
				if(phase == 'start') {}
				if(phase == 'end') {
					var _d = $(event.target.parentNode).data();
					if(typeof _d.x != 'undefined') {
						cubesgo({
							'direction' : direction,
							x : _d.x,
							y : _d.y
						});
					}
					//cubesgo(direction);
				}
				if(fingers > 1) {}
			}
		});
	//swipe
	//console.log('boobs');
	//alert('draw4');
}
Game.prototype.win = function() {/*170713290813XX0714*/}
//----------------------------------------------------------------------------------------
$(document).ready(function() {
	new Game();
});