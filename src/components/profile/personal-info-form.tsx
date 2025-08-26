import type { IArea, ICity, IUser } from "@/types";
import React, { useEffect, useState } from "react";
import { Mail, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, type UserSchema } from "@/lib/zodSchema";
import { Form } from "../ui/form";
import { RHFInput } from "../rhf-input";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { RHFSelect } from "../rhf-select";
import states from "@/../data/state.json";
import { fetchAreas, fetchCities } from "@/utils/fetchLocation";
import { useUpdateUserMutation } from "@/redux/features/user/userApi";
import { toast } from "sonner";

interface Props {
  user: IUser;
}

const PersonalInfoForm: React.FC<Props> = ({ user }) => {
  const [address, setAddress] = useState({
    state: user?.adress?.state || "",
    city: user?.adress?.city || "",
    area: user?.adress?.area || "",
  });
  const [cities, setCities] = useState<ICity[]>([]);
  const [areas, setAreas] = useState<IArea[]>([]);
  const form = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: user.name,
      phone: user.phone,
      adress: {
        state: user?.adress?.state || "",
        city: user?.adress?.city || "",
        area: user?.adress?.area || "",
        adress: user?.adress?.address || "",
      },
    },
  });

  const [updateProfile, { isLoading }] = useUpdateUserMutation();

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

  const handleProfileUpdate = async (value: UserSchema) => {
    try {
      await updateProfile({ id: user._id, data: value }).unwrap();
      form.reset();
      toast.success("Profile Updated Successfully!");
    } catch (error) {
      toast.error("Update Failed");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleProfileUpdate)}
        className="space-y-4"
      >
        <RHFInput
          name="name"
          control={form.control}
          placeholder="Enter your name"
          label="Full Name"
        />

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              value={user.email}
              placeholder="Enter your email"
              className="pl-10"
              disabled
            />
          </div>
        </div>

        <RHFInput
          name="phone"
          control={form.control}
          label="Phone Number"
          placeholder="Enter your phone number"
        />
        <div className="flex flex-wrap gap-3">
          <RHFSelect
            name="adress.state"
            control={form.control}
            label="State"
            options={states.map((state) => ({
              label: state.name,
              value: state.name,
              id: state.id,
            }))}
            placeholder="Select your state"
            onChange={(value) =>
              setAddress({ ...address, state: value.id as string })
            }
          />
          <RHFSelect
            name="adress.city"
            control={form.control}
            label="City"
            options={cities.map((city) => ({
              label: city.name,
              value: city.name,
              id: city.id,
            }))}
            placeholder="Select your city"
            onChange={(value) =>
              setAddress({ ...address, city: value.id as string })
            }
          />
          <RHFSelect
            name="adress.area"
            control={form.control}
            label="Area"
            options={areas.map((area) => ({
              label: area.name,
              value: area.name,
              id: area.id,
            }))}
            placeholder="Select your area"
            onChange={(value) =>
              setAddress({ ...address, area: value.id as string })
            }
          />
        </div>
        <RHFInput
          name="adress.adress"
          control={form.control}
          label="Address"
          placeholder="Enter your full address"
        />

        <Button type="submit" disabled={isLoading} className="w-full">
          <Save className="h-4 w-4 mr-2" />
          {isLoading ? "Updating..." : "Update Profile"}
        </Button>
      </form>
    </Form>
  );
};

export default PersonalInfoForm;
