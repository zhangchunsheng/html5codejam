YUI.add('dice', function (Y) {

function Dice() {
    Dice.superclass.constructor.apply( this, arguments );
}

Y.Dice = Y.extend( Dice, Y.Widget, {
	
	renderUI: function () {
	},
	
	bindUI: function () {
		this.after('stateChange', this._afterStateChange);
	},
	
	play: function () {
		this.set('state', {
			translateX: this._getRandomTranslate(),
			translateY: this._getRandomTranslate(),
			translateZ: 0,
			rotateX: this._getRandomRotate(),
			rotateY: this._getRandomRotate(),
			rotateZ: this._getRandomRotate()
		});
	},
	
	syncUI: function () {
		this.reset();
	},
	
	reset: function () {
		this.set('state', {
			translateX: 0,
			translateY: 0,
			translateZ: 0,
			rotateX: '0deg',
			rotateY: '0deg',
			rotateZ: '0deg'
		})
	},
	
	_getCurrentText: function () {
		
	},
	
	_getRandomRotate: function () {
		return (Math.random() > 0.5 ? 1 : -1) * ( 1080 + 90 * parseInt(Math.random() * 10) ) + 'deg';
	},
	
	_getRandomTranslate: function () {
		return (Math.random() > 0.5 ? 1 : -1) * parseInt(Math.random() * 100) + 'px';
	},
	
	_afterStateChange: function (e) {
		var state = e.newVal;
		this.get('contentBox')._node.style.webkitTransform = 'translateX(' + state.translateX + ') translateY(' + state.translateY + ') translateZ(' + state.translateZ + ') rotateX(' + state.rotateX + ') rotateY(' + state.rotateY + ') rotateZ(' + state.rotateZ + ')';
		
	}
}, {
	NAME: 'dice',
	
	ATTRS: {
		texts: {
			value: ['1', '2', '3', '4', '5', '6']
		},
		
		state: {
			value: {
				translateX: 0,
				translateY: 0,
				translateZ: 0,
				rotateX: '0deg',
				rotateY: '0deg',
				rotateZ: '0deg'	
			}
		}
	},
	HTML_PARSER: {
		texts: function (cb) {
			var a = [];
			
			cb.all('> div').each(function (item) {
				a.push( item.getContent() );
			});
			
			return a;
		}
	}
});

},'3.3.0' ,{ requires:['widget', 'anim'] });
