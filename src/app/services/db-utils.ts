
export function convertSnaps<T>(results) {
    // docs property gives us an array of snapshots 
    // map() a new array populated with the results of calling a provided function on every element in the calling array
    return <T[]>results.docs.map(snap => {
        // return our Course object 
        return {
            id: snap.id,
            ...<any>snap.data()
        }
    })
}
