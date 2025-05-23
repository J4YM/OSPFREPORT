"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RotateCcw, StepForward, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

// Define router positions
const routers = [
  { id: 1, x: 100, y: 100, name: "Router 1" },
  { id: 2, x: 300, y: 100, name: "Router 2" },
  { id: 3, x: 500, y: 100, name: "Router 3" },
  { id: 4, x: 100, y: 300, name: "Router 4" },
  { id: 5, x: 300, y: 300, name: "Router 5" },
  { id: 6, x: 500, y: 300, name: "Router 6" },
]

// Define packet types with colors
const packetTypes = {
  hello: { name: "Hello", color: "#3b82f6", textColor: "white" },
  dbd: { name: "DBD", color: "#10b981", textColor: "white" },
  lsr: { name: "LSR", color: "#f59e0b", textColor: "black" },
  lsu: { name: "LSU", color: "#8b5cf6", textColor: "white" },
  lsack: { name: "LSAck", color: "#f43f5e", textColor: "white" },
}

// Define animation sequence
const animationSequence = [
  {
    step: 1,
    description: "Routers send Hello packets to discover neighbors",
    packets: [
      { from: 1, to: 2, type: "hello", delay: 0 },
      { from: 2, to: 1, type: "hello", delay: 500 },
      { from: 2, to: 3, type: "hello", delay: 1000 },
      { from: 3, to: 2, type: "hello", delay: 1500 },
      { from: 4, to: 5, type: "hello", delay: 2000 },
      { from: 5, to: 4, type: "hello", delay: 2500 },
      { from: 5, to: 6, type: "hello", delay: 3000 },
      { from: 6, to: 5, type: "hello", delay: 3500 },
      { from: 2, to: 5, type: "hello", delay: 4000 },
      { from: 5, to: 2, type: "hello", delay: 4500 },
    ],
  },
  {
    step: 2,
    description: "Routers exchange Database Description (DBD) packets",
    packets: [
      { from: 1, to: 2, type: "dbd", delay: 0 },
      { from: 2, to: 1, type: "dbd", delay: 500 },
      { from: 2, to: 3, type: "dbd", delay: 1000 },
      { from: 3, to: 2, type: "dbd", delay: 1500 },
      { from: 2, to: 5, type: "dbd", delay: 2000 },
      { from: 5, to: 2, type: "dbd", delay: 2500 },
    ],
  },
  {
    step: 3,
    description: "Routers request missing LSAs with Link State Request (LSR) packets",
    packets: [
      { from: 1, to: 2, type: "lsr", delay: 0 },
      { from: 2, to: 1, type: "lsr", delay: 500 },
      { from: 2, to: 3, type: "lsr", delay: 1000 },
      { from: 3, to: 2, type: "lsr", delay: 1500 },
    ],
  },
  {
    step: 4,
    description: "Routers send Link State Update (LSU) packets with actual LSAs",
    packets: [
      { from: 2, to: 1, type: "lsu", delay: 0 },
      { from: 1, to: 2, type: "lsu", delay: 500 },
      { from: 3, to: 2, type: "lsu", delay: 1000 },
      { from: 2, to: 3, type: "lsu", delay: 1500 },
      { from: 2, to: 5, type: "lsu", delay: 2000 },
      { from: 5, to: 2, type: "lsu", delay: 2500 },
    ],
  },
  {
    step: 5,
    description: "Routers acknowledge receipt with Link State Acknowledgment (LSAck) packets",
    packets: [
      { from: 1, to: 2, type: "lsack", delay: 0 },
      { from: 2, to: 1, type: "lsack", delay: 500 },
      { from: 2, to: 3, type: "lsack", delay: 1000 },
      { from: 3, to: 2, type: "lsack", delay: 1500 },
      { from: 5, to: 2, type: "lsack", delay: 2000 },
      { from: 2, to: 5, type: "lsack", delay: 2500 },
    ],
  },
]

