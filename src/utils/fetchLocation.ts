export const fetchCities = async (
  state: string
): Promise<
  {
    id: string;
    state_id: string;
    name: string;
    bn_name: string;
    lat: string;
    lon: string;
    url: string;
  }[]
> => {
  const response = await fetch(`/data/city.json?state=${state}`);
  const data = await response.json();

  const id = Number(state)
    ? state
    : data?.find((item: any) => item.name === state)?.id;
  const filteredData = data.filter((item: any) => item.state_id === id);
  return filteredData;
};

export const fetchAreas = async (
  city: string
): Promise<
  {
    id: string;
    city_id: string;
    name: string;
    bn_name: string;
    lat: string;
    lon: string;
    url: string;
  }[]
> => {
  const response = await fetch(`/data/area.json?city=${city}`);
  const data = await response.json();

  const id = Number(city)
    ? city
    : data?.find((item: any) => item.name === city)?.id;
  const filteredData = data.filter((item: any) => item.city_id === id);
  return filteredData;
};
