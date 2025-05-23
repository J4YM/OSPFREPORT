"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle } from "lucide-react"

const quizQuestions = [
  {
    id: 1,
    question: "What does OSPF stand for?",
    options: [
      "Open System Path First",
      "Open Shortest Path First",
      "Optimized Shortest Path Forwarding",
      "Open System Protocol Framework",
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Which algorithm does OSPF use to calculate the shortest path?",
    options: [
      "Bellman-Ford algorithm",
      "Distance Vector algorithm",
      "Dijkstra's algorithm",
      "Floyd-Warshall algorithm",
    ],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: "What type of routing protocol is OSPF?",
    options: ["Distance Vector", "Path Vector", "Link State", "Hybrid"],
    correctAnswer: 2,
  },
  {
    id: 4,
    question: "What packet type does OSPF use to discover neighbors?",
    options: ["Hello packets", "LSA packets", "Database Description packets", "Link State Request packets"],
    correctAnswer: 0,
  },
  {
    id: 5,
    question: "What is the administrative distance of OSPF?",
    options: ["90", "100", "110", "120"],
    correctAnswer: 2,
  },
  {
    id: 6,
    question: "What command is used to display OSPF neighbor information?",
    options: ["display ospf routing", "display ospf peer", "display ospf lsdb", "display ospf interface"],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: "What does LSDB stand for in OSPF?",
    options: ["Link State Data Block", "Link State Database", "Local State Database", "Link System Database"],
    correctAnswer: 1,
  },
  {
    id: 8,
    question: "Which OSPF area must all other areas connect to?",
    options: ["Area 1", "Area 0 (Backbone Area)", "Area 255", "Any area"],
    correctAnswer: 1,
  },
  {
    id: 9,
    question: "What information does the OSPF routing table contain?",
    options: [
      "Only destination IP addresses",
      "Only next-hop routers",
      "Destination IP, cost, next-hop IP, and interface information",
      "Only interface information",
    ],
    correctAnswer: 2,
  },
  {
    id: 10,
    question: "What is the primary purpose of OSPF Hello packets?",
    options: [
      "To exchange routing tables",
      "To establish and maintain neighbor relationships",
      "To send link-state advertisements",
      "To calculate shortest paths",
    ],
    correctAnswer: 1,
  },
  {
    id: 11,
    question: "In OSPF, what determines the cost of a link?",
    options: [
      "Physical distance between routers",
      "Number of hops",
      "Bandwidth of the interface",
      "Router processing power",
    ],
    correctAnswer: 2,
  },
  {
    id: 12,
    question: "What type of router connects multiple OSPF areas?",
    options: [
      "Internal Router",
      "Area Border Router (ABR)",
      "Autonomous System Boundary Router (ASBR)",
      "Designated Router (DR)",
    ],
    correctAnswer: 1,
  },
  {
    id: 13,
    question: "Which command would you use to view the OSPF Link State Database?",
    options: ["display ospf peer", "display ospf routing", "display ospf lsdb", "display ospf interface"],
    correctAnswer: 2,
  },
  {
    id: 14,
    question: "What happens when OSPF detects a topological change in the network?",
    options: [
      "The entire routing table is discarded",
      "Only affected routes are recalculated",
      "The router restarts",
      "All neighbor relationships are reset",
    ],
    correctAnswer: 1,
  },
  {
    id: 15,
    question: "In the OSPF neighbor table, what does the 'Full' state indicate?",
    options: [
      "The neighbor is unreachable",
      "The neighbor is in the process of synchronization",
      "The routers have fully synchronized their databases",
      "The neighbor has failed",
    ],
    correctAnswer: 2,
  },
]

export function QuizSection() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])

  const handleOptionSelect = (value: string) => {
    setSelectedOption(Number.parseInt(value))
  }

  const handleNextQuestion = () => {
    // Check if answer is correct
    if (selectedOption === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    // Save the answer
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = selectedOption as number
    setAnswers(newAnswers)

    // Move to next question or show results
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedOption(null)
      setShowResult(false)
    } else {
      setShowResult(true)
    }
  }

  const handleCheckAnswer = () => {
    setShowResult(true)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedOption(null)
    setShowResult(false)
    setScore(0)
    setAnswers([])
  }

  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <div className="space-y-6">
      {!showResult || currentQuestion < quizQuestions.length - 1 ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>OSPF Knowledge Quiz</CardTitle>
              <span className="text-sm text-muted-foreground">
                Question {currentQuestion + 1} of {quizQuestions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">{quizQuestions[currentQuestion].question}</h3>

              <RadioGroup value={selectedOption?.toString()} onValueChange={handleOptionSelect}>
                {quizQuestions[currentQuestion].options.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 py-2">
                    <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                    <Label htmlFor={`option-${index}`} className="flex-1">
                      {option}
                    </Label>
                    {showResult && index === quizQuestions[currentQuestion].correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {showResult &&
                      selectedOption === index &&
                      index !== quizQuestions[currentQuestion].correctAnswer && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                  </div>
                ))}
              </RadioGroup>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            {showResult ? (
              <Button onClick={handleNextQuestion}>Next Question</Button>
            ) : (
              <Button onClick={handleCheckAnswer} disabled={selectedOption === null}>
                Check Answer
              </Button>
            )}
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Quiz Results</CardTitle>
            <CardDescription>
              You scored {score} out of {quizQuestions.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={(score / quizQuestions.length) * 100} className="h-2" />

              <div className="mt-6 space-y-4">
                {quizQuestions.map((question, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start gap-2">
                      <div className="mt-0.5">
                        {answers[index] === question.correctAnswer ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium">{question.question}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                        {answers[index] !== question.correctAnswer && (
                          <p className="text-sm text-red-500 mt-1">Your answer: {question.options[answers[index]]}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={resetQuiz}>Restart Quiz</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
