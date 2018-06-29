const core = require('./core');

(async ()=>{
    try{
        await core.init();
    }catch(e){
        console.log(e)
    }
})();