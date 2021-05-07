import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types as MongooseTypes } from 'mongoose';
import { Strategy, StrategyDocument } from 'src/schemas/strategy.schema';
import { CreateStrategyBodyDTO } from './dto/create-strategy-body.dto';
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
}
