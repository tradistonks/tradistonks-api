import { HttpException, Injectable } from '@nestjs/common';
import axios, { Method } from 'axios';
import { StrategySymbolsCandlesGranularity } from 'src/schemas/strategy.schema';
import { FinnhubCandlesResponseDTO } from './dto/finnhub/candles.response.dto';
import { FinnhubSymbolsSearchResponseDTO } from './dto/finnhub/symbol-lookup.response.dto';

export interface SymbolCandlesResult {
  open: number[];
  high: number[];
  low: number[];
  close: number[];
  volume: number[];
  timestamp: number[];

  status: string;
}

@Injectable()
export class StocksService {
  private async finnhubRequest<T>(
    method: Method,
    url: string,
    body?: unknown,
  ): Promise<T> {
    try {
      const { data } = await axios({
        method,
        url: `https://finnhub.io/api/v1${url}`,
        data: body,
        headers: {
          'X-Finnhub-Token': process.env.FINNHUB_TOKEN,
        },
      });

      return data;
    } catch (error) {
      const message = error?.response?.data ?? 'An error occured';
      const status = error?.response?.status ?? 500;

      if (!error?.response?.status) {
        console.error(error?.response?.data);
      }

      throw new HttpException(message, status);
    }
  }

  async searchSymbols(search: string) {
    return this.finnhubRequest<FinnhubSymbolsSearchResponseDTO>(
      'GET',
      `/search?q=${encodeURIComponent(search)}`,
    );
  }

  async getCandles(
    symbol: string,
    type: string,
    from: Date,
    to: Date,
    granularity: StrategySymbolsCandlesGranularity,
  ): Promise<SymbolCandlesResult> {
    const seconds = (d: Date) => Math.floor(d.valueOf() / 1000);

    const fromSeconds = seconds(from);
    const toSeconds = seconds(to);

    const types = {
      Crypto: 'crypto',
      FX: 'forex',
      'Common Stock': 'stock',
    };

    const route = types[type] ?? 'stock';

    const data = await this.finnhubRequest<FinnhubCandlesResponseDTO>(
      'GET',
      `/${route}/candle?symbol=${symbol}&resolution=${granularity}&from=${fromSeconds}&to=${toSeconds}`,
    );

    return {
      open: data.o,
      high: data.h,
      low: data.l,
      close: data.c,
      volume: data.v,
      timestamp: data.t,

      status: data.s,
    };
  }
}
