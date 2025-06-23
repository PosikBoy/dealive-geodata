import { HttpService } from "@nestjs/axios";
import { Injectable, NotFoundException } from "@nestjs/common";
import { firstValueFrom } from "rxjs";
import messages from "src/constants/messages";
import urls from "src/constants/urls";
import { PrismaService } from "src/prisma.service";
import { RedisService } from "src/redis/redis.service";
import { GeoDataDto } from "./dtos/get-by-data.dto";

@Injectable()
export class GeodataService {
  constructor(
    private prisma: PrismaService,
    private readonly httpService: HttpService,
    private readonly redisService: RedisService
  ) {
    this.token = process.env.DADATA_KEY;
    this.secret = process.env.DADATA_SECRET;
  }

  token: string;
  secret: string;
  queryNumber = 1;

  async getCoordinatesByAddress(address: string) {
    const cachedData = await this.redisService.get<GeoDataDto>(
      `geodata:address:${address}`
    );

    if (cachedData) {
      return cachedData; // Возвращаем данные из кеша
    }

    try {
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
        await this.redisService.set<GeoDataDto>(
          `geodata:address:${address}`,
          new GeoDataDto(existingAddressByQuery.address),
          60
        ); //1h
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

        await this.redisService.set<GeoDataDto>(
          `geodata:address:${address}`,
          new GeoDataDto(existingAddressInBd),
          60
        );

        return new GeoDataDto(existingAddressInBd);
      }
      //Если не было ни в списке запросов, ни в списке адресов
      const newAddress = await this.prisma.addresses.create({
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

      await this.redisService.set<GeoDataDto>(
        `geodata:address:${address}`,
        new GeoDataDto(newAddress),
        60
      ); //1h
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
