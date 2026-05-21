"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ModelPicker } from "@/components/predictions/model-picker";
import { UploadDropzone } from "@/components/predictions/upload-dropzone";
import { predictionsApi } from "@/lib/api";
import type { ModelType } from "@/types/api";
import type { AxiosError } from "axios";

const VALID_MODELS: ModelType[] = ["PNEUMONIA", "BREAST", "HEART", "LIVER"];

export default function NewPredictionPage() {
  return (
    <Suspense fallback={null}>
      <NewPredictionForm />
    </Suspense>
  );
}

function NewPredictionForm() {
  const router = useRouter();
  const params = useSearchParams();
  const preset = params.get("model");
  const initial = preset && VALID_MODELS.includes(preset as ModelType) ? (preset as ModelType) : null;
  const qc = useQueryClient();
  const [modelType, setModelType] = useState<ModelType | null>(initial);
  const [file, setFile] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: ({ f, m }: { f: File; m: ModelType }) => predictionsApi.create(f, m),
    onSuccess: (prediction) => {
      qc.invalidateQueries({ queryKey: ["predictions"] });
      qc.invalidateQueries({ queryKey: ["stats-me"] });
      if (prediction.status === "FAILED") {
        toast.error("Analysis failed — see details");
      } else {
        toast.success("Prediction complete");
      }
      router.push(`/predictions/${prediction.id}`);
    },
    onError: (err) => {
      const axErr = err as AxiosError<{ message?: string }>;
      toast.error(axErr.response?.data?.message ?? "Something went wrong");
    },
  });

  const canSubmit = !!file && !!modelType && !mutation.isPending;

  function handleSubmit() {
    if (!file || !modelType) return;
    mutation.mutate({ f: file, m: modelType });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New prediction</h1>
        <p className="mt-1 text-muted-foreground">Pick a diagnostic model, upload an image, and get a result.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              1
            </span>
            Select a diagnostic model
          </CardTitle>
          <CardDescription>Each model expects a specific type of input.</CardDescription>
        </CardHeader>
        <CardContent>
          <ModelPicker value={modelType} onChange={setModelType} disabled={mutation.isPending} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
              2
            </span>
            Upload your image
          </CardTitle>
          <CardDescription>
            {modelType === "PNEUMONIA"
              ? "Upload a clear chest X-ray."
              : modelType
                ? "Upload a scanned lab report image. OCR will extract the values."
                : "Select a model first to see the required input."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UploadDropzone value={file} onChange={setFile} disabled={!modelType || mutation.isPending} />
        </CardContent>
      </Card>

      <Alert>
        <Sparkles className="h-4 w-4" />
        <AlertDescription>
          Predictions are for educational and research purposes only. Always consult a licensed medical professional for clinical decisions.
        </AlertDescription>
      </Alert>

      <div className="flex justify-end">
        <Button size="lg" disabled={!canSubmit} onClick={handleSubmit} className="gap-2">
          {mutation.isPending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              Run prediction <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
