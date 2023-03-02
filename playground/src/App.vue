<template>
  <div id="app">
    <h3>积分：x{{ score }}</h3>
    <canvas id="canvas"></canvas>
    <button @click="play">开始</button>
    <button @click="pause">暂停</button>
    <button @click="stop">停止</button>
    <button @click="add">添加</button>
    <button @click="remove">移除</button>
  </div>
</template>

<script>
import RainGame from '../../src'

export default {
  data () {
    return {
      score: 0
    }
  },
  mounted () {
    this.rains = [
      {
        image: require('./img/normal.webp'),
        width: 140,
        height: 120,
        ratio: 1,
        score: 2,

        clicked: {
          image: require('./img/clicked.webp'),
          width: 178,
          height: 100,
          translate: [-2, -2],
        },
      },
    ]
    
    this.rainGame = new RainGame({
      el: '#canvas',
      preload: true,
      interval: 500,
      speed: 2,
      horizontalMovement: true,
      boundary: 4,
      rains: this.rains,
    })
    this.rainGame.$on('strike', (rain) => {
      this.score += rain.score
      console.log(rain)
    })
  },
  methods: {
    play () {
      this.score = 0
      this.rainGame.play()
    },
    pause () {
      this.rainGame.pause()
    },
    stop () {
      this.score = 0
      this.rainGame.stop()
    },
    add () {
      this.rainGame.add({
        id: 2,
        image: require('./img/normal1.webp'),
        width: 100,
        height: 100,
        ratio: 1,
        score: 3,

        clicked: {
          image: require('./img/clicked1.webp'),
          width: 100,
          height: 100,
          translate: [-2, -2],
        },
      })
    },
    remove () {
      this.rainGame.remove(2)
    }
  }
}
</script>

<style lang="scss">
html, body {
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  height: 100%;

  canvas {
    width: 100%;
    height: 80%;
  }

  button {
    margin-right: 8px;
    border: 1px solid #ccc;
  }
}
</style>
