import { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import {
  Check,
  Download,
  Calendar,
  Star,
  CheckCircle2,
  PartyPopper,
} from "lucide-react";
import { toast } from "sonner";

interface TransactionRoomCompleteProps {}

const feedbackTags = [
  "Fast Shipping",
  "Item as Described",
  "Good Packaging",
  "Great Communication",
  "Professional Seller",
  "Would Buy Again",
];

export function TransactionRoomComplete({}: TransactionRoomCompleteProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [reviewComment, setReviewComment] = useState("");

  const handleDownloadInvoice = () => {
    toast.success("Invoice Downloaded", {
      description: "Transaction invoice saved to your downloads.",
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Rating Required", {
        description: "Please select a star rating before submitting.",
      });
      return;
    }

    console.log("Feedback submitted:", {
      rating,
      tags: selectedTags,
      comment: reviewComment,
    });

    toast.success("Feedback Submitted!", {
      description: `Thank you for rating your experience with John Smith.`,
    });

    // Reset form
    setRating(0);
    setSelectedTags([]);
    setReviewComment("");
  };

  return (
    <div className="lg:col-span-2 space-y-6">
      {/* Success Banner */}
      <Card className="border-green-500/30 bg-green-500/5">
        <CardContent className="p-8">
          <div className="flex items-center gap-6">
            {/* Animated Success Icon */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 rounded-full bg-green-500/20 border-2 border-green-500 flex items-center justify-center animate-pulse">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
              </div>
            </div>

            {/* Success Message */}
            <div className="flex-1">
              <h2 className="text-3xl mb-2 text-green-500">
                Transaction Successful
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                The transaction is closed. Enjoy your Vintage Leica M6!
              </p>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-500/20 text-green-500 border-green-500/50">
                  <PartyPopper className="h-3 w-3 mr-1" />
                  Funds Released
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoice & Documents */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">Invoice & Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50 border border-border">
            <div className="flex items-center gap-8">
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Total Paid
                </div>
                <div className="text-2xl text-accent">$1,428.00</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Includes $28.00 escrow fee
                </div>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div>
                <div className="text-xs text-muted-foreground mb-1">
                  Completed Date
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Nov 30, 2025</span>
                </div>
              </div>
            </div>

            <Button variant="outline" onClick={handleDownloadInvoice}>
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Section */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-lg">
            Rate your experience with John Smith
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Your feedback helps maintain trust in the Auctionary community
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitFeedback} className="space-y-6">
            {/* Star Rating */}
            <div className="space-y-3">
              <Label>Overall Rating</Label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-10 w-10 transition-colors ${
                        star <= (hoverRating || rating)
                          ? "fill-accent text-accent"
                          : "text-muted-foreground"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-3 text-sm text-muted-foreground">
                    {rating === 1 && "Poor"}
                    {rating === 2 && "Fair"}
                    {rating === 3 && "Good"}
                    {rating === 4 && "Very Good"}
                    {rating === 5 && "Excellent"}
                  </span>
                )}
              </div>
            </div>

            <Separator />

            {/* Tag Selection */}
            <div className="space-y-3">
              <Label>What did you like? (Optional)</Label>
              <div className="flex flex-wrap gap-2">
                {feedbackTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-4 py-2 rounded-full text-sm border transition-all ${
                      selectedTags.includes(tag)
                        ? "bg-accent/20 border-accent text-accent"
                        : "bg-secondary border-border text-muted-foreground hover:border-accent/50"
                    }`}
                  >
                    {selectedTags.includes(tag) && (
                      <Check className="h-3 w-3 inline mr-1" />
                    )}
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Comment */}
            <div className="space-y-3">
              <Label htmlFor="review">Write a review (Optional)</Label>
              <Textarea
                id="review"
                placeholder="Share your experience with this seller..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Your review will be visible to other buyers
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full" size="lg">
              <CheckCircle2 className="mr-2 h-5 w-5" />
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
