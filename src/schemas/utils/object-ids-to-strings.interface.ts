import _ from 'lodash';
import { Types } from 'mongoose';

export type ObjectDocument<
  // eslint-disable-next-line @typescript-eslint/ban-types
  T extends Object,
  ObjectIdDestinationType = string
> = {
  [K in keyof T]: T[K] extends Types.ObjectId ? ObjectIdDestinationType : T[K];
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type PartialObjectDocument<T extends Object> = ObjectDocument<
  T,
  Types.ObjectId | string
>;

// eslint-disable-next-line @typescript-eslint/ban-types
export function objectIdsToStrings<T extends Object>(
  data: T,
): ObjectDocument<T> {
  const copy = _.cloneDeep(data) as PartialObjectDocument<T>;

  for (const k in copy) {
    if (copy[k] instanceof Types.ObjectId) {
      (copy[k] as string) = (copy[k] as Types.ObjectId).toHexString();
    }
  }

  return copy as ObjectDocument<T>;
}
