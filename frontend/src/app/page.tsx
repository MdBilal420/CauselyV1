"use client";

import Link from "next/link";
import { Header } from "./components/Header";
import { useEffect } from "react";

const baseUrl = "https://my-fastapi-service-1061397264130.us-central1.run.app/copilotkit"
//const baseUrl = "http://localhost:8080/";

export default function Home() {
  useEffect(() => {
    fetch(`${baseUrl}health`)
      .then((response) => response.json())
      .then((data) => console.log("Health check:", data))
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-12 md:py-24 lg:py-32 relative overflow-hidden">
        {/* Background gradient animation */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 animate-pulse"></div>

        <div className="container px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="space-y-4 animate-fade-in-up">
              <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm bg-primary/10 text-primary animate-bounce-slow">
                ✨ Professional Philanthropy Advisory
              </div>
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl animate-fade-in-up animation-delay-200">
                Smart Giving
                <span className="text-primary bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent animate-gradient">
                  {" "}
                  Made Simple
                </span>
              </h1>
              <p className="max-w-[800px] text-xl text-gray-600 md:text-2xl/relaxed lg:text-xl/relaxed xl:text-2xl/relaxed dark:text-gray-400 animate-fade-in-up animation-delay-400">
                Our AI systematically discovers charities that match your
                values, location, and impact goals&mdash;just like the
                professionals do for the wealthy.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-600">
              <Link
                href="/copilotkit"
                className="group inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-lg font-medium text-primary-foreground shadow-lg transition-all duration-300 hover:bg-primary/90 hover:scale-105 hover:shadow-xl"
              >
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  Start Your Philanthropy Journey
                </span>
              </Link>
              <Link
                href="#how-it-works"
                className="group inline-flex h-12 items-center justify-center rounded-md border border-input bg-background px-8 text-lg font-medium shadow-sm transition-all duration-300 hover:bg-accent hover:text-accent-foreground hover:scale-105 hover:shadow-lg"
              >
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  See How It Works
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-muted py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              The Rich Person&apos;s Approach to Giving
            </h2>
            <p className="max-w-[85%] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Professional philanthropy advisors use a systematic approach.
              We&apos;ve built that same methodology into an AI that works for
              everyone.
            </p>
          </div>

          <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:max-w-[80rem]">
            <div className="group flex flex-col items-center space-y-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg p-6 rounded-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                1
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                  Discover Your Values
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  We explore what matters most to you—location, causes, and the
                  type of impact you want to create.
                </p>
              </div>
            </div>

            <div className="group flex flex-col items-center space-y-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg p-6 rounded-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                2
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                  Systematic Search
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Our AI searches thousands of organizations, evaluating
                  alignment with your specific criteria and goals.
                </p>
              </div>
            </div>

            <div className="group flex flex-col items-center space-y-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg p-6 rounded-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                3
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                  Curated Recommendations
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get a personalized list of organizations with detailed
                  analysis of why they match your philanthropic profile.
                </p>
              </div>
            </div>

            <div className="group flex flex-col items-center space-y-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-lg p-6 rounded-lg">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                4
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold transition-colors duration-300 group-hover:text-primary">
                  Strategic Giving
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Receive specific grant recommendations and strategies to
                  maximize your philanthropic impact.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Matters Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-12">
            <div className="flex flex-col justify-center space-y-6">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                  Why Most People Give Ineffectively
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Without professional guidance, most people rely on random
                  charity directories or emotional appeals. The wealthy hire
                  advisors who use systematic approaches to maximize impact.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 text-sm font-bold mt-0.5">
                    ✗
                  </div>
                  <div>
                    <h4 className="font-semibold">Random Charity Browsing</h4>
                    <p className="text-sm text-gray-600">
                      No systematic evaluation of impact or alignment
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 text-sm font-bold mt-0.5">
                    ✗
                  </div>
                  <div>
                    <h4 className="font-semibold">Emotional Decision Making</h4>
                    <p className="text-sm text-gray-600">
                      Giving based on appeals rather than evidence
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 text-sm font-bold mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-semibold">Professional Approach</h4>
                    <p className="text-sm text-gray-600">
                      Systematic discovery and evidence-based recommendations
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl transform rotate-3"></div>
                <div className="relative bg-white p-8 rounded-2xl shadow-lg border">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-primary rounded-full"></div>
                      <span className="text-sm font-medium">
                        Professional Philanthropy Advisor
                      </span>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        &quot;Based on your interest in local education and
                        evidence-based interventions, I recommend exploring
                        these organizations...&quot;
                      </p>
                      <p className="text-xs text-gray-500">
                        Systematic analysis &bull; Impact evaluation &bull;
                        Strategic recommendations
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              What You Get
            </h2>
            <p className="max-w-[85%] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              The same capabilities that wealthy philanthropists pay $200K/year
              for, now available to everyone.
            </p>
          </div>

          <div className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:max-w-[64rem]">
            <div className="group flex flex-col items-center space-y-4 border rounded-lg p-8 shadow-sm bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/20">
              <div className="p-3 bg-primary/10 rounded-full transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary transition-colors duration-300 group-hover:text-white"
                >
                  <path d="M12 2a3 3 0 0 0-3 3c0 1.4 1.1 2.5 2.5 2.5H11v-1a1 1 0 0 1 1-1h0a1 1 0 0 1 1 1v1h1.5C15.9 7.5 17 6.4 17 5a3 3 0 0 0-3-3Z"></path>
                  <path d="M5 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"></path>
                  <path d="M19 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"></path>
                  <path d="M12 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center transition-colors duration-300 group-hover:text-primary">
                Personalized Discovery
              </h3>
              <p className="text-sm text-gray-600 text-center dark:text-gray-400">
                AI-driven conversation that explores your values, location
                preferences, and impact goals to create your unique
                philanthropic profile.
              </p>
            </div>

            <div className="group flex flex-col items-center space-y-4 border rounded-lg p-8 shadow-sm bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/20">
              <div className="p-3 bg-primary/10 rounded-full transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary transition-colors duration-300 group-hover:text-white"
                >
                  <path d="M9 12l2 2 4-4"></path>
                  <path d="M21 12c-1 0-2-1-2-2s1-2 2-2 2 1 2 2-1 2-2 2z"></path>
                  <path d="M3 12c1 0 2-1 2-2s-1-2-2-2-2 1-2 2 1 2 2 2z"></path>
                  <path d="M12 3c0 1-1 2-2 2s-2-1-2-2 1-2 2-2 2 1 2 2z"></path>
                  <path d="M12 21c0-1 1-2 2-2s2 1 2 2-1 2-2 2-2-1-2-2z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center transition-colors duration-300 group-hover:text-primary">
                Evidence-Based Matching
              </h3>
              <p className="text-sm text-gray-600 text-center dark:text-gray-400">
                Systematic evaluation of thousands of organizations using impact
                data, transparency scores, and alignment with your specific
                criteria.
              </p>
            </div>

            <div className="group flex flex-col items-center space-y-4 border rounded-lg p-8 shadow-sm bg-white transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-primary/20">
              <div className="p-3 bg-primary/10 rounded-full transition-all duration-300 group-hover:bg-primary group-hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary transition-colors duration-300 group-hover:text-white"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-center transition-colors duration-300 group-hover:text-primary">
                Strategic Grant Recommendations
              </h3>
              <p className="text-sm text-gray-600 text-center dark:text-gray-400">
                Receive specific grant opportunities and strategies to maximize
                your philanthropic impact, just like wealthy donors do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-8 text-center">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to Give Like a Professional?
              </h2>
              <p className="max-w-[85%] text-gray-600 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Start your conversation with your personal philanthropy advisor.
                It&apos;s free, takes just a few minutes, and could transform
                how you think about giving.
              </p>
            </div>
            <Link
              href="/copilotkit"
              className="inline-flex h-14 items-center justify-center rounded-md bg-primary px-10 text-lg font-medium text-primary-foreground shadow-lg transition-colors hover:bg-primary/90"
            >
              Begin Your Philanthropy Journey
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <h1 className="text-xl font-bold text-primary">Causely</h1>
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              &copy; 2025 Causely. Democratizing professional philanthropy
              advice.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Terms
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Privacy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:underline"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
