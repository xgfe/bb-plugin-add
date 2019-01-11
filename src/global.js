const syncTry = (func) => {
	try{
		func();
	} catch (e) {
		console.log(e);
	}
};

const asyncTry = async (func) => {
	try {
		await func();
	} catch (e) {
		console.log(e);
	}
};