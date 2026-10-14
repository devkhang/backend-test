import { GetAllDto } from 'src/commons';

export const queryMtp = (query: GetAllDto) => {
  const queries = JSON.parse(query.where) || {};

  const { pageSize, pageNumber } = query;

  const condition = Object.keys(queries)
    .filter((x) => x !== 'yearId')
    .filter((x) => x !== 'provinceId')
    .map((x) => {
      if (queries[x] instanceof Object) {
        return `and ${x === 'fullName' ? 'ib' : 'p'}."${
          (x === 'fullNameNcc' && x.slice(0, 8)) || x
        }" ilike '${queries[x].value}'`;
      } else {
        return `and ${x === 'relation' ? 'ib' : 'p'}."${x}"${
          (x === 'dateOfBirth' && '::date') || ''
        } = '${queries[x]}'`;
      }
    });

  const page =
    (!!pageSize &&
      !!pageNumber &&
      `limit ${+query.pageSize} offset ${+pageNumber * +pageSize}`) ||
    '';

  condition.unshift(
    `and p."placeOfPermanent" -> 'province' -> 'key' = '${queries.provinceId}'`,
    `and p."mtp" -> 'yearId' = '${queries.yearId}'`,
  );

  return `
    select 
        p.code
        , p."fullName" as "fullNameNcc"
        , p."dateOfBirth"
        , c.name
        , ib."fullName"
        , ib.relation  
    from profiles p
    left join "infoBeneficiaries" ib on p.id = ib."profileId" and ib.status = true
    left join categories c on c.id = p."categoryId" 
    where p."deletedAt" is null
    ${condition.join(' ')}
    ${page}
    `;
};
