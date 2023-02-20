export function loadImage (src) {
    return new Promise(resolve => {
        {
            const image = new Image()
            image.src = src
            image.onload = image.onerror = resolve(image)
        }
    })
}
