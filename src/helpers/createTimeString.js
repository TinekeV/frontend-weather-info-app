function createTimeString(timestamp) {
    const day = new Date(timestamp * 1000)

    return day.toLocaleTimeString([], )
}

export default createTimeString;