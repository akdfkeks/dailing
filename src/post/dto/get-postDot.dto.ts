import { Transform } from 'class-transformer';

export class PostDotDto {
  @Transform((v) => parseInt(v.value, 10))
  months: number;
}
