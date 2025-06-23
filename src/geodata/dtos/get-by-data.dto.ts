import { ApiProperty } from "@nestjs/swagger";
import { Addresses } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsArray,
  IsNotEmpty,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";

interface IMetro {
  line: string;
  name: string;
  distance: number;
}

type BeltwayHit = "OUT_MKAD" | "IN_MKAD" | "OUT_KAD" | "IN_KAD";

export class GetByDataDto {
  @ApiProperty({ example: "Москва, ул. Пушкинская, д. 1" })
  @IsString({ message: "Адрес должен быть строкой" })
  @IsNotEmpty({ message: "Адрес не может быть пустым" })
  @MaxLength(128, { message: "Адрес слишком длинный (макс. 128 символов)" })
  address: string;
}

export class GetByDataArrayDto {
  @ApiProperty({ example: [{ address: "Москва, ул. Пушкинская, д. 1" }] })
  @IsArray({
    message: "addresses должен быть массивом адресов",
  })
  @ValidateNested({ each: true })
  @Type(() => GetByDataDto)
  readonly addresses: GetByDataDto[];
}

export class GeoDataDto {
  @ApiProperty({
    example: "Москва, ул. Пушкинская, д. 1",
    description: "Адрес",
  })
  address: string;

  @ApiProperty({
    example: "55.753215",
    description: "Координаты по широте",
  })
  geoLat: string;

  @ApiProperty({
    example: "55.753215",
    description: "Координаты по долготе",
  })
  geoLon: string;

  @ApiProperty({
    example: "1",
    description: "Качество координат",
  })
  qcGeo: number;

  @ApiProperty({
    example: [
      {
        line: "Московско-Петроградская",
        name: "Невский проспект",
        distance: 0.1,
      },
      {
        line: "Невско-Василеостровская",
        name: "Гостиный двор",
        distance: 0.5,
      },
      {
        line: "Фрунзенско-Приморская",
        name: "Адмиралтейская",
        distance: 0.6,
      },
    ],
    description: "Метро",
  })
  metro: IMetro[];

  @ApiProperty({
    example: "IN_MKAD",
    description: "Попадание внутрь кольца (например, МКАД)",
  })
  beltwayHit: BeltwayHit;

  @ApiProperty({
    example: 0.1,
    description: "Расстояние до кольца",
  })
  beltwayDistance: number;
  constructor(address: Addresses) {
    this.address = address.address;
    this.geoLat = address.geoLat;
    this.geoLon = address.geoLon;
    this.qcGeo = address.qcGeo;
    const metroJson = address.metro as string | null;
    this.metro = metroJson as unknown as IMetro[];
    this.beltwayHit = address.beltwayHit;
    this.beltwayDistance = address.beltwayDistance;
  }
}
