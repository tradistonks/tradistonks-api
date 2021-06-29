import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types as MongooseTypes } from 'mongoose';
import { Strategy, StrategyDocument } from 'src/schemas/strategy.schema';
import { CreateStrategyBodyDTO } from './dto/create-strategy-body.dto';
import {
  RunStrategyResponseDTOHistoryCandle,
  RunStrategyResponseDTOOrder,
} from './dto/run-strategy-response.dto';
import { UpdateStrategyBodyDTO } from './dto/update-strategy-body.dto';

@Injectable()
export class StrategiesService {
  constructor(
    @InjectModel(Strategy.name) private strategyModel: Model<StrategyDocument>,
  ) {}

  getStrategyById(id: string | MongooseTypes.ObjectId) {
    return this.strategyModel.findOne({ _id: id });
  }

  getByUserId(id: string | MongooseTypes.ObjectId) {
    return this.strategyModel.find({ user: id });
  }

  async createStrategy(
    userId: string | MongooseTypes.ObjectId,
    data: CreateStrategyBodyDTO,
  ) {
    return await this.strategyModel.create({
      user: userId,
      ...data,
    });
  }

  async updateStrategy(
    id: string | MongooseTypes.ObjectId,
    data: UpdateStrategyBodyDTO,
  ) {
    const strategy = await this.strategyModel.findById(id);

    if (!strategy) {
      return null;
    }

    strategy.updated_date = new Date();

    return await strategy.set(data).save();
  }

  calculatePnl(
    timestamps: number[],
    history: Record<
      number,
      Record<string, RunStrategyResponseDTOHistoryCandle>
    >,
    orders: RunStrategyResponseDTOOrder[],
  ) {
    interface Wallet {
      quantity: number;
      average: number;
    }

    const wallet: Record<string, Wallet> = {};
    const pnl: Record<number, Record<string, number>> = {};

    const leftOrders = [...orders];

    for (let i = 0; i < timestamps.length; i++) {
      const timestamp = timestamps[i];

      if (leftOrders.length > 0 && leftOrders[0].timestamp === timestamp) {
        const order = leftOrders.shift();

        if (!wallet[order.symbol]) {
          wallet[order.symbol] = {
            quantity: 0,
            average: 0,
          };
        }

        const entry = wallet[order.symbol];
        const price = history[order.timestamp][order.symbol].close;

        if (order.type === 'Buy') {
          entry.quantity += order.quantity;
          entry.average =
            (entry.average * entry.quantity + order.quantity * price) /
            (entry.quantity + order.quantity);
        } else if (order.type === 'Sell') {
          entry.quantity -= order.quantity;

          if (entry.quantity === 0) {
            entry.average = 0;
          }
        }
      }

      pnl[timestamp] = {};

      for (const symbol in history[timestamp]) {
        const candle = history[timestamp][symbol];
        const entry = wallet[symbol];

        if (i > 0) {
          pnl[timestamp][symbol] = pnl[timestamps[i - 1]][symbol] ?? 0;
        } else {
          pnl[timestamp][symbol] = 0;
        }

        if (entry && entry.quantity > 0) {
          pnl[timestamp][symbol] =
            (entry.average - candle.close) * entry.quantity;
        }
      }
    }

    return pnl;
  }
}
