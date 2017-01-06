import {StatisticType} from './statistictype.enum';

export interface Statistic {
  type: StatisticType;
  value: number;
}
