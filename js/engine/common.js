var logConfig_addTimestamp=true;

function log(msg){

	var msgLocal = msg;
	if (logConfig_addTimestamp){
		msgLocal = "["+new Date()+"]  "+msgLocal;
	}
	console.log(msgLocal);	
}

