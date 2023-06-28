export const allSettledWithSummary = async (promises) => {
    let summary = {
        fulfilled: 0,
        rejected: 0
    }

    summary.result = await Promise.all(
        promises.map(p => p
            .then(value => {
                summary.fulfilled++
                return {
                    status: "fulfilled",
                    value
                }
            })
            .catch(reason => {
                summary.rejected++
                return {
                    status: "rejected",
                    reason
                }
            })
        )
    )

    return summary
};
