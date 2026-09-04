import mongoose, { Schema, Document } from 'mongoose';

export interface IWeatherLog extends Document {
  cityName: string;
  temp: number;
  condition: string;
  icon: string;
  searchedAt: Date;
}

const WeatherLogSchema: Schema = new Schema({
  cityName: { type: String, required: true },
  temp: { type: Number, required: true },
  condition: { type: String, required: true },
  icon: { type: String, required: true },
  searchedAt: { type: Date, default: Date.now },
});

export default mongoose.models.WeatherLog || mongoose.model<IWeatherLog>('WeatherLog', WeatherLogSchema);
