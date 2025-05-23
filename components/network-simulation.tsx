"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { PacketAnimation } from "@/components/packet-animation"
import { TopologyAnimation } from "@/components/topology-animation"
import { RoutingTableAnimation } from "@/components/routing-table-animation"

export function NetworkSimulation() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState([50])
  const [zoom, setZoom] = useState([100])
  const [simulationTab, setSimulationTab] = useState("topology")

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const resetSimulation = () => {
    setIsPlaying(false)
    // Reset simulation state
  }

  const increaseZoom = () => {
    if (zoom[0] < 200) {
      setZoom([zoom[0] + 10])
    }
  }

  const decreaseZoom = () => {
    if (zoom[0] > 50) {
      setZoom([zoom[0] - 10])
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="network" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="network">Network Topology</TabsTrigger>
          <TabsTrigger value="packets">Packet Exchange</TabsTrigger>
        </TabsList>

        <TabsContent value="network" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>OSPF Network Simulation</CardTitle>
              <CardDescription>Visualize how OSPF routers establish adjacencies and calculate routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="icon" onClick={resetSimulation}>
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex-1 mx-4">
                  <Slider
                    value={speed}
                    min={10}
                    max={100}
                    step={10}
                    onValueChange={setSpeed}
                    aria-label="Simulation Speed"
                  />
                  <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                    <span>Slow</span>
                    <span>Simulation Speed</span>
                    <span>Fast</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={decreaseZoom}>
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={increaseZoom}>
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Tabs defaultValue="topology" className="mt-4" value={simulationTab} onValueChange={setSimulationTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="topology">Network Topology</TabsTrigger>
                  <TabsTrigger value="packets">OSPF Packets</TabsTrigger>
                  <TabsTrigger value="routes">Routing Table</TabsTrigger>
                </TabsList>

                <TabsContent value="topology" className="mt-4">
                  <TopologyAnimation isPlaying={isPlaying} speed={speed[0]} zoom={zoom[0]} onReset={resetSimulation} />
                </TabsContent>

                <TabsContent value="packets" className="mt-4">
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 min-h-[400px]">
                    <PacketAnimation />
                  </div>
                </TabsContent>

                <TabsContent value="routes" className="mt-4">
                  <RoutingTableAnimation isPlaying={isPlaying} speed={speed[0]} zoom={zoom[0]} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packets" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>OSPF Packet Exchange Animation</CardTitle>
              <CardDescription>
                Visualize how OSPF routers exchange different types of packets to establish adjacencies and share
                link-state information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PacketAnimation />

              <div className="mt-6 space-y-4">
                <h3 className="font-medium">OSPF Packet Types</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border rounded-md p-3 bg-blue-50 dark:bg-blue-950">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900">
                        Type 1
                      </Badge>
                      <h4 className="font-medium">Hello Packet</h4>
                    </div>
                    <p className="text-sm">
                      Used to discover and maintain neighbor relationships. Sent periodically to establish and confirm
                      adjacencies.
                    </p>
                  </div>

                  <div className="border rounded-md p-3 bg-green-50 dark:bg-green-950">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900">
                        Type 2
                      </Badge>
                      <h4 className="font-medium">Database Description (DBD)</h4>
                    </div>
                    <p className="text-sm">
                      Contains a summary of the link-state database. Used during the initial synchronization between
                      routers.
                    </p>
                  </div>

                  <div className="border rounded-md p-3 bg-amber-50 dark:bg-amber-950">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900">
                        Type 3
                      </Badge>
                      <h4 className="font-medium">Link State Request (LSR)</h4>
                    </div>
                    <p className="text-sm">
                      Used to request specific link-state records from a neighbor router during database
                      synchronization.
                    </p>
                  </div>

                  <div className="border rounded-md p-3 bg-purple-50 dark:bg-purple-950">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900">
                        Type 4
                      </Badge>
                      <h4 className="font-medium">Link State Update (LSU)</h4>
                    </div>
                    <p className="text-sm">
                      Contains actual link-state advertisements (LSAs). Used to respond to LSR packets and flood
                      topology changes.
                    </p>
                  </div>

                  <div className="border rounded-md p-3 bg-rose-50 dark:bg-rose-950 md:col-span-2">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="bg-rose-100 dark:bg-rose-900">
                        Type 5
                      </Badge>
                      <h4 className="font-medium">Link State Acknowledgment (LSAck)</h4>
                    </div>
                    <p className="text-sm">
                      Used to acknowledge the receipt of LSU packets, ensuring reliable delivery of link-state
                      information.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
