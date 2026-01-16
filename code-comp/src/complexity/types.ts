export type BigO =
  | 'O(1)'
  | 'O(log n)'
  | 'O(n)'
  | 'O(n log n)'
  | 'O(n^2)'
  | 'O(√n)'
  | 'O(?)';

export type Confidence = 'High' | 'Medium' | 'Low';

export interface FunctionComplexity {
  name: string;
  complexity: BigO;
  line: number;
  confidence: Confidence;
}