// Packet animation component
export function PacketAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [speed, setSpeed] = useState([50])
  const [activePackets, setActivePackets] = useState<any[]>([])
  const animationRef = useRef<number>()
  const lastTimeRef = useRef<number>(0)
  const stepTimeRef = useRef<number>(0)

  // Calculate speed factor (1 = normal, 0.5 = half speed, 2 = double speed)
  const speedFactor = speed[0] / 50

  // Initialize canvas and start animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = 400
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Animation loop
    const animate = (timestamp: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp
      const deltaTime = timestamp - lastTimeRef.current
      lastTimeRef.current = timestamp

      if (isPlaying) {
        stepTimeRef.current += deltaTime * speedFactor
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw connections between routers
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1

      // Draw connections
      drawConnection(ctx, routers[0], routers[1]) // R1 - R2
      drawConnection(ctx, routers[1], routers[2]) // R2 - R3
      drawConnection(ctx, routers[3], routers[4]) // R4 - R5
      drawConnection(ctx, routers[4], routers[5]) // R5 - R6
      drawConnection(ctx, routers[1], routers[4]) // R2 - R5

      // Draw routers
      routers.forEach((router) => {
        drawRouter(ctx, router)
      })

      // Process animation sequence
      if (currentStep < animationSequence.length) {
        const sequence = animationSequence[currentStep]

        // Process packets for current step
        const newActivePackets = [...activePackets]

        // Add new packets based on timing
        sequence.packets.forEach((packet) => {
          const startTime = packet.delay
          const endTime = startTime + 2000 // 2 seconds for packet travel

          if (stepTimeRef.current >= startTime && stepTimeRef.current <= endTime) {
            // Check if packet is already active
            const existingPacket = newActivePackets.find(
              (p) =>
                p.from === packet.from && p.to === packet.to && p.type === packet.type && p.startTime === startTime,
            )

            if (!existingPacket) {
              newActivePackets.push({
                ...packet,
                startTime,
                endTime,
                progress: 0,
              })
            }
          }
        })

        // Update packet positions
        newActivePackets.forEach((packet) => {
          const elapsed = stepTimeRef.current - packet.startTime
          const duration = packet.endTime - packet.startTime
          packet.progress = Math.min(elapsed / duration, 1)

          // Remove completed packets
          if (packet.progress >= 1) {
            const index = newActivePackets.indexOf(packet)
            if (index !== -1) {
              newActivePackets.splice(index, 1)
            }
          }
        })

        // Draw active packets
        newActivePackets.forEach((packet) => {
          const fromRouter = routers.find((r) => r.id === packet.from)
          const toRouter = routers.find((r) => r.id === packet.to)

          if (fromRouter && toRouter) {
            drawPacket(ctx, fromRouter, toRouter, packet.progress, packet.type)
          }
        })

        setActivePackets(newActivePackets)

        // Check if step is complete
        const lastPacket = sequence.packets[sequence.packets.length - 1]
        if (stepTimeRef.current > lastPacket.delay + 3000 && isPlaying) {
          // Move to next step
          if (currentStep < animationSequence.length - 1) {
            setCurrentStep(currentStep + 1)
            stepTimeRef.current = 0
            setActivePackets([])
          } else {
            // Animation complete
            setIsPlaying(false)
          }
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isPlaying, currentStep, activePackets, speed])

  // Draw router on canvas
  const drawRouter = (ctx: CanvasRenderingContext2D, router: any) => {
    // Draw router circle
    ctx.beginPath()
    ctx.arc(router.x, router.y, 30, 0, Math.PI * 2)
    ctx.fillStyle = "#f8fafc"
    ctx.fill()
    ctx.strokeStyle = "#94a3b8"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw router label
    ctx.fillStyle = "#0f172a"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(`R${router.id}`, router.x, router.y)
  }

  // Draw connection between routers
  const drawConnection = (ctx: CanvasRenderingContext2D, router1: any, router2: any) => {
    ctx.beginPath()
    ctx.moveTo(router1.x, router1.y)
    ctx.lineTo(router2.x, router2.y)
    ctx.stroke()
  }

  // Draw packet moving between routers
  const drawPacket = (
    ctx: CanvasRenderingContext2D,
    fromRouter: any,
    toRouter: any,
    progress: number,
    packetType: string,
  ) => {
    const packetInfo = packetTypes[packetType as keyof typeof packetTypes]

    // Calculate packet position
    const x = fromRouter.x + (toRouter.x - fromRouter.x) * progress
    const y = fromRouter.y + (toRouter.y - fromRouter.y) * progress

    // Draw packet
    ctx.beginPath()
    ctx.arc(x, y, 15, 0, Math.PI * 2)
    ctx.fillStyle = packetInfo.color
    ctx.fill()

    // Draw packet label
    ctx.fillStyle = packetInfo.textColor
    ctx.font = "10px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(packetInfo.name, x, y)
  }

  // Play/pause animation
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  // Reset animation
  const resetAnimation = () => {
    setIsPlaying(false)
    setCurrentStep(0)
    stepTimeRef.current = 0
    setActivePackets([])
  }

  // Step forward to next animation sequence
  const stepForward = () => {
    if (currentStep < animationSequence.length - 1) {
      setCurrentStep(currentStep + 1)
      stepTimeRef.current = 0
      setActivePackets([])
    }
  }

  return (
    <div className="space-y-4">
      <div className="relative bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden border">
        <canvas ref={canvasRef} className="w-full h-[400px]" />

        <div className="absolute top-4 left-4 right-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-3 rounded-md border shadow-sm">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-primary/10">
              Step {currentStep + 1}/{animationSequence.length}
            </Badge>
            <p className="text-sm font-medium">{animationSequence[currentStep]?.description}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={togglePlay}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={resetAnimation}>
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={stepForward}
            disabled={currentStep >= animationSequence.length - 1}
          >
            <StepForward className="h-4 w-4" />
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[300px]">
                <p className="text-xs">
                  This animation shows the OSPF packet exchange process between routers. Use the controls to play,
                  pause, reset, or step through the animation.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <div className="flex-1 mx-4">
          <Slider value={speed} min={10} max={100} step={10} onValueChange={setSpeed} aria-label="Animation Speed" />
          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
            <span>Slow</span>
            <span>Animation Speed</span>
            <span>Fast</span>
          </div>
        </div>
      </div>
    </div>
  )
}
