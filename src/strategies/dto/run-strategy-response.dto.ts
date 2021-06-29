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

export class RunStrategyResponseDTOHistoryCandle {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: number;
}

export class RunStrategyResponseDTOConfig {
  timestamp_start: number;
  timestamp_end: number;
  granularity: number;
}

export class RunStrategyResponseDTO {
  phases: RunStrategyResponseDTOPhase[];
  orders?: RunStrategyResponseDTOOrder[];
  history?: Record<number, Record<string, RunStrategyResponseDTOHistoryCandle>>;
  config?: RunStrategyResponseDTOConfig;

  pnl?: Record<number, Record<string, number>>;
}
