import Link from "next/link";
import {
  ArrowRight,
  Upload,
  Sparkles,
  FileSearch,
  ShieldAlert,
  Stethoscope,
  GraduationCap,
  Microscope,
  HeartHandshake,
  Wind,
  Heart,
  Brain,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Lock,
  History,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MarketingHeader } from "@/components/layout/marketing-header";

const STEPS = [
  {
    icon: Stethoscope,
    title: "Pick a model",
    body: "Choose from four diagnostic models depending on what you want to check — a chest X-ray, or a lab report for breast, heart, or liver.",
  },
  {
    icon: Upload,
    title: "Upload your image",
    body: "Drag and drop your X-ray or a clear photo / scan of your medical report. We accept JPG, PNG, and WebP up to 10 MB.",
  },
  {
    icon: FileSearch,
    title: "AI analyzes it",
    body: "Our model reads the image. For lab reports, optical character recognition pulls the numbers out. For X-rays, a neural network studies the pixels directly.",
  },
  {
    icon: Sparkles,
    title: "Get your result",
    body: "A clear verdict with a confidence score in seconds. Every prediction is saved to your personal history so you can revisit or compare later.",
  },
];

const MODELS = [
  {
    icon: Wind,
    title: "Pneumonia",
    body: "Upload a chest X-ray. Our CNN looks for patterns associated with pneumonia and tells you whether the lungs look clear or concerning.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Brain,
    title: "Breast Cancer",
    body: "Upload a diagnostic lab report. We extract 26 cellular measurements and classify the tumor as benign or malignant.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Heart,
    title: "Heart Disease",
    body: "Upload a cardiology report. We read 13 clinical features — cholesterol, blood pressure, ECG, exercise response — to flag cardiovascular risk.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: Droplets,
    title: "Liver Disease",
    body: "Upload a liver panel. We analyze bilirubin, enzymes, proteins, and ratios to screen for signs of liver disease.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

const WHY = [
  {
    icon: Zap,
    title: "Instant second opinion",
    body: "Curious about a result on a report you got? Get an AI perspective in seconds — before your next appointment.",
  },
  {
    icon: History,
    title: "Keep everything in one place",
    body: "Every prediction is saved to your history. Filter by date or model to spot trends across your own tests.",
  },
  {
    icon: Lock,
    title: "Private by design",
    body: "Your uploads and history are tied to your account. We use industry-standard authentication and never share your data.",
  },
  {
    icon: HeartHandshake,
    title: "Built for understanding",
    body: "Confidence scores are shown for every prediction so you know how sure the model is — never just a raw yes/no.",
  },
];

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <section className="border-b">
          <div className="container py-20 text-center">
            <Badge variant="secondary" className="gap-1.5">
              <Sparkles className="h-3 w-3" />
              About MedScan AI
            </Badge>
            <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              AI insights for your medical reports, in seconds
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-balance text-lg text-muted-foreground">
              MedScan AI helps you make sense of X-rays and lab reports. Upload an image, pick the right model, and
              get a clear prediction you can discuss with your doctor.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href="/signup">
                  Try it free <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/models">Explore the models</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* What we do */}
        <section className="border-b">
          <div className="container py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">What we do</h2>
              <p className="mt-3 text-muted-foreground">
                We turn medical images and lab reports into clear, interpretable AI predictions. Instead of staring at
                numbers you don&apos;t understand, drop them in and let our models highlight what stands out.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-b">
          <div className="container py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">How does it scan your reports?</h2>
              <p className="mt-3 text-muted-foreground">
                Four simple steps. No medical knowledge needed.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <Card key={s.title} className="relative">
                    <div className="absolute -top-3 left-6 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                      {i + 1}
                    </div>
                    <CardHeader>
                      <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{s.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{s.body}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Models overview */}
        <section className="border-b">
          <div className="container py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">Four models, one platform</h2>
              <p className="mt-3 text-muted-foreground">
                Each model is trained for a specific task — so you get focused, relevant results, not generic guesses.
              </p>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {MODELS.map((m) => {
                const Icon = m.icon;
                return (
                  <Card key={m.title} className="transition-all hover:shadow-md">
                    <CardHeader>
                      <div className={`mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${m.bg}`}>
                        <Icon className={`h-5 w-5 ${m.color}`} />
                      </div>
                      <CardTitle>{m.title}</CardTitle>
                      <CardDescription>{m.body}</CardDescription>
                    </CardHeader>
                  </Card>
                );
              })}
            </div>
            <div className="mt-10 text-center">
              <Button asChild variant="outline" className="gap-2">
                <Link href="/models">
                  See full model details <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why use it */}
        <section className="border-b">
          <div className="container py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">Why people use MedScan AI</h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {WHY.map((w) => {
                const Icon = w.icon;
                return (
                  <Card key={w.title}>
                    <CardHeader>
                      <Icon className="h-8 w-8 text-primary" />
                      <CardTitle className="text-lg">{w.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{w.body}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Accuracy & disclaimer */}
        <section className="border-b bg-muted/30">
          <div className="container py-16">
            <div className="mx-auto max-w-3xl space-y-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold tracking-tight">About accuracy</h2>
                <p className="mt-3 text-muted-foreground">
                  Being honest about what AI can — and can&apos;t — do.
                </p>
              </div>

              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Predictions are not a diagnosis</AlertTitle>
                <AlertDescription>
                  MedScan AI is designed as a supportive tool. Our models are good — but not 100% accurate. Never
                  replace a consultation with a qualified medical professional based on an AI result.
                </AlertDescription>
              </Alert>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CheckCircle2 className="h-6 w-6 text-success" />
                    <CardTitle className="text-base">What we&apos;re good at</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• Fast pattern-matching on clean, standard inputs.</p>
                    <p>• Offering a useful second opinion on your reports.</p>
                    <p>• Helping you spot what to bring up at your next appointment.</p>
                    <p>• Showing confidence so you can judge the reliability of a result.</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <ShieldAlert className="h-6 w-6 text-warning" />
                    <CardTitle className="text-base">What we can&apos;t do</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm text-muted-foreground">
                    <p>• Diagnose you. That&apos;s a doctor&apos;s job.</p>
                    <p>• Account for your full medical history and context.</p>
                    <p>• Guarantee correctness on blurry images or unusual report formats.</p>
                    <p>• Replace a lab, a radiologist, or a hospital.</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardContent className="p-6 text-sm text-muted-foreground">
                  <p>
                    Use our results the way you&apos;d use any second opinion — as additional information to discuss
                    with a healthcare professional. If a prediction surprises you, worries you, or just makes you
                    curious, take it to your doctor. That&apos;s what they&apos;re there for.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Who it's for */}
        <section className="border-b">
          <div className="container py-16">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight">Who is it for?</h2>
            </div>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {[
                {
                  icon: HeartHandshake,
                  title: "Curious patients",
                  body: "Got a recent X-ray or lab report? Get an AI perspective before your follow-up visit.",
                },
                {
                  icon: GraduationCap,
                  title: "Medical students",
                  body: "Explore how modern AI models interpret diagnostic inputs. Useful for learning and comparison.",
                },
                {
                  icon: Microscope,
                  title: "Researchers & educators",
                  body: "Demonstrate real-world applications of machine learning in medical imaging and clinical data.",
                },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <Card key={a.title}>
                    <CardHeader>
                      <Icon className="h-8 w-8 text-primary" />
                      <CardTitle className="text-lg">{a.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">{a.body}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section>
          <div className="container py-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Ready to scan your first report?</h2>
            <p className="mt-3 text-muted-foreground">Create an account and get your first prediction in under a minute.</p>
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
          © {new Date().getFullYear()} MedScan AI — for educational and research use
        </div>
      </footer>
    </div>
  );
}

export const metadata = {
  title: "About — MedScan AI",
  description:
    "MedScan AI helps you make sense of X-rays and lab reports with AI predictions. Learn what we do, how it works, and what the models can (and can't) tell you.",
};
