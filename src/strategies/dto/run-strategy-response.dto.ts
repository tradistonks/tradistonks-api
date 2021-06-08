export class RunStrategyResponseDTOPhase {
  status: number;
  stdout: string;
  stderr: string;
}

export class RunStrategyResponseDTO {
  phases: RunStrategyResponseDTOPhase[];
}
