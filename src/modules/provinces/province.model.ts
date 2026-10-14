export class WardModel {
  id: string;
  name: string;
  type: string;
  constructor(wardModel: Partial<WardModel>) {
    Object.assign(this, wardModel);
  }
}

export class DistrictModel {
  id: string;
  name: string;
  type: string;
  districts: WardModel[];
  constructor(districtModel: Partial<DistrictModel>) {
    Object.assign(this, districtModel);
  }
}

export class ProvinceModel {
  id: string;
  name: string;
  type: string;
  cities: DistrictModel[];
  constructor(provinceModel: Partial<ProvinceModel>) {
    Object.assign(this, provinceModel);
  }
}
