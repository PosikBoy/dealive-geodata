import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GeoDataDto, GetByDataArrayDto } from "./dtos/get-by-data.dto";
import { GeodataService } from "./geodata.service";

@ApiTags("Геокодирование")
@Controller("geodata")
export class GeodataController {
  constructor(private geodataService: GeodataService) {}

  @ApiBody({
    description: "Массив адресов для геокодирования",
    type: GetByDataArrayDto,
    examples: {
      valid: {
        summary: "Валидный запрос",
        value: {
          addresses: [{ address: "Москва, ул. Пушкинская, д. 1" }],
        },
      },
      invalid: {
        summary: "Невалидный запрос",
        value: {
          addresses: [
            {
              address:
                "Должен быть массив адресов, состоящих из строк максимальной длины 128 символов, не долэжен быть пустым",
            },
          ],
        },
      },
    },
  })
  @ApiOperation({ summary: "Получение координат по массиву адресов" })
  @ApiResponse({ status: 200, type: [GeoDataDto] })
  @Post("")
  @UsePipes(ValidationPipe)
  async getCoordinatesByAddressArray(
    @Body() addressBody: GetByDataArrayDto
  ): Promise<GeoDataDto[]> {
    return Promise.all(
      addressBody.addresses.map((address) =>
        this.geodataService.getCoordinatesByAddress(address.address)
      )
    );
  }
}
