import { ApiProperty } from '@nestjs/swagger';

export class ClassLevelDto {
  @ApiProperty({ example: 7 })
  classLevel: number;

  @ApiProperty({ example: 'Class 7' })
  label: string;
}
