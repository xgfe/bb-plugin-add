import './global';
import Core from './core';

(async ()=>{
	try{
		const core = await new Core();
		await core.init();
	}catch(e){
		console.log(e)
	}
})();