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

  const filteredData = data.filter((item: any) => item.state_id === state);
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

  const filteredData = data.filter((item: any) => item.city_id === city);
  return filteredData;
};
