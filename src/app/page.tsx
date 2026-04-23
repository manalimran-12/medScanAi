import Link from "next/link";
import { Activity, ArrowRight, Heart, Brain, Droplets, Wind, ShieldCheck, Zap, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarketingHeader } from "@/components/layout/marketing-header";

const MODELS = [
  {
    icon: Wind,
    title: "Pneumonia Detection",
    description: "Upload a chest X-ray and get an instant AI-powered diagnosis using our convolutional neural network.",
    input: "Chest X-ray image",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Heart,
    title: "Heart Disease Prediction",
    description: "Upload a medical report image — OCR extracts 13 clinical features and predicts cardiovascular risk.",
    input: "Scanned medical report",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Brain,
    title: "Breast Cancer Analysis",
    description: "Upload a diagnostic lab report. Our model analyzes 26 cellular features to classify tissue as benign or malignant.",
    input: "Lab report image",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Droplets,
    title: "Liver Disease Screening",
    description: "Upload a liver panel report. Our model evaluates bilirubin, enzymes, and protein levels to predict liver disease.",
    input: "Liver panel image",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
          <div className="container relative flex flex-col items-center gap-8 py-24 text-center md:py-32">
            <Badge variant="secondary" className="gap-1.5">
              <Zap className="h-3 w-3" />
              Final Year Project — AI Medical Diagnostics
            </Badge>
            <h1 className="max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
              AI-powered diagnosis for <span className="text-primary">medical professionals</span>
            </h1>
            <p className="max-w-2xl text-balance text-lg text-muted-foreground sm:text-xl">
              Upload X-rays and lab reports to get instant predictions across four diagnostic models. Built on FastAPI microservices and NestJS.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/signup">
                  Start diagnosing free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/models">Explore models</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Demo — admin: <code className="rounded bg-muted px-1.5 py-0.5 font-mono">admin@fyp.local / admin123</code>
              &nbsp;·&nbsp; user: <code className="rounded bg-muted px-1.5 py-0.5 font-mono">demo@fyp.local / demo123</code>
            </p>
          </div>
        </section>

        <section className="border-b">
          <div className="container grid gap-6 py-16 md:grid-cols-3">
            {[
              { icon: Activity, title: "4 diagnostic models", body: "Pneumonia X-ray CNN plus OCR-based classifiers for breast cancer, heart disease, and liver disease." },
              { icon: ShieldCheck, title: "Secure & private", body: "Per-user accounts, httpOnly refresh cookies, and audit trails for every prediction." },
              { icon: BarChart3, title: "Full history tracking", body: "Every prediction saved. Filter by model, date, and outcome. Dashboard insights over 30 days." },
            ].map((f) => (
              <Card key={f.title}>
                <CardHeader>
                  <f.icon className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl">{f.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{f.body}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section id="models" className="border-b">
          <div className="container py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Four clinical models, one platform</h2>
              <p className="mt-3 text-muted-foreground">
                Each model is purpose-built for a specific diagnostic task. Upload the right input and get a confident prediction in seconds.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {MODELS.map((m) => (
                <Card key={m.title} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${m.bg}`}>
                      <m.icon className={`h-5 w-5 ${m.color}`} />
                    </div>
                    <CardTitle>{m.title}</CardTitle>
                    <CardDescription>{m.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-muted-foreground">Input:</span>
                      <Badge variant="outline">{m.input}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="container py-24 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to start diagnosing?</h2>
            <p className="mt-3 text-muted-foreground">Free for evaluation — create an account in seconds.</p>
            <Button asChild size="lg" className="mt-8 gap-2">
              <Link href="/signup">
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MedScan AI — Final Year Project · Built with Next.js, NestJS, FastAPI</p>
        </div>
      </footer>
    </div>
  );
}
