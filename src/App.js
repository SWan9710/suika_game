/* eslint-disable default-case */
import React, {useEffect, useRef } from 'react';
import Matter from "matter-js"
import { FRUITS } from './fruits';
import "./App.css"
import wattermelon from "./10_watermelon.png"
import wmlevel from "./wmlevel.png"

export default function MatterGame () {
  const containerRef = useRef()
  const canvasRef = useRef(null)

  useEffect(() => {

    let currentBody = null
    let currentFruit = null
    let disableAction = false
    let interval = null

    let Engine = Matter.Engine
    let Render = Matter.Render
    let World = Matter.World
    let Body = Matter.Body
    let Bodies = Matter.Bodies
    let Events = Matter.Events
    
    let engine = Engine.create()

    let render = Render.create({
      element: containerRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        wireframes: false,
        width: 620,
        height: 850,
        background: "#ffe5c7"
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
      name: "topLine",
      isStatic: true,
      isSensor: true,
      render: { fillStyle: "#E6B143" }
    })

    function addFruit () {
      const index = Math.floor(Math.random() * 6)
      const fruit = FRUITS[index]

      const body = Bodies.circle(300, 50, fruit.radius, {
        index: index,
        isSleeping: true,
        render: {
          sprite: {texture: `${fruit.name}.png`}
        },
        // 탄성
        restitution: 0.2,
      })

      currentBody = body
      currentFruit = fruit

      World.add(engine.world, body)
    }

    window.onkeydown = (event) => {
      if (disableAction) {
        return
      }

      switch (event.code) {
        case "ArrowLeft":
          if (interval)
            return

          interval = setInterval(() => {
            if (currentBody.position.x - currentFruit.radius > 30)
              Body.setPosition(currentBody, {
              x: currentBody.position.x - 2,
              y: currentBody.position.y
            })
          }, 5)
          break

        case "ArrowRight":
          if (interval)
            return

          interval = setInterval(() => {
            if (currentBody.position.x + currentFruit.radius < 590)
              Body.setPosition(currentBody, {
              x: currentBody.position.x + 2,
              y: currentBody.position.y
            })
          }, 5)
          break
        
        case "Space":
          currentBody.isSleeping = false
          disableAction = true

          setTimeout(() => {
            addFruit()
            disableAction = false
          }, 1000)
          
          break
      }
    }

    window.onkeyup = (event) => {
      switch (event.code) {
        case "ArrowLeft":
        case "ArrowRight":
          clearInterval(interval)
          interval = null
      }
    }

    addFruit()

    Events.on(engine, "collisionStart", (event) => {
      event.pairs.forEach((collision) => {
        if (collision.bodyA.index === collision.bodyB.index) {

          // 현재 과일의 index를 저장
          const index = collision.bodyA.index

          // 수박 검사 로직
          if (index === FRUITS.length - 1) {
            return
          }

          // 과일이 충돌한 경우 월드에서 삭제
          World.remove(engine.world, [collision.bodyA, collision.bodyB])

          // 새로운 과일은 현재 index + 1 이 되어야 함
          const newFruit = FRUITS[index + 1]

          const newBody = Bodies.circle(
            collision.collision.supports[0].x,
            collision.collision.supports[0].y,
            newFruit.radius,
            {
              render: {
                sprite: { texture: `${newFruit.name}.png` }
              },
              index: index + 1
            }
          )

          World.add(engine.world, newBody)
        }

        if (!disableAction && (collision.bodyA.name === "topLine" || collision.bodyB.name === "topLine")) {
          alert("Game Over")
        }
      })
    })

    World.add(engine.world, [leftWall, rightWall, ground, topLine])
    Matter.Runner.run(engine)
    Render.run(render)

  }, [])

  return (
    <div >
      <div className="game-title"></div>

      <div className="game-main" ref={containerRef}>
        <canvas ref={canvasRef}></canvas>

        <div className="game-explain">
          <img src={wattermelon} alt="" />
          <p>수박 게임</p>
          <div>
            <img src={wmlevel} alt="" />
          </div>

          <div className="explain-text">
            <p>조작방법</p>
            <p>좌, 우 이동 : ⬅,➡</p>
            <p>과일놓기 : SPACE</p>
          </div>
          
        </div>
      </div>
    </div>
  )
}
