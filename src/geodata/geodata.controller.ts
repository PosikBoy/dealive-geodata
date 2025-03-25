import { Body, Controller, Post } from "@nestjs/common";
import { GetByDataDto } from "./dtos/get-by-data.dto";
import { GeodataService } from "./geodata.service";

@Controller("geodata")
export class GeodataController {
  constructor(private geodataService: GeodataService) {}

  @Post("")
  async getCoordinatesByAddressArray(@Body() addressBody: GetByDataDto[]) {
    return Promise.all(
      addressBody.map((address) =>
        this.geodataService.getCoordinatesByAddress(address.address)
      )
    );
  }
}
