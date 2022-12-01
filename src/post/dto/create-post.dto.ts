import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreatePostDto {
  userId: string;
  title: string;
  content: string;

  @Transform((v) => parseFloat(v.value))
  readonly lat: number;

  @Transform((v) => parseFloat(v.value))
  readonly lng: number;
}
