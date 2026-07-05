import type { CalendarEvent, Phase, StudySession, Topic } from "@/lib/types";

const curriculum = [
  {
    id: "phase-1-school-level-foundation",
    name: "Phase 1: School-Level Foundation (CBSE 11 & 12)",
    description: "CBSE Class 11 and 12 mathematics foundation for AI/ML readiness.",
    topics: [
      "Sets",
      "Sequences and Series",
      "Permutations and Combinations",
      "Limits and Derivatives",
      "Statistics",
      "Probability (Class 11)",
      "Complex Numbers",
      "Matrices",
      "Determinants",
      "Continuity and Differentiability",
      "Application of Derivatives",
      "Integrals",
      "Vector Algebra",
      "Probability (Class 12)",
      "Linear Programming"
    ]
  },
  {
    id: "phase-2-linear-algebra-college-level",
    name: "Phase 2: Linear Algebra (College Level)",
    description: "College-level linear algebra for machine learning models and geometry.",
    topics: [
      "Vector Spaces, Basis, Span",
      "Rank of a Matrix",
      "Orthogonality and Projections",
      "Norms (L1, L2, Frobenius)",
      "Eigenvalues and Eigenvectors",
      "Matrix Decomposition (Eigendecomposition, LU, QR)",
      "Singular Value Decomposition (SVD)",
      "Positive Definite/Semi-Definite Matrices",
      "Linear Transformations"
    ]
  },
  {
    id: "phase-3-multivariable-calculus",
    name: "Phase 3: Multivariable Calculus",
    description: "Calculus for high-dimensional functions, gradients, and model training.",
    topics: [
      "Partial Derivatives",
      "Gradients",
      "Jacobian Matrix",
      "Hessian Matrix",
      "Chain Rule (Multivariable)",
      "Taylor Series (Multivariable)"
    ]
  },
  {
    id: "phase-4-probability-statistics-advanced",
    name: "Phase 4: Probability & Statistics (Advanced)",
    description: "Advanced probability, statistics, inference, and stochastic processes.",
    topics: [
      "Random Variables (Discrete & Continuous)",
      "Probability Distributions (Gaussian, Bernoulli, Binomial, Poisson, Exponential, Multinomial)",
      "Joint, Marginal, Conditional Distributions",
      "Expectation, Variance, Covariance, Correlation",
      "Central Limit Theorem",
      "Maximum Likelihood Estimation (MLE)",
      "Maximum A Posteriori (MAP)",
      "Bayesian Inference",
      "Hypothesis Testing, Confidence Intervals",
      "Markov Chains"
    ]
  },
  {
    id: "phase-5-optimization",
    name: "Phase 5: Optimization",
    description: "Optimization methods and constraints used in modern ML training.",
    topics: [
      "Convex Functions and Convex Optimization",
      "Gradient Descent (Batch, Stochastic, Mini-batch)",
      "Optimizer Algorithms (Momentum, Adam, RMSProp, AdaGrad)",
      "Lagrange Multipliers",
      "KKT Conditions",
      "Newton's Method"
    ]
  },
  {
    id: "phase-6-information-theory",
    name: "Phase 6: Information Theory",
    description: "Information-theoretic quantities used in learning objectives and representation analysis.",
    topics: ["Entropy", "Cross-Entropy", "KL Divergence", "Mutual Information"]
  },
  {
    id: "phase-7-discrete-math",
    name: "Phase 7: Discrete Math",
    description: "Discrete structures and computational reasoning for algorithms and ML systems.",
    topics: ["Set Theory (Formal/Advanced)", "Graph Theory", "Computational Complexity (Big-O Notation)"]
  },
  {
    id: "phase-8-specialized-ml-path",
    name: "Phase 8: Specialized (Pick Based on Your ML Path)",
    description: "Specialized mathematical tracks selected according to the target ML research path.",
    topics: [
      "Automatic Differentiation / Tensor Calculus - Deep Learning",
      "Variational Inference, ELBO - Generative Models (VAEs)",
      "Markov Decision Processes, Bellman Equations - Reinforcement Learning",
      "Fourier Transforms, Convolution - Computer Vision",
      "Spectral Graph Theory - Graph Neural Networks",
      "Attention Mechanism Math (Softmax, Dot-Product Attention) - NLP/Transformers"
    ]
  }
];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export const phases: Phase[] = curriculum.map((phase, index) => ({
  id: phase.id,
  name: phase.name,
  description: phase.description,
  order: index + 1,
  targetHours: 0
}));

export const topics: Topic[] = curriculum.flatMap((phase) =>
  phase.topics.map((title, index, phaseTopics) => {
    const id = slugify(title);
    const prerequisiteTitle = phaseTopics[index - 1];
    const dependentTitle = phaseTopics[index + 1];

    return {
      id,
      title,
      phaseId: phase.id,
      status: "Not Started",
      difficulty: 3,
      confidence: 1,
      estimatedHours: 0,
      actualHours: 0,
      resources: [],
      markdownNotes: "",
      tags: [phase.name],
      reviewInterval: 1,
      easeFactor: 2.5,
      repetitions: 0,
      reviewHistory: [],
      attachments: [],
      aiSummary: "",
      prerequisites: prerequisiteTitle ? [slugify(prerequisiteTitle)] : [],
      dependents: dependentTitle ? [slugify(dependentTitle)] : [],
      frozen: false,
      archived: false
    } satisfies Topic;
  })
);

export const sessions: StudySession[] = [];

export const calendarEvents: CalendarEvent[] = [];
