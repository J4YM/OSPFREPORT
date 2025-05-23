import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export function SlideContent() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>What is OSPF?</CardTitle>
          <CardDescription>Open Shortest Path First Protocol Overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            OSPF (Open Shortest Path First) is a link-state routing protocol developed by the IETF in 1988. It is
            designed for IP networks and is based on the Shortest Path First (SPF) algorithm, also known as the Dijkstra
            algorithm.
          </p>

          <p>
            As an Interior Gateway Protocol (IGP), OSPF is used within a single autonomous system. It's widely
            implemented in enterprise networks and by Internet Service Providers due to its efficiency and scalability.
          </p>

          <h3 className="text-lg font-medium mt-4">Key Features of OSPF</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>Fast convergence - quickly adapts to network changes</li>
            <li>Scalability - supports large networks through hierarchical design</li>
            <li>Efficient bandwidth usage - only sends updates when changes occur</li>
            <li>Support for VLSM (Variable Length Subnet Masking)</li>
            <li>Authentication support for secure routing updates</li>
            <li>Equal-cost multipath routing for load balancing</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>OSPF Operation</CardTitle>
          <CardDescription>How OSPF works in networks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="text-lg font-medium">OSPF Process</h3>
          <ol className="list-decimal pl-6 space-y-2">
            <li>Routers establish neighbor relationships using Hello packets</li>
            <li>Neighbors form adjacencies and synchronize their link-state databases</li>
            <li>Each router builds a complete map of the network topology</li>
            <li>Routers calculate the shortest path to each destination using Dijkstra's algorithm</li>
            <li>The best routes are installed in the routing table</li>
          </ol>

          <Separator className="my-4" />

          <h3 className="text-lg font-medium">OSPF Packet Types</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Hello:</strong> Discovers neighbors and maintains relationships
            </li>
            <li>
              <strong>Database Description (DBD):</strong> Summarizes database contents during synchronization
            </li>
            <li>
              <strong>Link State Request (LSR):</strong> Requests specific link-state records
            </li>
            <li>
              <strong>Link State Update (LSU):</strong> Sends requested link-state records
            </li>
            <li>
              <strong>Link State Acknowledgment (LSAck):</strong> Acknowledges receipt of LSUs
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>OSPF Areas</CardTitle>
          <CardDescription>Hierarchical network design with OSPF</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>
            OSPF uses a hierarchical design with areas to improve scalability. This reduces the size of the link-state
            database, minimizes processing requirements, and contains network instability.
          </p>

          <h3 className="text-lg font-medium mt-4">Area Types</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Backbone Area (Area 0):</strong> The core of the OSPF network that all other areas connect to
            </li>
            <li>
              <strong>Standard Area:</strong> Contains a complete link-state database for its area
            </li>
            <li>
              <strong>Stub Area:</strong> Does not receive external routes, uses a default route instead
            </li>
            <li>
              <strong>Totally Stubby Area:</strong> Only receives a default route from the ABR
            </li>
            <li>
              <strong>Not-So-Stubby Area (NSSA):</strong> Can import external routes but with limitations
            </li>
          </ul>

          <h3 className="text-lg font-medium mt-4">Router Types</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Internal Router:</strong> All interfaces in the same area
            </li>
            <li>
              <strong>Area Border Router (ABR):</strong> Connects multiple areas
            </li>
            <li>
              <strong>Autonomous System Boundary Router (ASBR):</strong> Connects to external networks
            </li>
            <li>
              <strong>Backbone Router:</strong> Has at least one interface in Area 0
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
