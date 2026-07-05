"use client";

import { ArrowRight, FunctionSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formulas = [
  { name: "Gradient", chain: ["Gradient Descent", "Neural Networks", "CNNs", "Transformers"] },
  { name: "Bayes Rule", chain: ["MAP", "Bayesian Inference", "Probabilistic Models"] },
  { name: "SVD", chain: ["PCA", "Embeddings", "Recommender Systems"] },
  { name: "Entropy", chain: ["Cross-Entropy", "KL Divergence", "Language Models"] }
];

export function FormulaExplorer() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Formula Explorer</CardTitle>
        <FunctionSquare className="h-4 w-4 text-white/35" />
      </CardHeader>
      <CardContent className="grid gap-3 lg:grid-cols-2">
        {formulas.map((formula) => (
          <div key={formula.name} className="rounded-lg border border-white/10 bg-white/[0.035] p-4">
            <div className="text-xl font-semibold">{formula.name}</div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/55">
              {formula.chain.map((item, index) => (
                <span key={item} className="inline-flex items-center gap-2">
                  <span className="rounded-lg border border-white/10 bg-black/25 px-3 py-2">{item}</span>
                  {index < formula.chain.length - 1 ? <ArrowRight className="h-4 w-4 text-white/25" /> : null}
                </span>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
