// components/transaction/crypto-transaction-steps.tsx
"use client";

import { useState } from "react";
import { CryptoStepOne } from "./crypto-step-one";
import { CryptoStepTwo } from "./crypto-step-two";
import { CryptoStepThree } from "./crypto-step-three";
import { CryptoStepFour } from "./crypto-step-four";

interface CryptoTransactionStepsProps {
  handleClose: () => void;
  onBack: () => void; // goes back to service type selection
}

export function CryptoTransactionSteps({
  handleClose,
  onBack,
}: CryptoTransactionStepsProps) {
  const [step, setStep] = useState(1);

  const next = () => setStep((s) => s + 1);
  const back = () => {
    if (step === 1) onBack();
    else setStep((s) => s - 1);
  };

  return (
    <>
      {step === 1 && <CryptoStepOne onContinue={next} onBack={back} />}
      {step === 2 && <CryptoStepTwo onContinue={next} onBack={back} />}
      {step === 3 && <CryptoStepThree onContinue={next} onBack={back} />}
      {step === 4 && (
        <CryptoStepFour onClose={handleClose} onBack={back} goToStep={setStep} />
      )}
    </>
  );
}