export function getRandom(start = 0, end = 0) {
    return Math.round(Math.random() * Math.abs(end - start)) + Math.min(start, end);
}

export function randomText(characters: number) {
    return crypto.randomUUID().substr(0, characters).toUpperCase();
}

export function getRandomCoordinate(width: number, height: number, size: number) {
    let coordinates = [];
    for (let i = 0; i < size; i++) {
        const widthGap = Math.floor(width / size);
		const coordinate = [];
		const randomWidth = widthGap * (i + 0.2);
        coordinate.push(randomWidth);
		
		const randomHeight = getRandom(30, height - 30);
		coordinate.push(randomHeight);
		coordinates.push(coordinate);
    }
    coordinates = coordinates.sort((a, b) => a[0] - b[0]);
    return coordinates;
}