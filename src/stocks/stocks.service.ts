import { HttpException, Injectable } from '@nestjs/common';
import axios, { Method } from 'axios';

@Injectable()
export class StocksService {
  private async finnhubRequest(method: Method, url: string, body?: unknown) {
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

  async searchStocks(search: string) {
    return this.finnhubRequest(
      'GET',
      `/search?q=${encodeURIComponent(search)}`,
    );
  }
}
