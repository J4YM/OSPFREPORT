"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface RoutingTableAnimationProps {
  isPlaying: boolean
  speed: number
  zoom: number
}

// Define routing table entries that will be calculated
const routingEntries = [
  {
    destination: "10.1.1.0/24",
    nextHop: "10.1.2.2",
    interface: "GE1/0/0",
    cost: 10,
    type: "Intra-Area",
    area: "0.0.0.0",
  },
  {
    destination: "10.1.2.0/24",
    nextHop: "0.0.0.0",
    interface: "GE1/0/0",
    cost: 0,
    type: "Directly Connected",
    area: "0.0.0.0",
  },
  {
    destination: "10.1.3.0/24",
    nextHop: "10.1.2.2",
    interface: "GE1/0/0",
    cost: 30,
    type: "Intra-Area",
    area: "0.0.0.0",
  },
  {
    destination: "10.2.1.0/24",
    nextHop: "10.1.2.2",
    interface: "GE1/0/0",
    cost: 50,
    type: "Inter-Area",
    area: "0.0.0.1",
  },
  {
    destination: "10.2.2.0/24",
    nextHop: "10.1.2.2",
    interface: "GE1/0/0",
    cost: 45,
    type: "Inter-Area",
    area: "0.0.0.1",
  },
  {
    destination: "192.168.1.0/24",
    nextHop: "10.1.2.2",
    interface: "GE1/0/0",
    cost: 100,
    type: "External",
    area: "External",
  },
]

export function RoutingTableAnimation({ isPlaying, speed, zoom }: RoutingTableAnimationProps) {
  const [calculatedRoutes, setCalculatedRoutes] = useState<number[]>([])
  const [currentCalculation, setCurrentCalculation] = useState<number | null>(null)
  const timeRef = useRef<number>(0)
  const animationRef = useRef<number>()

  useEffect(() => {
    const animate = () => {
      if (isPlaying) {
        timeRef.current += 16 * (speed / 50)
      }

      // Calculate routes one by one
      const routeCalculationInterval = 1500 // 1.5 seconds per route
      const currentRouteIndex = Math.floor(timeRef.current / routeCalculationInterval)

      if (currentRouteIndex < routingEntries.length && currentRouteIndex >= 0) {
        if (!calculatedRoutes.includes(currentRouteIndex)) {
          setCurrentCalculation(currentRouteIndex)
          setTimeout(() => {
            setCalculatedRoutes((prev) => [...prev, currentRouteIndex])
            setCurrentCalculation(null)
          }, 800)
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, speed, calculatedRoutes])

  // Reset animation when not playing
  useEffect(() => {
    if (!isPlaying) {
      setCalculatedRoutes([])
      setCurrentCalculation(null)
      timeRef.current = 0
    }
  }, [isPlaying])

  const getRowClassName = (index: number) => {
    if (currentCalculation === index) {
      return "bg-yellow-100 dark:bg-yellow-900 animate-pulse"
    }
    if (calculatedRoutes.includes(index)) {
      return "bg-green-50 dark:bg-green-900"
    }
    return "opacity-30"
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Directly Connected":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "Intra-Area":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "Inter-Area":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "External":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            OSPF Routing Table Calculation
            <Badge variant="outline">
              Routes Calculated: {calculatedRoutes.length}/{routingEntries.length}
            </Badge>
          </CardTitle>
          <CardDescription>
            Watch as OSPF calculates the shortest paths and builds the routing table using Dijkstra's algorithm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {
                    calculatedRoutes.filter(
                      (routeIndex) =>
                        routingEntries[routeIndex]?.type === "Directly Connected" ||
                        routingEntries[routeIndex]?.type === "Intra-Area",
                    ).length
                  }
                </div>
                <div className="text-sm text-muted-foreground">Intra-Area Routes</div>
              </div>
              <div className="text-center p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {calculatedRoutes.filter((routeIndex) => routingEntries[routeIndex]?.type === "Inter-Area").length}
                </div>
                <div className="text-sm text-muted-foreground">Inter-Area Routes</div>
              </div>
              <div className="text-center p-3 bg-red-50 dark:bg-red-950 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {calculatedRoutes.filter((routeIndex) => routingEntries[routeIndex]?.type === "External").length}
                </div>
                <div className="text-sm text-muted-foreground">External Routes</div>
              </div>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Destination</TableHead>
                    <TableHead>Next Hop</TableHead>
                    <TableHead>Interface</TableHead>
                    <TableHead>Cost</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Area</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {routingEntries.map((entry, index) => (
                    <TableRow key={index} className={getRowClassName(index)}>
                      <TableCell className="font-mono">{entry.destination}</TableCell>
                      <TableCell className="font-mono">{entry.nextHop}</TableCell>
                      <TableCell>{entry.interface}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{entry.cost}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(entry.type)}>{entry.type}</Badge>
                      </TableCell>
                      <TableCell>{entry.area}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="space-y-2">
                <h4 className="font-medium">Calculation Process</h4>
                <div className="text-sm space-y-1">
                  <p>• SPF algorithm calculates shortest paths</p>
                  <p>• Routes are prioritized by type and cost</p>
                  <p>• Directly connected routes have cost 0</p>
                  <p>• Inter-area routes go through ABRs</p>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Route Types</h4>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">Direct</Badge>
                    <span className="text-sm">Directly connected networks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Intra</Badge>
                    <span className="text-sm">Routes within the same area</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      Inter
                    </Badge>
                    <span className="text-sm">Routes between different areas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">External</Badge>
                    <span className="text-sm">Routes from external ASBRs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
