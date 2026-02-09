import retry, { type Options } from "p-retry";

export type EventuallyParams = { that: string } & Omit<
	Options,
	"onFailedAttempt"
>;

export const eventually = async <T>(
	{ that, ...options }: EventuallyParams,
	fn: () => Promise<T>,
): Promise<T> => {
	const startTime = Date.now();
	try {
		const result = await retry(fn, {
			minTimeout: 500,
			maxTimeout: 10000,
			retries: 10,
			...options,
			onFailedAttempt: ({ error }) => {
				console.log(
					`Eventual check failed. Condition not yet met: ${that}. Error:\n${error.message}`,
				);
			},
		});
		console.log(
			`Eventual check succeeded after ${((Date.now() - startTime) / 1000).toFixed(2)}s. Condition met: ${that}`,
		);
		return result;
	} catch (error) {
		console.error(
			`Eventual wait failed after ${((Date.now() - startTime) / 1000).toFixed(2)}s. Never reached condition: ${that}`,
		);
		throw error;
	}
};

export const wait = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));
