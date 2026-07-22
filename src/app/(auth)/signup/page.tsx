import { WelcomePage } from '@/components/auth/welcome-auth';
import { Suspense } from 'react';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <WelcomePage />
    </Suspense>
  );
}