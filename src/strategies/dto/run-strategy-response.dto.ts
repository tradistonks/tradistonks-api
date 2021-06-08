export class RunStrategyResponseDTOPhase {
  status: number;
  stdout: string;
  stdin: string;
}

export class RunStrategyResponseDTO {
  phases: RunStrategyResponseDTOPhase[];
}
