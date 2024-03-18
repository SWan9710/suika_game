## 1. 수박게임
![](https://velog.velcdn.com/images/swan/post/d8e545f9-05d6-4c7e-ae0c-ad75f0f04dba/image.png)

목표로 하는 화면입니다.
구현이 가능할 지 모르겠지만 최선을 다해보도록 하죠!

---

## 2. Matter-js
>이번 수박게임 구현에 가장 큰 역할을 할 [Matter-js](https://brm.io/matter-js/) 입니다.

Matter-js 는 2D 게임의 물리엔진 역할을 합니다.!
![](https://velog.velcdn.com/images/swan/post/85c60fb9-c2d3-41d4-8a3a-28718528dc73/image.gif)

위의 GIF 처럼 다양한 기능들을 사용가능하게 해줍니다.

---
>Matter-js 에서 제공하는 기본 동작 방법입니다.
이걸 참고해 React에서 사용가능하게 바꾸어 보겠습니다.

![](https://velog.velcdn.com/images/swan/post/59960be1-188a-481f-8a77-6b05bc992922/image.png)


---

## 3. React 에서 사용하기

`npm install matter-js` 로 matter-js를 받아줍니다.

이후 사용을 위해 import 해줍니다.
`import Matter from "matter-js"`

이제 기본틀을 구현해 보겠습니다.

![](https://velog.velcdn.com/images/swan/post/88808b0e-717d-4ab7-9542-087f14701a0f/image.png)

구현하고자 하는 기본 화면은 이렇습니다.

---

구현하기 위해서 useEffect 에 아래와 같은 코드를 작성해 주었습니다.
![](https://velog.velcdn.com/images/swan/post/e3e92c5f-27f1-4d53-8fa9-9621ca275777/image.png)

>Matter - js 에서 제공하는 `Engine, Render, World, Bodies` 입니다.

1. Engine 을 사용하기 위해 engine 변수로 선언하여 create 해줍니다. 
 	- 이는 물리엔진 역할을 하게 됩니다.

2. render 역시 create로 선언하여 만들어줍니다.
	- render는 화면을 구성하게 됩니다. 또한 options로 `크기, 높이, 배경색, 와이어프레임 유무`를 설정해 주었습니다.
    
만약 와이어프레임을 유지한다면 

![](https://velog.velcdn.com/images/swan/post/44ea418d-a633-45e1-94c2-5182b088a115/image.png)

이런 모습으로 왼쪽벽, 오른쪽벽, 바닥, 천장선 등이 구분되어 확실히 눈에 보이게 됩니다.

---

이제 왼쪽벽, 오른쪽벽, 바닥, 천장선을 각각 설정해 보겠습니다.
![](https://velog.velcdn.com/images/swan/post/f34c62a9-8972-4125-b052-d17373613666/image.png)

>전부 useEffect 안에서 작성해 주었고, 색상과 isStatic 여부를 설정해 주었습니다.
만약 `isStatic 이 true` 라면 물리엔진에 의해 위에서 아래로 바닥이 떨어지게 됩니다.

또한 각각의 `Bodies.rectangle( ,{})` 로 설정한 숫자들은 각각
`X, Y, 너비, 높이` 를 담당합니다.

---

아까 와이어 프레임에서 확인한 물체의 `중심점이 X, Y 에 의해 설정`되고 해당 물체의 너비와 높이가 각각 중심에서 퍼져나가는 형식입니다.

---

이제 이걸 World 에 추가하여 화면을 그려보겠습니다.

![](https://velog.velcdn.com/images/swan/post/94bf475b-1ca2-4770-9668-c9476c00c0f4/image.png)

월드에 `왼쪽벽, 오른쪽벽, 바닥, 천장선` 을 추가해 주었고 Runner로 엔진을 동작시켜 주었습니다.
그리고 화면 렌더링을 실행해 주었습니다.

이제 이를 React와 연결해 주기 위해 useRef를 이용해 주었습니다.

---

전체를 감싸주는 containerRef 와 화면을 그릴 canvasRef 를 이용해 주었습니다.
전체를 감싼 div 태그 자식들을 가운데에 그리기 위해 `align="center"` 옵션도 넣어주었습니다.

---

## 4. 결과
![](https://velog.velcdn.com/images/swan/post/ff6f625d-264a-48dc-9740-afedd8dd5c7e/image.png)

원하던 대로 제대로 구현되었습니다.

---

## 5. 전체코드
```
import React, {useEffect, useRef } from 'react';
import Matter from "matter-js"

export default function MatterGame () {
  const containerRef = useRef()
  const canvasRef = useRef()

  useEffect(() => {
    let Engine = Matter.Engine
    let Render = Matter.Render
    let World = Matter.World
    let Bodies = Matter.Bodies

    let engine = Engine.create()

    let render = Render.create({
      element: containerRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        wireframes: false,
        width: 620,
        height: 850,
        background: "#F7F4C8"
      }
    })

    const leftWall = Bodies.rectangle(15, 395, 30, 790, {
      isStatic: true,
      render: { fillStyle: "#E6B143" }
    })

    const rightWall = Bodies.rectangle(605, 395, 30, 790, {
      isStatic: true,
      render: { fillStyle: "#E6B143" }
    })

    const ground = Bodies.rectangle(310, 820, 620, 60, {
      isStatic: true,
      render: { fillStyle: "#E6B143" }
    })

    const topLine = Bodies.rectangle(310, 150, 620, 2, {
      isStatic: true,
      render: { fillStyle: "#E6B143" }
    })

    World.add(engine.world, [leftWall, rightWall, ground, topLine])
    Matter.Runner.run(engine)
    Render.run(render)
  }, [])

  return (
    <div ref={containerRef} align="center">
      <canvas ref={canvasRef}></canvas>

    </div>
  )
}

```
