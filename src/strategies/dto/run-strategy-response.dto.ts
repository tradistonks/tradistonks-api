export class RunStrategyResponseDTOPhase {
  name: string;
  status: number;
  stdout: string;
  stderr: string;
  time: number;
  time_wall: number;
  used_memory: number;
  sandbox_status?: string;
  csw_voluntary: number;
  csw_forced: number;
}

export class RunStrategyResponseDTOOrder {
  type: 'Buy' | 'Sell';
  symbol: string;
  quantity: number;
  timestamp: number;
}

export class RunStrategyResponseDTO {
  phases: RunStrategyResponseDTOPhase[];
  orders?: RunStrategyResponseDTOOrder[];
}
