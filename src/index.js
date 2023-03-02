import EventBus from './eventBus'
import { loadImage } from "./utils"

const RAIN_TYPE = {
    NORMAL: 1,
    CLICKED: 2,
}

export default class RainGame extends EventBus {
    constructor (options) {
        super ()

        this.$canvas = typeof options.el === 'string' ? document.querySelector(options.el) : options.el
        this.$canvas.setAttribute('width', this.$canvas.offsetWidth)
        this.$canvas.setAttribute('height', this.$canvas.offsetHeight)
        this.ctx = this.$canvas.getContext('2d')

        this.preload = options.preload
        this.interval = options.interval || 500
        this.speed = options.speed || 2
        this.horizontalMovement = options.horizontalMovement
        this.originRains = options.rains || []

        this.renderRains = []
        this.raf = null
        this.preGenerateTime = null
        this.replay = false
        this.isPlaying = false

        if (this.preload) {
            this.loadSource()
        }
    }

    async play () {
        if (this.isPlaying) {
            return
        }

        await this.loadSource()

        if (this.replay) {
            this.preGenerateTime = Date.now()
        }

        this.bindEvent()
        this.render()

        this.replay = true
        this.isPlaying = true
    }

    loadSource () {
        return this.originRains.map(this.loadImageItem)
    }

    async loadImageItem (rain) {
        if (rain.img) {
            return
        }

        rain.img = await loadImage(rain.image)

        if (rain.clicked) {
            rain.clicked.img = await loadImage(rain.clicked.image)
        }
    }

    bindEvent () {
        this.handleClickFn = this.handleClick.bind(this)

        this.$canvas.addEventListener('click', this.handleClickFn)
    }

    offEvent () {
        this.$canvas.removeEventListener('click', this.handleClickFn)
    }

    handleClick (e) {
        const { offsetX, offsetY } = e

        // 处理重叠问题, 越后出现层级越高
        for (let len = this.renderRains.length, i = len - 1; i >= 0; i--) {
            const rain = this.renderRains[i]
            const {
                x,
                y,
                width,
                height,
                rainType,
                boundary,
                originData,
            } = rain

            if (rainType === RAIN_TYPE.CLICKED) {
                continue
            }
            
            const boundaryArr = typeof boundary === 'number'
                ? new Array(4).fill(boundary)
                : Array.isArray(boundary)
                    ? boundary
                    : new Array(4).fill(0)
            
            const isWithinTop = offsetY >= y - (boundaryArr[0] || 0)
            const isWithinRight = offsetX <= x + width + (boundaryArr[1] || 0)
            const isWithinBottom = offsetY <= y + height + (boundaryArr[2] || 0)
            const isWithinLeft = offsetX >= x - (boundaryArr[3] || 0)

            const isClicked = isWithinTop && isWithinRight && isWithinBottom && isWithinLeft

            if (isClicked) {
                this.$emit('strike', originData)

                const clickedRain = originData.clicked

                if (clickedRain) {
                    const clickedRainX = x + (clickedRain.translate && clickedRain.translate[0] ? clickedRain.translate[0] : 0)
                    const clickedRainY = y + (clickedRain.translate && clickedRain.translate[1] ? clickedRain.translate[1] : 0)

                    this.removeRain(rain)
                    this.addRain({
                        img: clickedRain.img,
                        x: clickedRainX,
                        y: clickedRainY,
                        width: clickedRain.width,
                        height: clickedRain.height,
                        rainType: RAIN_TYPE.CLICKED,
                        start: Date.now(),
                        duration: clickedRain.duration || 200,
                    })

                    break
                }
            }
        }
    }

    render () {
        this.clearRect()
        this.generateRain()
        this.updateRain()
        this.drawRain()

        this.raf = window.requestAnimationFrame(this.render.bind(this))
    }

    stopRender () {
        window.cancelAnimationFrame(this.raf)
    }

    clearRect () {
        this.ctx.clearRect(0, 0, this.$canvas.width, this.$canvas.height)
    }

    generateRain () {
        if (!this.originRains.length) {
            return
        }
        
        const now = Date.now()

        if (now - this.preGenerateTime > this.interval) {
            const rain = this.getRain()
            this.addRain(rain)

            this.preGenerateTime = now
        }
    }

    getRain () {
        const ratios = this.originRains.map(rain => rain.ratio || 1)
        const total = ratios.reduce((total, ratio) => {
            total += ratio

            return total
        }, 0)
        const random = Math.random()
        let rain = null
        let left = 0
        let right = 0
        let i =0
        let len = ratios.length
        for (; i < len; i++) {
            left += (ratios[i - 1] ? ratios[i - 1] / total : 0)
            right = left + ratios[i] / total

            if (random >= left && random <= right) {
                rain = this.originRains[i]
                break
            }
        }

        return {
            originData: rain,
            img: rain.img,
            x: Math.random() * (this.$canvas.width - rain.width),
            y: -rain.height,
            width: rain.width,
            height: rain.height,
            rainType: RAIN_TYPE.NORMAL,
        }
    }

    addRain (rain) {
        this.renderRains.push(rain)
    }

    updateRain () {
        this.renderRains.filter(rain => rain.rainType === RAIN_TYPE.CLICKED).forEach(rain => {
            if (Date.now() - rain.start > rain.duration) {
                this.removeRain(rain)
            }
        })

        this.renderRains.filter(rain => rain.rainType !== RAIN_TYPE.CLICKED).forEach(rain => {
            const { x, y, width, speed, directionX } = rain
            const speedY = speed || this.speed
            const speedX = this.$canvas.offsetWidth / this.$canvas.offsetHeight * speedY

            const updateY = y + speedY
            let updateX = x

            if (this.horizontalMovement) {
                if (!directionX) {
                    rain.directionX = Math.random() > .5 ? 'right' : 'left'
                }

                updateX = x + speedX * (directionX === 'right' ? 1 : -1)

                if (updateX < 0) {
                    rain.directionX = 'right'
                }

                if (updateX > this.$canvas.width - width) {
                    rain.directionX = 'left'
                }
            }

            Object.assign(rain, {
                x: updateX,
                y: updateY,
            })
        })
    }

    drawRain () {
        this.renderRains.forEach(rain => {
            this.ctx.drawImage(rain.img, rain.x, rain.y, rain.width, rain.height)
        })
    }

    removeRain (rain) {
        const index = this.renderRains.indexOf(rain)
        index > -1 && this.renderRains.splice(index, 1)
    }

    pause () {
        this.isPlaying = false
        this.offEvent()
        this.stopRender()
    }

    // 动态添加
    async add (rain) {
        await this.loadImageItem(rain)
        this.originRains.push(rain)
    }

    // 动态移除
    remove (rain) {
        const index = this.originRains.indexOf(rain)
        index > -1 && this.originRains.splice(index, 1)
    }

    stop () {
        this.isPlaying = false
        this.renderRains = []
        this.clearRect()
        this.offEvent()
        this.stopRender()
    }
}
