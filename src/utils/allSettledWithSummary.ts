
type PromiseStatuses = 'fulfilled' | 'rejected'

type PromiseItem<T> = { status: PromiseStatuses; value: T; reason?: any; }

export type SettledSummary<T> = {
    fulfilled: number;
    rejected: number;
    result?: Array<PromiseItem<T>>
}

export const allSettledWithSummary = async <P extends Promise<any>, R = Awaited<P>>(promises: Array<P>) => {
    const summary: SettledSummary<R> = {
        fulfilled: 0,
        rejected: 0,
    }

    summary.result = await Promise.all(
        promises.map(p => p
            .then(value => {
                summary.fulfilled++
                return {
                    status: "fulfilled",
                    value
                } as PromiseItem<R>
            })
            .catch(reason => {
                summary.rejected++
                return {
                    status: "rejected",
                    reason
                } as PromiseItem<R>
            })
        )
    )

    return summary
};
