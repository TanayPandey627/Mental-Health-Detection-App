import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { SurveyQuestion, SurveyResponse } from "@/types";

export function DailySurvey() {
  const today = new Date();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [currentPage, setCurrentPage] = useState(0);
  const [responses, setResponses] = useState<Partial<SurveyResponse>>({
    userId: 1,
    date: today,
    overallMood: 0,
    sleepQuality: 0,
    stressLevel: 0,
    overwhelmed: "",
    socialConnection: 0,
    completed: false,
  });

  const { data: existingSurvey, isLoading: surveyLoading } = useQuery<SurveyResponse>({
    queryKey: ['/api/survey/1/latest'],
    onSuccess: (data) => {
      if (data && new Date(data.date).toDateString() === today.toDateString()) {
        // If we have a survey from today, use its responses
        setResponses({
          ...data,
          date: today,
        });
      }
    },
    onError: () => {
      // If there's no existing survey, that's fine - we'll create a new one
    }
  });

  const submitSurveyMutation = useMutation({
    mutationFn: async (surveyData: Partial<SurveyResponse>) => {
      let response;
      if (existingSurvey && new Date(existingSurvey.date).toDateString() === today.toDateString()) {
        // Update existing survey
        response = await apiRequest('PATCH', `/api/survey/${existingSurvey.id}`, surveyData);
      } else {
        // Create new survey
        response = await apiRequest('POST', '/api/survey', surveyData);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/survey/1/latest'] });
      toast({
        title: "Survey Submitted",
        description: "Thank you for completing your daily check-in!",
      });
    },
    onError: (error) => {
      toast({
        title: "Submission Failed",
        description: `Error: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Define the survey questions
  const questions: SurveyQuestion[] = [
    {
      id: "q1",
      question: "How would you rate your overall mood today?",
      type: "scale",
      field: "overallMood",
      min: "Very Poor",
      max: "Excellent",
    },
    {
      id: "q2",
      question: "How well did you sleep last night?",
      type: "scale",
      field: "sleepQuality",
      min: "Very Poorly",
      max: "Very Well",
    },
    {
      id: "q3",
      question: "How would you rate your stress level today?",
      type: "scale",
      field: "stressLevel",
      min: "Very High",
      max: "Very Low",
    },
    {
      id: "q4",
      question: "Have you felt overwhelmed by your thoughts today?",
      type: "choice",
      field: "overwhelmed",
      options: [
        { value: "Yes, most of the day", label: "Yes, most of the day" },
        { value: "Sometimes, but manageable", label: "Sometimes, but manageable" },
        { value: "Not at all", label: "Not at all" },
      ],
    },
    {
      id: "q5",
      question: "How connected did you feel to others today?",
      type: "scale",
      field: "socialConnection",
      min: "Not connected",
      max: "Very connected",
    },
  ];

  const handleScaleSelect = (questionIndex: number, value: number) => {
    const question = questions[questionIndex];
    setResponses(prev => ({
      ...prev,
      [question.field]: value,
    }));
  };

  const handleChoiceSelect = (questionIndex: number, value: string) => {
    const question = questions[questionIndex];
    setResponses(prev => ({
      ...prev,
      [question.field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitSurveyMutation.mutate({
      ...responses,
      completed: true,
    });
  };

  const progress = currentPage === questions.length 
    ? 100 
    : Math.round((currentPage / questions.length) * 100);

  return (
    <div className="px-4 py-5">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold text-[hsl(var(--neutral-darker))]">Daily Check-in</h2>
        <div className="text-sm text-[hsl(var(--neutral-dark))]">
          {formatDate(today)}
        </div>
      </div>
      
      {/* Survey Progress */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Your Progress</h3>
            <span className="text-primary font-medium">
              {currentPage} of {questions.length} Questions
            </span>
          </div>
          
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>
      
      {/* Survey Questions */}
      <form onSubmit={handleSubmit}>
        {currentPage < questions.length ? (
          <Card className="mb-5">
            <CardContent className="p-5">
              <h3 className="font-medium mb-4">{questions[currentPage].question}</h3>
              
              {questions[currentPage].type === "scale" && (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-[hsl(var(--neutral-dark))]">{questions[currentPage].min}</span>
                    <span className="text-sm text-[hsl(var(--neutral-dark))]">{questions[currentPage].max}</span>
                  </div>
                  
                  <div className="flex justify-between space-x-2 mb-3">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        key={value}
                        type="button"
                        className={`flex-1 py-2 rounded-md ${
                          responses[questions[currentPage].field as keyof typeof responses] === value
                            ? "bg-primary text-white border border-primary"
                            : "border border-[hsl(var(--neutral-medium))] text-[hsl(var(--neutral-darker))] hover:bg-[hsl(var(--neutral-light))]"
                        }`}
                        onClick={() => handleScaleSelect(currentPage, value)}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </>
              )}
              
              {questions[currentPage].type === "choice" && (
                <div className="space-y-3">
                  {questions[currentPage].options?.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className={`w-full text-left p-3 rounded-md ${
                        responses[questions[currentPage].field as keyof typeof responses] === option.value
                          ? "border border-primary bg-primary/5 text-[hsl(var(--neutral-darker))]"
                          : "border border-[hsl(var(--neutral-medium))] text-[hsl(var(--neutral-darker))] hover:bg-[hsl(var(--neutral-light))]"
                      } flex justify-between items-center`}
                      onClick={() => handleChoiceSelect(currentPage, option.value)}
                    >
                      <span>{option.label}</span>
                      <span className={`${
                        responses[questions[currentPage].field as keyof typeof responses] === option.value
                          ? "text-primary"
                          : "text-[hsl(var(--neutral-dark))]"
                      }`}>
                        {responses[questions[currentPage].field as keyof typeof responses] === option.value
                          ? "●"
                          : "○"}
                      </span>
                    </button>
                  ))}
                </div>
              )}
              
              <div className="mt-6 flex justify-between">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                >
                  Previous
                </Button>
                <Button 
                  type="button"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={!responses[questions[currentPage].field as keyof typeof responses]}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="mb-10">
            <Card className="mb-6">
              <CardContent className="p-5">
                <h3 className="font-medium mb-3">Review Your Responses</h3>
                <p className="text-[hsl(var(--neutral-dark))] mb-4">You've answered all questions for today's check-in.</p>
                <div className="space-y-2">
                  {questions.map((q, i) => (
                    <div key={q.id} className="flex justify-between">
                      <span className="text-sm text-[hsl(var(--neutral-dark))]">{q.question.slice(0, 30)}...</span>
                      <span className="font-medium">
                        {q.type === 'choice' 
                          ? String(responses[q.field as keyof typeof responses]).split(',')[0] + '...'
                          : responses[q.field as keyof typeof responses]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="flex space-x-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex-1"
                onClick={() => setCurrentPage(questions.length - 1)}
              >
                Back to Questions
              </Button>
              <Button type="submit" className="flex-1" disabled={submitSurveyMutation.isPending}>
                {submitSurveyMutation.isPending ? "Submitting..." : "Submit Check-in"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
