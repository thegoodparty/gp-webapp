declare module 'p-limit' {
  export interface LimitFunction {
    /**
     * Returns the number of pending promises.
     */
    readonly pendingCount: number

    /**
     * Returns the number of active promises.
     */
    readonly activeCount: number

    /**
     * Clears all pending promises.
     */
    clearQueue(): void

    /**
     * Adds a new promise to the queue.
     */
    <ReturnType>(
      fn: () => PromiseLike<ReturnType> | ReturnType
    ): Promise<ReturnType>
  }

  /**
   * Run multiple promise-returning & async functions with limited concurrency.
   *
   * @param concurrency - Concurrency limit. Minimum: `1`.
   * @returns A `limit` function.
   */
  export default function pLimit(concurrency: number): LimitFunction
}
