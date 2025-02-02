import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SignupForm } from "./SignupForm";

interface SignupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignupDialog({ open, onOpenChange }: SignupDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md mx-auto p-6">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">Sign Up for Audio Notes Guardian</DialogTitle>
        </DialogHeader>
        <SignupForm onSuccess={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
