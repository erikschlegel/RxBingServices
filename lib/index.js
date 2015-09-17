export * from './whats-around-me'
export * from './where-is-this'

export function validateInput(supportedInputs, requestedInputs){
		let errorSet = new Set();

		Object.keys(supportedInputs).forEach((item) => {
		   if(supportedInputs.hasOwnProperty(item)){
		   		let input = supportedInputs[item];
		   		if(input.required && !requestedInputs.hasOwnProperty(item))
		   			errorSet.add({field: input, errorMsg: 'Required Field is missing'});
	  	   }
		});

		return errorSet;
}

String.prototype.format = function(){
   var content = this;
   for (var i=0; i < arguments.length; i++)
   {
        var replacement = '{' + i + '}';
        content = content.replace(replacement, arguments[i]);  
   }
   return content;
};