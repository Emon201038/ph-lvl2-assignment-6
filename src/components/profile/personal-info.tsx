import React, { useEffect, useState } from "react";
import type { IArea, ICity, IUser } from "@/types";
import { Mail, MapPin, Phone } from "lucide-react";
import { Label } from "../ui/label";
import { fetchAreas, fetchCities } from "@/utils/fetchLocation";
import states from "@/../data/state.json";

interface Props {
  user: IUser;
}

const PersonalInfo: React.FC<Props> = ({ user }) => {
  const [address, setAddress] = useState({
    state: user?.adress?.state || "",
    city: user?.adress?.city || "",
    area: user?.adress?.area || "",
  });
  const [cities, setCities] = useState<ICity[]>([]);
  const [areas, setAreas] = useState<IArea[]>([]);

  useEffect(() => {
    if (user.adress) {
      if (user.adress.state) {
        const state = states.find((state) => state.name === user.adress?.state);
        if (state) {
          setAddress((prev) => ({
            ...prev,
            state: state.id,
          }));
        }
      }
      if (user.adress.city) {
        const city = cities.find((city) => city.name === user.adress?.city);
        if (city) {
          setAddress((prev) => ({
            ...prev,
            city: city.id,
          }));
        }
      }
      if (user.adress.area) {
        const area = areas.find((area) => area.name === user.adress?.area);
        if (area) {
          setAddress((prev) => ({
            ...prev,
            area: area.id,
          }));
        }
      }
    }
  }, [user.adress, states, cities, areas]);

  useEffect(() => {
    if (address.state) {
      fetchCities(address.state).then((data) => {
        setCities(data);
      });
    } else {
      setCities([]);
    }
  }, [address.state]);

  useEffect(() => {
    if (address.city) {
      fetchAreas(address.city).then((data) => {
        setAreas(data);
      });
    } else {
      setAreas([]);
    }
  }, [address.city]);
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Full Name
        </Label>
        <p className="text-sm bg-muted px-3 py-2 rounded-md">
          {user?.name || "Not provided"}
        </p>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Email Address
        </Label>
        <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm">{user?.email}</p>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm font-medium text-muted-foreground">
          Phone Number
        </Label>
        <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
          <Phone className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm">{user?.phone || "Not provided"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 w-full gap-2">
        {[
          {
            name: "State",
            value: user?.adress?.state || "Not provided",
          },
          {
            name: "City",
            value: user?.adress?.city || "Not provided",
          },
          {
            name: "Area",
            value: user?.adress?.area || "Not provided",
          },
          {
            name: "Address",
            value: user?.adress?.address || "Not provided",
          },
        ].map((item) => (
          <div className="space-y-2 w-full overflow-ellipsis" key={item.name}>
            <Label className="text-sm font-medium text-muted-foreground overflow-ellipsis">
              {item.name}
            </Label>
            <div className="flex items-center gap-2 bg-muted px-3 py-2 rounded-md">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PersonalInfo;
