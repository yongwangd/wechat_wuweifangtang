const promisify = (fn, context) => (...params) => new Promise((res, rej) => fn.call(context, ...params, (err, result) => err? rej(err): res(result)));

const delayResolve = (thing, time) => new Promise((resolve, reject) => {
	setTimeout(() => resolve(thing), time);
});

const delayReject = (thing, time) => new Promise((resolve, reject) => {
	setTimeout(() => reject(thing), time);
});

module.exports = {
	promisify,
	delayResolve,
	delayReject
};
