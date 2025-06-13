import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";

interface GuestWarningModalProps {
  open: boolean;
  onClose: () => void;
}

const GuestWarningModal: React.FC<GuestWarningModalProps> = ({ open, onClose }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>You are in Guest Mode</DialogTitle>
          <DialogDescription>
            Your portfolio data will be <span className="font-semibold text-red-500">lost</span> as soon as you go back or close this tab. Please log in or sign up to save your work and access all features.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 mt-4 flex-col sm:flex-row sm:justify-end">
          <SignInButton mode="modal">
            <Button className="w-full sm:w-auto" variant="default">
              Log In / Sign Up
            </Button>
          </SignInButton>
          <Button className="w-full sm:w-auto" variant="outline" onClick={onClose}>
            Continue as Guest
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GuestWarningModal;
