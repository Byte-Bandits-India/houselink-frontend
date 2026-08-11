"use client";

import { useState, useEffect } from "react";
import { Form, Input, DatePicker, Button, Select } from "antd";
import dayjs from "dayjs";
import { useAuth } from "@/context/AuthContext";
import { updateMe, getImageUrl, getStates, getCities } from "@/lib/api";
import { PhoneInput } from "@/components/reui/phone-input";
import { Pattern as AvatarUpload } from "@/components/examples/c-file-upload-2";
import type { FileWithPreview } from "@/hooks/use-file-upload";

type Tab = "update" | "password";

export default function ProfilePage() {
  const [activeTab] = useState<Tab>("update");
  const { user, isLoading, setAuthUser } = useAuth();

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState({ type: "", text: "" });
  const [avatarFile, setAvatarFile] = useState<FileWithPreview | null>(null);
  const defaultAvatarUrl = user?.avatarImage
    ? getImageUrl(user.avatarImage)
    : "/assets/images/about-us/unknown.jpg";

  const [form] = Form.useForm();

  const [states, setStates] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  // Load states on mount
  useEffect(() => {
    getStates()
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setStates(res.data);
        }
      })
      .catch((err) => console.error("Failed to load states:", err));
  }, []);

  // Map initial values and load cities
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        phone: user.phone,
        email: user.email,
        company: user.company,
        dob: user.dob ? dayjs(user.dob) : undefined,
        state: user.state || undefined,
        city: user.city || undefined,
      });

      if (user.stateId) {
        setLoadingCities(true);
        getCities(Number(user.stateId))
          .then((res) => {
            if (res.success && Array.isArray(res.data)) {
              setCities(res.data);
            }
          })
          .catch((err) => console.error("Failed to load cities:", err))
          .finally(() => setLoadingCities(false));
      }
    }
  }, [user, form]);

  // Watch all values of the form to update completion percentage automatically on typing/editing
  const formValues = Form.useWatch([], form);
  const fields = [
    formValues?.firstName !== undefined ? formValues.firstName : user?.firstName,
    formValues?.lastName !== undefined ? formValues.lastName : user?.lastName,
    formValues?.username !== undefined ? formValues.username : user?.username,
    formValues?.phone !== undefined ? formValues.phone : user?.phone,
    formValues?.email !== undefined ? formValues.email : user?.email,
    formValues?.company !== undefined ? formValues.company : user?.company,
    formValues?.dob !== undefined ? formValues.dob : user?.dob,
    formValues?.state !== undefined ? formValues.state : user?.state,
    formValues?.city !== undefined ? formValues.city : user?.city
  ];
  const filledFields = fields.filter(Boolean).length;
  const percentage = Math.round((filledFields / fields.length) * 100) || 0;

  const missingFields: string[] = [];
  if (!fields[0]) missingFields.push("First Name");
  if (!fields[1]) missingFields.push("Last Name");
  if (!fields[2]) missingFields.push("Username");
  if (!fields[3]) missingFields.push("Phone");
  if (!fields[4]) missingFields.push("Email");
  if (!fields[5]) missingFields.push("Company");
  if (!fields[6]) missingFields.push("Date of Birth");
  if (!fields[7]) missingFields.push("State");
  if (!fields[8]) missingFields.push("City");

  let statusText = "";
  if (missingFields.length > 0) {
    statusText = `Consider adding your ${missingFields.slice(0, 2).join(" and ")}${missingFields.length > 2 ? "..." : ""} to reach 100%.`;
  }

  if (isLoading) {
    return <div className="p-6 text-center text-gray-500">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-6 text-center text-gray-500">Please log in to view your profile.</div>;
  }

  return (
    <div className="space-y-6">
      {/* ── Update Profile ───────────────────────────────── */}
      {activeTab === "update" && (
        <Form
          form={form}
          layout="vertical"
          onValuesChange={(changedValues) => {
            if ("state" in changedValues) {
              const stateName = changedValues.state;
              form.setFieldsValue({ city: undefined });
              setCities([]);
              const selectedState = states.find((s) => s.name === stateName);
              if (selectedState) {
                setLoadingCities(true);
                getCities(Number(selectedState.id))
                  .then((res) => {
                    if (res.success && Array.isArray(res.data)) {
                      setCities(res.data);
                    }
                  })
                  .catch((err) => console.error("Failed to load cities:", err))
                  .finally(() => setLoadingCities(false));
              }
            }
          }}
          onFinish={async (values) => {
            setIsUpdating(true);
            setUpdateMsg({ type: "", text: "" });

            const formData = new FormData();
            if (values.firstName) formData.append("firstName", values.firstName);
            if (values.lastName) formData.append("lastName", values.lastName);
            if (values.username) formData.append("username", values.username);
            if (values.company) formData.append("company", values.company);
            if (values.phone) formData.append("phone", values.phone);
            if (values.email) formData.append("email", values.email);
            if (values.dob) formData.append("dob", values.dob.format("YYYY-MM-DD"));

            // Resolve stateId and cityId from selected names
            let stateId = user?.stateId;
            let cityId = user?.cityId;

            if (values.state) {
              const selectedState = states.find((s) => s.name === values.state);
              if (selectedState) {
                stateId = selectedState.id;
              }
            }
            if (values.city) {
              const selectedCity = cities.find((c) => c.name === values.city);
              if (selectedCity) {
                cityId = selectedCity.id;
              }
            }

            if (stateId) formData.append("stateId", stateId.toString());
            if (cityId) formData.append("cityId", cityId.toString());

            if (avatarFile?.file instanceof File) {
              formData.append("avatar", avatarFile.file);
            }

            try {
              const res = await updateMe(formData);
              if (res.customer) {
                setAuthUser(res.customer);
                setUpdateMsg({ type: "success", text: "Profile updated successfully!" });
              }
            } catch (err: any) {
              setUpdateMsg({ type: "error", text: err.message || "Failed to update profile." });
            } finally {
              setIsUpdating(false);
            }
          }}
        >
          {/* Header: Title and Save button */}
          <div className="flex items-center justify-between border-b pb-4 mb-6">
            <h2 className="text-2xl font-bold text-[#163D75]">Update Profile</h2>
            <Button
              type="primary"
              htmlType="submit"
              loading={isUpdating}
              className="bg-gradient-to-r from-primary to-secondary text-white font-bold px-6 py-2 rounded-lg h-auto border-none shadow-sm flex items-center justify-center hover:opacity-90"
            >
              Save
            </Button>
          </div>

          {updateMsg.text && (
            <div className={`p-4 mb-6 rounded-lg text-sm border ${updateMsg.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
              {updateMsg.text}
            </div>
          )}

          {/* Profile completion banner */}
          <div className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center gap-4 p-5 rounded-2xl bg-gradient-to-r from-[#163D75] via-[#2E62A6] to-[#4F8BD3] text-white shadow-md border border-white/10 mb-6">
            {/* Subtle glassmorphic glows */}
            <div className="absolute -right-12 -top-12 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

            <div className="relative flex items-center gap-4 z-10">
              <div className="relative w-20 h-20 flex items-center justify-center shrink-0 bg-white/10 rounded-full shadow-inner">
                <svg className="w-18 h-18 transform -rotate-90" viewBox="0 0 40 40">
                  {/* Background Circle */}
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    className="stroke-white/20"
                    strokeWidth="3.2"
                    fill="transparent"
                  />
                  {/* Foreground/Progress Circle */}
                  <circle
                    cx="20"
                    cy="20"
                    r="16"
                    className="stroke-white transition-all duration-500 ease-out"
                    strokeWidth="3.2"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 16}`}
                    strokeDashoffset={`${2 * Math.PI * 16 * (1 - percentage / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-sm font-bold text-white">{percentage}%</span>
              </div>
              
              <div className="flex flex-col text-left">
                <h4 className="font-bold text-base tracking-wide flex items-center gap-2">
                  Complete your profile
                </h4>
                <p className="text-xs text-white/90 mt-1 leading-relaxed max-w-xl">
                  {percentage === 100 
                    ? "Great job! Your profile details are fully complete and up to date." 
                    : `Your profile details are ${percentage}% complete. ${statusText}`
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Input field grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Profile Picture — spans the first three rows of column 1 */}
            <div className="md:row-span-3 flex flex-col">
              <span className="text-sm text-gray-700 mb-2">Profile Picture</span>
              <div className="flex-1 bg-white border border-gray-200 rounded-2xl flex items-center justify-center p-4">
                <AvatarUpload
                  maxSize={5 * 1024 * 1024}
                  defaultAvatar={defaultAvatarUrl}
                  onFileChange={setAvatarFile}
                />
              </div>
            </div>

            {/* First Name */}
            <Form.Item
              label={<span>First Name <span className="text-red-500">*</span></span>}
              name="firstName"
              rules={[{ required: true, message: "Please enter your first name" }]}
              className="mb-0"
            >
              <Input size="large" maxLength={50} className="rounded-lg border-gray-300" />
            </Form.Item>

            {/* Last Name */}
            <Form.Item
              label="Last Name"
              name="lastName"
              className="mb-0"
            >
              <Input size="large" maxLength={50} className="rounded-lg border-gray-300" />
            </Form.Item>

            {/* Phone */}
            <Form.Item
              label={<span>Phone <span className="text-red-500">*</span></span>}
              name="phone"
              rules={[{ required: true, message: "Please enter your phone number" }]}
              className="mb-0"
            >
              <PhoneInput
                defaultCountry="IN"
                className="w-full rounded-lg border-gray-300 [&_button]:h-[40px] [&_input]:h-[40px] [&_input]:rounded-r-lg [&_button]:rounded-l-lg [&_input]:border-gray-300 [&_button]:border-gray-300"
              />
            </Form.Item>

            {/* Email */}
            <Form.Item
              label={<span>Email <span className="text-red-500">*</span></span>}
              name="email"
              rules={[
                { required: true, message: "Please enter your email address" },
                { type: "email", message: "Please enter a valid email address" }
              ]}
              className="mb-0"
            >
              <Input size="large" className="rounded-lg border-gray-300" />
            </Form.Item>

            {/* Username */}
            <Form.Item
              label="Username"
              name="username"
              className="mb-0"
            >
              <Input size="large" maxLength={50} className="rounded-lg border-gray-300" />
            </Form.Item>

            {/* Company */}
            <Form.Item
              label="Company"
              name="company"
              className="mb-0"
            >
              <Input size="large" maxLength={100} className="rounded-lg border-gray-300" />
            </Form.Item>

            {/* Date of Birth */}
            <Form.Item
              label="Date of Birth"
              name="dob"
              className="mb-0"
            >
              <DatePicker size="large" className="w-full rounded-lg border-gray-300" format="YYYY-MM-DD" />
            </Form.Item>

            {/* State */}
            <Form.Item
              label={<span>State <span className="text-red-500">*</span></span>}
              name="state"
              rules={[{ required: true, message: "Please select a state" }]}
              className="mb-0"
            >
              <Select
                size="large"
                placeholder="Select State"
                className="w-full rounded-lg"
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={states.map((s) => ({
                  value: s.name,
                  label: s.name,
                }))}
              />
            </Form.Item>

            {/* City */}
            <Form.Item
              label={<span>City <span className="text-red-500">*</span></span>}
              name="city"
              rules={[{ required: true, message: "Please select a city" }]}
              className="mb-0"
            >
              <Select
                size="large"
                placeholder="Select City"
                className="w-full rounded-lg"
                loading={loadingCities}
                disabled={!form.getFieldValue("state")}
                showSearch
                optionFilterProp="children"
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
                options={cities.map((c) => ({
                  value: c.name,
                  label: c.name,
                }))}
              />
            </Form.Item>
          </div>
        </Form>
      )}
    </div>
  );
}
