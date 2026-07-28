import { FeatureGrid } from "@/features/landing/FeatureGrid";
import { FooterCta } from "@/features/landing/FooterCta";
import { Hero } from "@/features/landing/Hero";
import { HowItWorks } from "@/features/landing/HowItWorks";
import { Personas } from "@/features/landing/Personas";
import { ProblemSolution } from "@/features/landing/ProblemSolution";
import { SocialProofMarquee } from "@/features/landing/SocialProofMarquee";
import { Testimonials } from "@/features/landing/Testimonials";

export function LandingPage() {
  return (
    <>
      <Hero />
      <SocialProofMarquee />
      <ProblemSolution />
      <FeatureGrid />
      <HowItWorks />
      <Personas />
      <Testimonials />
      <FooterCta />
    </>
  );
}
