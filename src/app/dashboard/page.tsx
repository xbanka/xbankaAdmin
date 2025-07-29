import { Card } from "@/components/ui/card";
import React from "react";

const HomePage = () => {
  return (
    <div>
      <div>
        <h1 className="text-[22px] font-[700] leading-[26px]">Welcome Back Admin</h1>
        <p>Heres whats happening today</p>
      </div>
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card className="bg-muted/50 aspect-video rounded-xl" />
        <Card className="bg-muted/50 aspect-video rounded-xl" />
        <Card className="bg-muted/50 aspect-video rounded-xl" />
      </div>
      <Card className="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
    </div>
  );
};

export default HomePage;
