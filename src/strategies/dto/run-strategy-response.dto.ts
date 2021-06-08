export class RunStrategyResponseDTOPhase {
  name: string;
  status: number;
  stdout: string;
  stderr: string;
}

export class RunStrategyResponseDTO {
  phases: RunStrategyResponseDTOPhase[];
}
