import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma.service";
import messages from "src/constants/messages";
import { HttpService } from "@nestjs/axios";
import { firstValueFrom } from "rxjs";
import urls from "src/constants/urls";
import { GeoDataDto } from "./dtos/get-by-data.dto";

@Injectable()
export class GeodataService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService
  ) {
    this.token = process.env.DADATA_KEY;
    this.secret = process.env.DADATA_SECRET;
  }
  token: string;
  secret: string;
  queryNumber = 1;
  async getCoordinatesByAddress(address: string) {
    try {
      // Ищем адрес в базе данных
      const existingAddressByQuery = await this.prisma.addressQueries.findFirst(
        {
          where: {
            query: address,
          },
          include: {
            address: true,
          },
        }
      );

      if (existingAddressByQuery) {
        return new GeoDataDto(existingAddressByQuery.address);
      }

      const addressData = await this.getAddressFromDadata(address);

      if (!addressData) {
        throw new NotFoundException(messages.ADDRESS_NOT_FOUND);
      }

      const existingAddressInBd = await this.prisma.addresses.findFirst({
        where: {
          address: addressData.result,
        },
      });

      if (existingAddressInBd) {
        //Добавляем запрос в список запросов
        await this.prisma.addressQueries.create({
          data: {
            query: address,
            addressId: existingAddressInBd.id, // Ссылаемся на существующий адрес
          },
        });
        return new GeoDataDto(existingAddressInBd);
      }
      //Если не было ни в списке запросов, ни в списке адресов
      const newAddress = await this.prisma.addresses.create({
        // Сохраняем в базу
        data: {
          address: addressData.result,
          geoLat: addressData.geo_lat,
          geoLon: addressData.geo_lon,
          qcGeo: addressData.qc_geo,
          metro: addressData.metro,
          beltwayHit: addressData.beltway_hit,
          beltwayDistance: Number(addressData.beltway_distance),
          queries: {
            create: {
              query: address,
            },
          },
        },
      });

      return new GeoDataDto(newAddress);
    } catch (error) {
      console.log(
        "Ошибка внутри getCoordinatesByAddress",
        JSON.stringify(error.message)
      );
    }
  }

  async getAddressFromDadata(address: string) {
    try {
      const result = await firstValueFrom(
        this.httpService.post(urls.DADATA_GEOCODE_URL, [address], {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Token " + process.env.DADATA_KEY,
            "X-Secret": process.env.DADATA_SECRET,
          },
        })
      );
      this.queryNumber++;
      console.log("result", JSON.stringify(result.data));
      if (result.data[0].result == null) {
        throw new NotFoundException(messages.ADDRESS_NOT_FOUND + " " + address);
      }

      const coordinates = result.data[0];

      return coordinates;
    } catch (error) {
      console.log(
        "Ошибка внутри getAddressFromDadata",
        JSON.stringify(error.message)
      );
      throw new NotFoundException(error.message);
    }
  }
}
