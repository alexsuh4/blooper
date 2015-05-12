//map using sprite sheet
var mapData = [
	{x:1 , y:1 , name:'earth' },
	{x:2 , y:1 , name:'earth' },
	{x:3 , y:1 , name:'earth' },
	{x:4 , y:1 , name:'earth' },
	{x:5 , y:1 , name:'earth' },
	{x:6 , y:1 , name:'earth' },
	{x:7 , y:1 , name:'earth' },
	
	{x:1 , y:2 , name:'grass' },
	{x:2 , y:2 , name:'grass' },
	{x:3 , y:2 , name:'grass' },
	{x:4 , y:2 , name:'grass' },
	{x:5 , y:2 , name:'grass' },
	{x:6 , y:2 , name:'sea' },
	{x:7 , y:2 , name:'sea' },
	
];

//Sprite sheet
var spriteSheetData={
	url : 'img/sprite16X128.png',
	h:1,
	w:8,
	size:16,
	objects:[
				{objName: 'earth' , sprites : [{x:1,y:0,spriteName:'earth'}]},
				{objName: 'grass' , sprites : [{x:2,y:0,spriteName:'grass'}]},
				{objName: 'sea' , sprites : [{x:3,y:0,spriteName:'sea'}]},	
				{objName: 'person' , sprites : [{x:4,y:0,spriteName:'person'}]},
				{objName: 'person' , sprites : [{x:4,y:0,spriteName:'person'},{x:5,y:0,spriteName:'person1'}]},
				{objName: 'red-blob' , sprites : [{x:6,y:0,spriteName:'red-blob'},{x:7,y:0,spriteName:'red-blob1'}]}
	]
}

function loadEntities(entities){
	for (var i  = 0; i < entities.length ; i ++ ) { 
		
		var entity = entities[i];
		var dObj = spriteMgr.createSprite(entity.name);
		dObj.location.normalized.x=entity.x;
		dObj.location.normalized.y=entity.y;
		dObj.location.isProject=false;
		dObj.isAnimate=true;
		scene.addObj(dObj)
	}
	
}

function loadMap(map){
	for (var i  = 0; i < map.length ; i ++ ) { 
		var tile = map[i];
		
		var dObj = spriteMgr.createSprite(tile.name);
		dObj.location.normalized.x=tile.x;
		dObj.location.normalized.y=tile.y;
		dObj.location.isProject=true;
		dObj.isAnimate=false;
		scene.addObj(dObj);
	}
}

//init scene containers
function init(){
 appScreen=new Screen('#screen');
 scene=new Scene(appScreen);
}
var appScreen;
var scene;
var refresh=1000;
var spriteMgr;

function SpritesManager(spriteSheet){
	var spriteUrl=spriteSheet.url;
	var size = spriteSheet.size;
	var w = spriteSheet.w;
	var h = spriteSheet.h;
	
	var dict={};
	
	for (x = 0; x < spriteSheet.objects.length ; x ++ ) { 
		var object = spriteSheet.objects[x];
		dict[object.objName]=object;
	}
	
	this.createSprite = function(name){
		var spriteObj = dict[name];
		return createFromObject(spriteObj);
	}
	function createFromObject(spriteObj){
	
		var dObj=new DisplayObj();
				dObj.id=spriteObj.objName;
				for( var si = 0 ; si < spriteObj.sprites.length ; si++ ){
						var sprite = spriteObj.sprites[si];
						dObj.addSprite(spriteUrl , size , sprite.x * size, sprite.y * size , sprite.spriteName);
						dObj.sprite=sprite;
						dObj.isMarked=true;	
						dObj.isAnimate=true;
				}
		return dObj;
	}
}

function loadSprites(spriteSheet){
	spriteMgr = new SpritesManager(spriteSheet);		
}

function startScene(){

	var timeout;
	//Start animation loop
	var loop=function (){
		scene.render();
		setTimeout(loop,refresh);
	};
	loop();
	timeout=setTimeout(loop,refresh);
}

function Scene(screen)
{
	var dObjs=[];
	this.addObj=function (dObj){
		screen.init(dObj);
		dObjs.push(dObj);
	}
	
	function projectToViewport(location){
		var w = SPRITE_W;
		var h = SPRITE_H;
		
		if (location.isProject){
			location.projectedToViewport.x = location.normalized.x * w;
			location.projectedToViewport.y = location.normalized.y * h;		
		}
		else {
			location.projectedToViewport.x = location.normalized.x;
			location.projectedToViewport.y = location.normalized.y;
		}
		
	}
	
	this.render=function(){
		for(var x = 0 ; x < dObjs.length ; x ++){
			projectToViewport(dObjs[x].location);
			screen.update(dObjs[x]);
		}
	}
}

function Screen(selector)
{
	var me=this;
	this.init = function(dObj){
		dObj.deploy(selector);
	}
	this.update=function(dObj){
		dObj.update();
	}
}

var SPRITE_H=16;
var SPRITE_W=16;

function DisplayObj()
{
	var element=$('<div></div>');
	var sprites={};
	var states=[];
	var currentStateName;
	var currentStateIdx=0;
	var lastFrameChangeDate;
	var me=this;
	
	this.location = {};
	this.location.normalized={};
	this.location.normalized.x=0;
	this.location.normalized.y=0;
	this.location.projectedToViewport={};
	this.location.projectedToViewport.x=0;
	this.location.projectedToViewport.y=0;
	this.location.isProject = false; 
	
	this.isMarked=false;
	this.animateRateMilli=500;
	this.isAnimate=false;
	this.id='';
	
	this.element=element;
	this.addSprite=function(spriteUrl,size,x,y,stateName){
			var spriteInfo={
				spriteUrl:spriteUrl,
				size:size,
				x:x,
				y:y,
				stateName:stateName
			}
			sprites[stateName]=spriteInfo;
			states.push(stateName);
			currentStateIdx=states.length-1;
			currentStateName=stateName;
			
			element.css('width',SPRITE_W);
			element.css('height',SPRITE_H);
			element.css('background-image',"url('"+spriteUrl+"')");
			element.css('position',"absolute");
	}
	this.deploy=function (screen){
		$(screen).append(element);
	}
	this.remove=function(){
		$(screen).remove(element);
	}
	function currentSprite(){
		return sprites[currentStateName];
	}
	
	function isNeedToChangeFrame(){
		
		return !lastFrameChangeDate || 
			new Date() - lastFrameChangeDate > me.animateRateMilli;
	}
	function animate()
	{
		
		//check if need to change frame 
		if (!isNeedToChangeFrame())
		{
			return;
		}		
		
		//change frame 
		currentStateIdx = (currentStateIdx + 1) % states.length;
		currentStateName=states[currentStateIdx];
		lastFrameChangeDate=new Date();
	}
	var lastFrameChange;
	this.update=function(){
		
		if (me.isAnimate){
			animate();
		}
		
		var current = sprites[currentStateName];
		element.css('background-position',current.x+'px'+' '+current.y+'px');		
		element.css('left',me.location.projectedToViewport.x+'px');
		element.css('top',me.location.projectedToViewport.y+'px');
		element.css('border',me.isMarked?'1px solid #000000':'none');		
	}
}
