"use client";

import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useMathStore } from "@/store/use-math-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const capabilities = [
  { name: "Linear Regression Ready", requires: ["matrices", "statistics", "gradient-descent-batch-stochastic-mini-batch"] },
  { name: "Logistic Regression Ready", requires: ["probability-class-12", "maximum-likelihood-estimation-mle", "gradient-descent-batch-stochastic-mini-batch"] },
  { name: "PCA Ready", requires: ["eigenvalues-and-eigenvectors", "singular-value-decomposition-svd"] },
  { name: "CNN Not Ready", requires: ["fourier-transforms-convolution-computer-vision", "partial-derivatives"] },
  { name: "Attention Ready", requires: ["attention-mechanism-math-softmax-dot-product-attention-nlp-transformers", "linear-transformations"] },
  { name: "Diffusion Models Not Ready", requires: ["kl-divergence", "variational-inference-elbo-generative-models-vaes", "probability-distributions-gaussian-bernoulli-binomial-poisson-exponential-multinomial"] }
];

export function ResearchReadiness() {
  const { topics } = useMathStore();
  const scored = capabilities.map((capability) => {
    const score = capability.requires.reduce((sum, id) => sum + (topics.find((topic) => topic.id === id)?.confidence ?? 0), 0) / capability.requires.length;
    return { ...capability, score: Math.round(score * 10), ready: score >= 7 };
  });
  const readiness = Math.round(scored.reduce((sum, item) => sum + item.score, 0) / scored.length);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Research Readiness</CardTitle>
        <span className="text-2xl font-semibold">{readiness}%</span>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-2">
        {scored.map((item) => (
          <div key={item.name} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 font-semibold">
                {item.ready ? <CheckCircle2 className="h-4 w-4 text-emerald-300" /> : <AlertTriangle className="h-4 w-4 text-amber-300" />}
                {item.name}
              </div>
              <span className="text-white/45">{item.score}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-white/10">
              <div className="h-2 rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-cyan-400" style={{ width: `${item.score}%` }} />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
