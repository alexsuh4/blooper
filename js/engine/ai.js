
//terrain
//entities
//game flow --> 
//		subscribe state change 
//			react according to script
//		states
//			publish game state change
// implement visior
//entities
function getEntities(){
	return [
		
		{x:10 , y:3 , name:'red-blob' },
		{x:1 , y:1 , name:'person' },
		{x:20 , y:10 , name:'red-blob' },
	];
}

function getSupportedAiBehaviours(){
	return {
		'2dtack': {
			name:'2dtrack', 
			behaviour:function TrackerAI(me,context,trackWho){
						this.step=function (){
							//close enough ? 
							var threshold = 1;
							var dist = Utils.distPt(me.location , trackWho.location);
							if (dist <= threshold)
							{
								context.broadcast({name:'collision' , data :{origin:me,collideWith:trackWho}});
								return;
							}
							
							//try track 
							vector = { x : 0, y : 0 };
							vector.x=  Math.sign(me.location.x - trackWho.location.x);
							vector.y=  Math.sign(me.location.y - trackWho.location.y);
							
							me.movmentVector = vector;
							 
							//collision
							//path finding
							//if close enough .. broadcast found - todo something when tracked 
							//happens each resolve AI game loop
						}
			}

		}
		
	}
}

function GameContext(){
	var broadcasts={};
	this.broadcast=function(item){
		if (broadcasts[name]){
			var subscribers = broadcasts[name];
			for( var x = 0 ; x < subscribers.length ; x++ ){
				subscribers[x](item);
			}
		}
		//item.name;
		//item.args;
	}
	this.subscribe=function(filter,subscriber){
		if (!broadcasts[filter]){
			broadcasts[filter]=[];
		}
		broadcasts[filter].push(subscriber);
	}
}
Math.sign=function(a) {
	if( !a){
		return 0;
	}	
	return a > 0 ? 1 : -1;
}
var Utils={};
Utils.distPt = function (pt1,pt2){
	var dx = pt1.x - pt2.x;
	var dy = pt1.y - pt2.y;
	return Math.sqrt(dx * dx + dy * dy);
}

//2d track
var aiEngine;
function setupAI(){
	aiEngine==new DynamicEntitiesEngine();
	
	var entity={};
	aiEngine.add
	
	return aiEngine;
}

function DynamicEntitiesEngine(){
	var entities=[];
	this.add=function(entity){
	}
	this.remove=function(entity){
	}
	this.step=function(){
		for (var i  = 0; i < entities.length ; i ++ ) { 
			entities[i].step();
		}
	}
}
