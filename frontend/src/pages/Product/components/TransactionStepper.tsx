import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Check } from "lucide-react";

export type StepStatus = "completed" | "pending" | "upcoming";

export interface TransactionStep {
  id: number;
  label: string;
  icon: React.ElementType;
  status: StepStatus;
  description: string;
}

interface TransactionStepperProps {
  steps: TransactionStep[];
  progressPercentage: number;
}

export function TransactionStepper({
  steps,
  progressPercentage,
}: TransactionStepperProps) {
  return (
    <Card className="border-border">
      <CardHeader>
        <CardTitle className="text-lg">Transaction Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="relative">
          {/* Progress Line */}
          <div
            className="absolute top-5 left-0 right-0 h-0.5 bg-border"
            style={{ width: "calc(100% - 40px)", marginLeft: "20px" }}
          >
            <div
              className={`h-full transition-all duration-500 ${
                progressPercentage === 100 ? "bg-green-500" : "bg-accent"
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Steps */}
          <div className="relative grid grid-cols-4 gap-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = step.status === "pending";
              const isCompleted = step.status === "completed";

              return (
                <div
                  key={step.id}
                  className="flex flex-col items-center text-center"
                >
                  {/* Icon Circle */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 relative z-10 transition-all ${
                      isCompleted
                        ? "bg-green-500 border-2 border-green-500"
                        : isActive
                        ? "bg-accent border-2 border-accent animate-pulse"
                        : "bg-secondary border-2 border-border"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="h-5 w-5 text-background" />
                    ) : (
                      <Icon
                        className={`h-5 w-5 ${
                          isActive ? "text-background" : "text-muted-foreground"
                        }`}
                      />
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className={`text-sm mb-1 ${
                      isActive
                        ? "text-accent"
                        : isCompleted
                        ? "text-green-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {step.label}
                  </div>

                  {/* Description */}
                  <div className="text-xs text-muted-foreground max-w-[120px]">
                    {step.description}
                  </div>

                  {/* Active Indicator */}
                  {isActive && (
                    <Badge className="mt-2 bg-accent/20 text-accent border-accent/50 text-xs">
                      Current
                    </Badge>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
