import { Body, Controller, Get, Post } from "@nestjs/common";
import { GeodataService } from "./geodata.service";
import { GetByDataDto } from "./dtos/get-by-data.dto";

@Controller("geodata")
export class GeodataController {
  constructor(private geodataService: GeodataService) {}

  @Post("")
  async getCoordinatesByAddressArray(@Body() addressBody: GetByDataDto[]) {
    console.log(addressBody);
    return Promise.all(
      addressBody.map((address) =>
        this.geodataService.getCoordinatesByAddress(address.address)
      )
    );
  }
}
