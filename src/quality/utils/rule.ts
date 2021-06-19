export interface Rule {
  type: string;
  errorMessage: string;
  test: (context: unknown) => string[];
}
