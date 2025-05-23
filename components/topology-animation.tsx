"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TopologyAnimationProps {
  isPlaying: boolean
  speed: number
  zoom: number
  onReset: () => void
}

// Define network topology
const routers = [
  { id: 1, x: 150, y: 100, name: "R1", area: "0.0.0.0", cost: 0 },
  { id: 2, x: 350, y: 100, name: "R2", area: "0.0.0.0", cost: 10 },
  { id: 3, x: 550, y: 100, name: "R3", area: "0.0.0.1", cost: 20 },
  { id: 4, x: 150, y: 300, name: "R4", area: "0.0.0.0", cost: 15 },
  { id: 5, x: 350, y: 300, name: "R5", area: "0.0.0.0", cost: 5 },
  { id: 6, x: 550, y: 300, name: "R6", area: "0.0.0.1", cost: 25 },
]

const links = [
  { from: 1, to: 2, cost: 10, status: "up" },
  { from: 2, to: 3, cost: 20, status: "up" },
  { from: 1, to: 4, cost: 15, status: "up" },
  { from: 4, to: 5, cost: 5, status: "up" },
  { from: 5, to: 6, cost: 25, status: "up" },
  { from: 2, to: 5, cost: 8, status: "up" },
  { from: 3, to: 6, cost: 12, status: "up" },
]

