import { Addresses } from "@prisma/client";

interface IMetro {
  line: string;
  name: string;
  distance: number;
}

type BeltwayHit = "OUT_MKAD" | "IN_MKAD" | "OUT_KAD" | "IN_KAD";

export class GetByDataDto {
  address: string;
}

export class GeoDataDto {
  address: string;
  geoLat: string;
  geoLon: string;
  qcGeo: number;
  metro: IMetro[];
  beltwayHit: BeltwayHit;
  beltwayDistance: number;
  constructor(address: Addresses) {
    this.address = address.address;
    this.geoLat = address.geoLat;
    this.geoLon = address.geoLon;
    this.qcGeo = address.qcGeo;
    const metroJson = address.metro as string | null;
    console.log(metroJson);
    this.metro = metroJson as unknown as IMetro[];
    this.beltwayHit = address.beltwayHit;
    this.beltwayDistance = address.beltwayDistance;
  }
}
