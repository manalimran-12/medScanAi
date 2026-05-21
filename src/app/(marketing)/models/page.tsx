import Link from "next/link";
import { ArrowRight, Wind, Heart, Brain, Droplets, FileImage, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MarketingHeader } from "@/components/layout/marketing-header";

const MODELS = [
  {
    type: "pneumonia",
    title: "Pneumonia Detection",
    tagline: "Chest X-ray analysis with a deep convolutional neural network",
    icon: Wind,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    input: "Chest X-ray image (JPG, PNG, WebP)",
    outputs: ["Normal", "Pneumonia"],
    technique: "Keras CNN trained on grayscale 36×36 inputs",
    details: [
      "Accepts frontal chest X-ray images in standard formats.",
      "Preprocessing: grayscale conversion, resizing, intensity normalization.",
      "Returns a binary verdict plus a probability score you can use as a confidence indicator.",
    ],
  },
  {
    type: "breast",
    title: "Breast Cancer Analysis",
    tagline: "Classifies tumors as benign or malignant from diagnostic reports",
    icon: Brain,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    input: "Scanned diagnostic lab report image",
    outputs: ["Benign", "Malignant"],
    technique: "OCR feature extraction + scikit-learn classifier",
    details: [
      "Extracts 26 cellular measurements (radius, texture, perimeter, concavity, symmetry, etc.) across mean, standard-error, and worst-case reads.",
      "Tesseract OCR parses the report; regex-guided feature extraction handles scanned-document noise.",
      "Model predicts class and probability — any missing features default to 0 in the feature vector.",
    ],
  },
  {
    type: "heart",
    title: "Heart Disease Prediction",
    tagline: "Cardiovascular risk from 13 clinical features in a medical report",
    icon: Heart,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    input: "Scanned medical / cardiology report",
    outputs: ["Heart Disease", "No Heart Disease"],
    technique: "OCR feature extraction + scikit-learn classifier",
    details: [
      "Looks for: age, sex, chest pain type, resting BP, cholesterol, fasting blood sugar, resting ECG, max heart rate, exercise-induced angina, ST depression, ST slope, number of major vessels, thalassemia.",
      "Handles natural-language synonyms (e.g. \"cholesterol\" → chol, \"max heart rate\" → thalach).",
      "Reports confidence as the probability of the predicted class.",
    ],
  },
  {
    type: "liver",
    title: "Liver Disease Screening",
    tagline: "Analyzes liver panel results to flag disease risk",
    icon: Droplets,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    input: "Scanned liver function panel",
    outputs: ["Liver Disease", "No Liver Disease"],
    technique: "OCR feature extraction + scikit-learn classifier",
    details: [
      "Extracts 10 clinical values including total & direct bilirubin, alkaline phosphatase, ALT, AST, total proteins, albumin, and albumin-to-globulin ratio.",
      "Includes fuzzy matching for common OCR misreads (e.g. \"bilrubin\", \"atbumin\") and auto-corrects over-read protein values.",
      "Outputs a binary classification with probability.",
    ],
  },
];

export default function ModelsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <section className="border-b">
          <div className="container py-20 text-center">
            <Badge variant="secondary" className="gap-1.5">
              <Sparkles className="h-3 w-3" />
              Four diagnostic models
            </Badge>
            <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
              Purpose-built AI models for specific clinical tasks
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-balance text-muted-foreground">
              Each model is trained for a single diagnostic task and optimized for a specific input type. Pick the right
              one, upload the right file, and get a confident result.
            </p>
          </div>
        </section>

        <section className="container space-y-12 py-16">
          {MODELS.map((m) => {
            const Icon = m.icon;
            return (
              <Card key={m.type} id={m.type} className="overflow-hidden">
                <div className="grid gap-0 md:grid-cols-[300px_1fr]">
                  <div className={`flex flex-col items-start justify-center p-8 ${m.bg}`}>
                    <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-background shadow-sm`}>
                      <Icon className={`h-7 w-7 ${m.color}`} />
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight">{m.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{m.tagline}</p>
                  </div>
                  <div className="p-8">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <FileImage className="h-3.5 w-3.5" />
                          Input
                        </h3>
                        <p className="mt-2 text-sm">{m.input}</p>
                      </div>
                      <div>
                        <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Possible outputs
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {m.outputs.map((o) => (
                            <Badge key={o} variant="outline">
                              {o}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Separator className="my-6" />
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Technique</h3>
                      <p className="mt-2 text-sm">{m.technique}</p>
                    </div>
                    <Separator className="my-6" />
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      {m.details.map((d) => (
                        <li key={d} className="flex gap-2">
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            );
          })}
        </section>

        <section className="border-t">
          <div className="container py-20 text-center">
            <h2 className="text-3xl font-bold tracking-tight">Try them all in one place</h2>
            <p className="mt-3 text-muted-foreground">Create an account and upload your first image in seconds.</p>
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
          © {new Date().getFullYear()} MedScan AI — Final Year Project
        </div>
      </footer>
    </div>
  );
}

export const metadata = {
  title: "Models — MedScan AI",
  description: "Four diagnostic models: pneumonia X-ray CNN plus OCR-based classifiers for breast cancer, heart disease, and liver disease.",
};
