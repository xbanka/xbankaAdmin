import { Button } from "../ui/button";

interface Props {
  onContinue: () => void;
  onBack: () => void;
  disabled?: boolean;
}

export const FooterButtons = ({ onContinue, onBack, disabled }: Props) => {
  return (
    <div className="flex gap-3 pt-4 border-t border-[var(--border-default)] mt-auto">
      <Button variant="outline" className="flex-1" onClick={onBack}>
        Back
      </Button>
      <Button
        className="flex-1 bg-[var(--button-primary-bg)] text-white"
        disabled={disabled}
        onClick={onContinue}
      >
        Review Transaction
      </Button>
    </div>
  );
};
