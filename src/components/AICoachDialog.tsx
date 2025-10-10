import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AICoachDialogProps {
  type: "workout" | "meal" | "form" | "general";
  userContext?: any;
  buttonText: string;
  title: string;
  placeholder: string;
}

export const AICoachDialog = ({
  type,
  userContext,
  buttonText,
  title,
  placeholder,
}: AICoachDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message");
      return;
    }

    setIsLoading(true);
    setResponse("");

    try {
      const { data, error } = await supabase.functions.invoke('ai-fitness-coach', {
        body: {
          type,
          userContext,
          message: message.trim(),
        },
      });

      if (error) throw error;

      if (data.error) {
        toast.error(data.error);
        return;
      }

      setResponse(data.response);
    } catch (error) {
      console.error('AI coach error:', error);
      toast.error("Failed to get AI response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setMessage("");
    setResponse("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) handleClose();
      else setIsOpen(true);
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2 gradient-hero">
          <Sparkles className="h-4 w-4" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={placeholder}
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>

          <Button 
            onClick={handleSubmit} 
            disabled={isLoading || !message.trim()}
            className="w-full gradient-hero"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Getting AI Insights...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Get AI Advice
              </>
            )}
          </Button>

          {response && (
            <div className="mt-4 p-4 rounded-lg bg-muted/50 border border-primary/20">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Coach Response
              </h4>
              <div className="text-sm whitespace-pre-wrap">{response}</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
