//original taken from: https://davidwalsh.name/javascript-polling
/**
 *
 * @param fn
 * @param timeout
 * @param interval
 */
export function poll(fn: () => any, timeout = 2000, interval = 100) : Promise<any> {
	const endTime = Number(new Date()) + timeout;

	const checkCondition = function (resolve: (arg0: any) => void, reject: (arg0: Error) => void, ...args) {
		// If the condition is met, we're done!
		const result = fn();
		if (result) {
			resolve(result);
		}
		// If the condition isn't met but the timeout hasn't elapsed, go again
		else if (Number(new Date()) < endTime) {
			setTimeout(checkCondition, interval, resolve, reject);
		}
		// Didn't match and too much time, reject!
		else {
			reject(new Error('timed out for ' + fn + ': ' + args));
		}
	};

	return new Promise(checkCondition);
}
