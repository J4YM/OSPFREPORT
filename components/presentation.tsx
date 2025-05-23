"use client"

import { useState } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, Info, Lightbulb, List, Network } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SlideContent } from "@/components/slide-content"
import { NetworkSimulation } from "@/components/network-simulation"
import { QuizSection } from "@/components/quiz-section"

const slides = [
  {
    id: "intro",
    title: "Introduction to OSPF",
    image: "/images/ospf-intro.png",
    notes:
      "OSPF (Open Shortest Path First) is a link-state routing protocol developed by the IETF in 1988. It quickly detects topological changes within autonomous systems.",
  },
  {
    id: "terms1",
    title: "OSPF Terminologies - Part 1",
    image: "/images/terminologies-1.png",
    notes:
      "Key OSPF terms include Area (logical group with area ID) and Router ID (unique identifier for routers in an OSPF area).",
  },
  {
    id: "terms2",
    title: "OSPF Terminologies - Part 2",
    image: "/images/terminologies-2.png",
    notes:
      "Cost Value is used as route metrics in OSPF. Neighbor relationships and adjacency are crucial concepts in OSPF operations.",
  },
  {
    id: "dynamic",
    title: "OSPF's Dynamic Response",
    image: "/images/dynamic-response.png",
    notes: "OSPF uses HELLO packets to establish and confirm network adjacency relationships between routers.",
  },
  {
    id: "network",
    title: "OSPF Network Implementation",
    image: "/images/network-diagram.png",
    notes:
      "This diagram shows how OSPF is implemented in a campus network with core switches, aggregation switches, and connections to office buildings.",
  },
  {
    id: "link1",
    title: "Link State Information - Part 1",
    image: "/images/link-status-1.png",
    notes:
      "OSPF routers collect link status information and store it in the LSDB (Link State Database), enabling calculation of loop-free paths.",
  },
  {
    id: "link2",
    title: "Link State Information - Part 2",
    image: "/images/link-status-2.png",
    notes:
      "OSPF routers exchange link status information rather than routes, which is essential for topology and route calculation.",
  },
  {
    id: "display1",
    title: "OSPF Display Commands - Neighbor Table",
    image: "/images/display-commands-1.png",
    notes:
      "The 'display ospf peer' command shows the OSPF neighbor table, which describes the status of neighbor relationships between OSPF routers.",
  },
  {
    id: "display2",
    title: "OSPF Display Commands - Routing Table",
    image: "/images/display-commands-2.png",
    notes:
      "The 'display ospf routing' command shows the OSPF routing table containing destination IP addresses, costs, and next-hop information for packet forwarding.",
  },
  {
    id: "display3",
    title: "OSPF Display Commands - LSDB",
    image: "/images/display-commands-3.png",
    notes:
      "The 'display ospf lsdb' command queries the Link State Database (LSDB), which contains all link state information used for topology calculations.",
  },
]

export function Presentation() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeTab, setActiveTab] = useState("slides")

  const goToNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-center mb-2 text-white drop-shadow-md">
          Open Shortest Path First (OSPF)
        </h1>
        <p className="text-center text-white/90">Interactive Learning Platform for Network Technologies</p>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/20 backdrop-blur-sm">
          <TabsTrigger value="slides" className="data-[state=active]:bg-white/90">
            <List className="h-4 w-4 mr-2" />
            Slides
          </TabsTrigger>
          <TabsTrigger value="simulation" className="data-[state=active]:bg-white/90">
            <Network className="h-4 w-4 mr-2" />
            Simulation
          </TabsTrigger>
          <TabsTrigger value="quiz" className="data-[state=active]:bg-white/90">
            <Lightbulb className="h-4 w-4 mr-2" />
            Quiz
          </TabsTrigger>
          <TabsTrigger value="about" className="data-[state=active]:bg-white/90">
            <Info className="h-4 w-4 mr-2" />
            About OSPF
          </TabsTrigger>
        </TabsList>

        <TabsContent value="slides" className="mt-6">
          <Card className="border-2 bg-white/95">
            <CardContent className="p-0 relative">
              <div className="relative aspect-[16/9] w-full overflow-hidden">
                <Image
                  src={slides[currentSlide].image || "/placeholder.svg"}
                  alt={slides[currentSlide].title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToPrevSlide}
                  disabled={currentSlide === 0}
                  className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-md">
                  {currentSlide + 1} / {slides.length}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={goToNextSlide}
                  disabled={currentSlide === slides.length - 1}
                  className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 bg-white/90 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">{slides[currentSlide].title}</h2>
            <p className="text-muted-foreground">{slides[currentSlide].notes}</p>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            {slides.map((slide, index) => (
              <TooltipProvider key={slide.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant={currentSlide === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToSlide(index)}
                      className={currentSlide === index ? "" : "bg-white/80 hover:bg-white/90"}
                    >
                      {index + 1}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{slide.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="simulation" className="mt-6">
          <div className="bg-white/95 p-4 rounded-lg">
            <NetworkSimulation />
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="mt-6">
          <div className="bg-white/95 p-4 rounded-lg">
            <QuizSection />
          </div>
        </TabsContent>

        <TabsContent value="about" className="mt-6">
          <div className="bg-white/95 p-4 rounded-lg">
            <SlideContent />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
