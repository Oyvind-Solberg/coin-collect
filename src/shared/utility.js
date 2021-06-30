// CONDITION CHECKING

export function anyValuesMatches(data, match) {
	if (Array.isArray(data)) {
		return data.some((value) => value === match);
	} else if (typeof data === 'object' && data !== null) {
		return Object.values(data).some((value) => value === match);
	}
}

export function anyConditionsAreSatisfied(...conditions) {
	return conditions.some((condition) => condition);
}

export function allConditionsAreSatisfied(...conditions) {
	return conditions.every((condition) => condition);
}

// CALLBACK LOOPS

export function runIterations(callback, totalIterations, iteration = 0) {
	if (iteration < totalIterations) {
		callback(iteration);
		runIterations(callback, totalIterations, iteration + 1);
	}
}

export function runSchedulingLoop(checkRunCondition, callback, speed) {
	setTimeout(function run() {
		if (checkRunCondition()) {
			callback();
			setTimeout(run(), speed);
		}
	});
}

export function runAcceleratingSchedulingLoop(
	checkRunCondition,
	callback,
	startSpeed,
	multiplier
) {
	setTimeout(function run(speed) {
		if (checkRunCondition()) {
			callback();
			const newSpeed = speed * multiplier;
			setTimeout(run(newSpeed), startSpeed);
		}
	});
}

// OPTION SELECTION

export function selectOption(selectionCallback, options, ...overrideArgs) {
	const overrideOption = options.find(
		(option) => option.override && option.override(...overrideArgs)
	);

	if (overrideOption) {
		return overrideOption.value;
	} else {
		return selectionCallback(options);
	}
}

export function selectByRatio(options) {
	const probabilityList = createProbabilityListByRange(options);
	const randomNumber = Math.random() * probabilityList.maxRange;
	const selectedOption = probabilityList.probabilityOptions.find((option) =>
		isNumberInRange(randomNumber, option.from, option.upTo)
	);

	return selectedOption.value;
}

export function createProbabilityListByRange(options) {
	return options.reduce(
		(prevList, option) => {
			const sum = prevList.maxRange;
			const nextSum = option.ratio + prevList.maxRange;
			const probabilityOption = assignProbabilityRange(option, sum, nextSum);

			return {
				maxRange: nextSum,
				probabilityOptions: [...prevList.probabilityOptions, probabilityOption],
			};
		},

		{
			maxRange: 0,
			probabilityOptions: [],
		}
	);
}

export function assignProbabilityRange(option, minSum, maxSum) {
	const from = minSum;
	const upTo = maxSum;

	return { value: option.value, from, upTo };
}

export function isNumberInRange(number, from, upTo) {
	return number >= from && number < upTo;
}
