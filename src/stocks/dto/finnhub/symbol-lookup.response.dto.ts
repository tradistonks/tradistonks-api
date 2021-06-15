export class FinnhubSymbolsSearchResponseDTOResult {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}

export class FinnhubSymbolsSearchResponseDTO {
  count: number;

  result: FinnhubSymbolsSearchResponseDTOResult[];
}
