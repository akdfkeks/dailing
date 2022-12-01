import { IsString, Matches, MaxLength, Min, MinLength } from 'class-validator';

export class SignupDto {
  @IsString()
  @MinLength(2)
  @MaxLength(20)
  readonly id: string;

  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{4,30}$/)
  readonly pw: string;

  @IsString()
  readonly name: string;
}