export function TopologyAnimation({ isPlaying, speed, zoom, onReset }: TopologyAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [discoveredLinks, setDiscoveredLinks] = useState<number[]>([])
  const [activeRouter, setActiveRouter] = useState<number | null>(null)
  const animationRef = useRef<number>()
  const timeRef = useRef<number>(0)

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

    const animate = (timestamp: number) => {
      if (isPlaying) {
        timeRef.current += 16 * (speed / 50) // Adjust speed
      }

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Scale based on zoom
      const scale = zoom / 100

      // Draw areas
      drawArea(ctx, "Area 0.0.0.0", 50, 50, 400, 280, "#e3f2fd", scale)
      drawArea(ctx, "Area 0.0.0.1", 450, 50, 200, 280, "#f3e5f5", scale)

      // Animate link discovery
      const linkDiscoveryInterval = 2000 // 2 seconds per link
      const currentLinkIndex = Math.floor(timeRef.current / linkDiscoveryInterval)

      if (currentLinkIndex < links.length && !discoveredLinks.includes(currentLinkIndex)) {
        setDiscoveredLinks((prev) => [...prev, currentLinkIndex])
        setActiveRouter(links[currentLinkIndex].from)
        setTimeout(() => setActiveRouter(null), 1000)
      }

      // Draw links
      links.forEach((link, index) => {
        const isDiscovered = discoveredLinks.includes(index)
        const isAnimating = currentLinkIndex === index && timeRef.current % linkDiscoveryInterval < 1000

        drawLink(ctx, link, isDiscovered, isAnimating, scale)
      })

      // Draw routers
      routers.forEach((router) => {
        const isActive = activeRouter === router.id
        drawRouter(ctx, router, isActive, scale)
      })

      // Draw legend
      drawLegend(ctx)

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [isPlaying, speed, zoom, discoveredLinks, activeRouter])

  // Reset animation when onReset is called
  useEffect(() => {
    if (!isPlaying) {
      setDiscoveredLinks([])
      setActiveRouter(null)
      timeRef.current = 0
    }
  }, [onReset, isPlaying])

  const drawArea = (
    ctx: CanvasRenderingContext2D,
    name: string,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    scale: number,
  ) => {
    ctx.save()
    ctx.scale(scale, scale)

    // Draw area background
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)

    // Draw area border
    ctx.strokeStyle = "#666"
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])
    ctx.strokeRect(x, y, width, height)
    ctx.setLineDash([])

    // Draw area label
    ctx.fillStyle = "#333"
    ctx.font = "14px Arial"
    ctx.fillText(name, x + 10, y + 20)

    ctx.restore()
  }

  const drawRouter = (ctx: CanvasRenderingContext2D, router: any, isActive: boolean, scale: number) => {
    ctx.save()
    ctx.scale(scale, scale)

    // Draw router circle
    ctx.beginPath()
    ctx.arc(router.x, router.y, 25, 0, Math.PI * 2)

    if (isActive) {
      ctx.fillStyle = "#fbbf24"
      ctx.shadowColor = "#f59e0b"
      ctx.shadowBlur = 10
    } else {
      ctx.fillStyle = "#3b82f6"
    }

    ctx.fill()
    ctx.shadowBlur = 0

    // Draw router border
    ctx.strokeStyle = "#1e40af"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw router label
    ctx.fillStyle = "white"
    ctx.font = "12px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(router.name, router.x, router.y)

    // Draw router ID below
    ctx.fillStyle = "#333"
    ctx.font = "10px Arial"
    ctx.fillText(`ID: ${router.id}.${router.id}.${router.id}.${router.id}`, router.x, router.y + 40)

    ctx.restore()
  }

  const drawLink = (
    ctx: CanvasRenderingContext2D,
    link: any,
    isDiscovered: boolean,
    isAnimating: boolean,
    scale: number,
  ) => {
    const fromRouter = routers.find((r) => r.id === link.from)
    const toRouter = routers.find((r) => r.id === link.to)

    if (!fromRouter || !toRouter) return

    ctx.save()
    ctx.scale(scale, scale)

    // Draw link line
    ctx.beginPath()
    ctx.moveTo(fromRouter.x, fromRouter.y)
    ctx.lineTo(toRouter.x, toRouter.y)

    if (isAnimating) {
      ctx.strokeStyle = "#f59e0b"
      ctx.lineWidth = 4
      ctx.setLineDash([10, 5])
    } else if (isDiscovered) {
      ctx.strokeStyle = "#10b981"
      ctx.lineWidth = 3
    } else {
      ctx.strokeStyle = "#d1d5db"
      ctx.lineWidth = 1
    }

    ctx.stroke()
    ctx.setLineDash([])

    // Draw cost label
    if (isDiscovered) {
      const midX = (fromRouter.x + toRouter.x) / 2
      const midY = (fromRouter.y + toRouter.y) / 2

      ctx.fillStyle = "white"
      ctx.fillRect(midX - 15, midY - 8, 30, 16)
      ctx.strokeStyle = "#10b981"
      ctx.lineWidth = 1
      ctx.strokeRect(midX - 15, midY - 8, 30, 16)

      ctx.fillStyle = "#333"
      ctx.font = "10px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(link.cost.toString(), midX, midY)
    }

    ctx.restore()
  }

  const drawLegend = (ctx: CanvasRenderingContext2D) => {
    const legendX = 20
    const legendY = 20

    // Legend background
    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.fillRect(legendX, legendY, 200, 100)
    ctx.strokeStyle = "#ccc"
    ctx.strokeRect(legendX, legendY, 200, 100)

    // Legend items
    ctx.fillStyle = "#333"
    ctx.font = "12px Arial"
    ctx.textAlign = "left"

    ctx.fillText("Legend:", legendX + 10, legendY + 20)

    // Active router
    ctx.fillStyle = "#fbbf24"
    ctx.fillRect(legendX + 10, legendY + 30, 15, 15)
    ctx.fillStyle = "#333"
    ctx.fillText("Active Router", legendX + 35, legendY + 42)

    // Discovered link
    ctx.strokeStyle = "#10b981"
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(legendX + 10, legendY + 55)
    ctx.lineTo(legendX + 25, legendY + 55)
    ctx.stroke()
    ctx.fillText("Discovered Link", legendX + 35, legendY + 58)

    // Undiscovered link
    ctx.strokeStyle = "#d1d5db"
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.moveTo(legendX + 10, legendY + 75)
    ctx.lineTo(legendX + 25, legendY + 75)
    ctx.stroke()
    ctx.fillText("Undiscovered Link", legendX + 35, legendY + 78)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Network Topology Discovery
            <Badge variant="outline">
              Links Discovered: {discoveredLinks.length}/{links.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Watch as OSPF routers discover the network topology and calculate link costs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-slate-50 dark:bg-slate-900 rounded-lg overflow-hidden border">
            <canvas ref={canvasRef} className="w-full h-[400px]" />
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium">Network Areas</h4>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-100 border border-blue-300"></div>
                  <span className="text-sm">Area 0.0.0.0 (Backbone)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-100 border border-purple-300"></div>
                  <span className="text-sm">Area 0.0.0.1 (Standard)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium">Router Information</h4>
              <div className="text-sm space-y-1">
                <p>• Routers discover neighbors through Hello packets</p>
                <p>• Link costs are calculated based on bandwidth</p>
                <p>• Topology database is synchronized across area</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
