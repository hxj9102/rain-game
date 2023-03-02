# rain-game

基于vue、canvas、requestAnimationFrame的高性能红包雨效果

## 效果

![](https://user-images.githubusercontent.com/58357112/220060196-fbdb615b-c3be-463b-9b77-3e742d646a9b.gif)

## 如何使用

``` bash
npm i rain-game -S
```

``` js
import RainGame from 'rain-game'

this.rainGame = new RainGame({
    el: '#canvas',
    preload: true,
    rains: [
        {
            image: require('./img/normal.webp'),
            width: 140,
            height: 120,

            clicked: {
                image: require('./img/clicked.webp'),
                width: 178,
                height: 100,
            },
      },
    ],
})
```

## 参数

| 参数               | 说明                                                         | 类型                      | 默认值 |
| ------------------ | ------------------------------------------------------------ | ------------------------- | ------ |
| el                 | 挂载的canvas元素                                             | string\|HTMLCanvasElement | -      |
| proload            | 是否预加载rains中的image图片                                 | boolean                   | true   |
| interval           | 生成红包的间隔时间                                           | number                    | 500    |
| speed              | 红包每帧移动的距离（px）                                     | number                    | 2      |
| horizontalMovement | 是否支持横向移动                                             | boolean                   | false  |
| boundary           | 点击红包边界距离，为number时表示四边的距离，为array时表示上右下左的距离 | number\|array             | -      |
| rains              | 红包数组信息                                                 | array                     | -      |

#### rains参数说明

| 参数    | 说明                                 | 类型   | 默认值 |
| ------- | ------------------------------------ | ------ | ------ |
| image   | 红包图片地址                         | string | -      |
| width   | 宽度                                 | number | -      |
| height  | 高度                                 | number | -      |
| ratio   | 出现的权重                           | number | 1      |
| speed   | 红包每帧移动的距离（px），优先级更高 | number | -      |
| clicked | 击中效果                             | object | -      |

#### clicked参数说明

| 参数      | 说明                                 | 类型   | 默认值 |
| --------- | ------------------------------------ | ------ | ------ |
| image     | 击中红包图片地址                     | string | -      |
| width     | 宽度                                 | number | -      |
| height    | 高度                                 | number | -      |
| translate | 相对于红包的x、y轴位移               | array  | -      |
| speed     | 红包每帧移动的距离（px），优先级更高 | number | -      |
| duration  | 被点击红包停留时长                   | number | 200    |

#### ratio说明

以下面例子，图片1生成的概率为1/3，图片2生成的概率为2/3。

```json
[
  {
    image: require('./img/1.png'),
    width: 140,
    height: 120,
    ratio: 1,
  },
  {
    image: require('./img/2.png'),
    width: 140,
    height: 120,
    ratio: 2,
  }
]
```

## 事件

```js
// 红包被击中，被回传红包信息
rainGame.$on('strike', (rain) => {
  console.log(rain)
})
```

## 方法

| 方法名 | 说明                                       | 参数     |
| ------ | ------------------------------------------ | -------- |
| play   | 游戏开始                                   | -        |
| pause  | 游戏暂停                                   | -        |
| clear  | 游戏停止                                   | -        |
| add    | 动态添加红包                               | rain信息 |
| remove | 若需移除红包，则传入的rain信息需包含id字段 | id       |