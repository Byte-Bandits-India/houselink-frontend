"use client";

import { useState, useEffect } from "react";
import { Form, Input, DatePicker, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth } from "@/context/AuthContext";
import { updateMe, getImageUrl } from "@/lib/api";

type Tab = "update" | "password";

export default function ProfilePage() {
  const [activeTab] = useState<Tab>("update");
  const { user, isLoading, setAuthUser } = useAuth();

  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMsg, setUpdateMsg] = useState({ type: "", text: "" });
  const [previewUrl, setPreviewUrl] = useState<string>(
    user?.avatarImage ? getImageUrl(user.avatarImage) : "/assets/images/about-us/unknown.jpg"
  );

  const [form] = Form.useForm();

  useEffect(() => {
    if (user?.avatarImage) {
      setPreviewUrl(getImageUrl(user.avatarImage));
    } else {
      setPreviewUrl("/assets/images/about-us/unknown.jpg");
    }
  }, [user]);

  useEffect(() => {
    return () => {
      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

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
        state: user.state,
        city: user.city,
      });
    }
  }, [user, form]);

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
        <div>
          <h2 className="text-2xl font-bold text-brand mb-6">Update Profile</h2>

          {updateMsg.text && (
            <div className={`p-4 mb-6 rounded-lg text-sm border ${updateMsg.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-700 border-green-100'}`}>
              {updateMsg.text}
            </div>
          )}

          <Form
            form={form}
            layout="vertical"
            className="space-y-6"
            onFinish={async (values) => {
              setIsUpdating(true);
              setUpdateMsg({ type: "", text: "" });

              const formData = new FormData();
              if (values.firstName) formData.append("firstName", values.firstName);
              if (values.lastName) formData.append("lastName", values.lastName);
              if (values.username) formData.append("username", values.username);
              if (values.company) formData.append("company", values.company);
              if (values.dob) formData.append("dob", values.dob.format("YYYY-MM-DD"));

              if (values.avatar && values.avatar.length > 0 && values.avatar[0].originFileObj) {
                formData.append("avatar", values.avatar[0].originFileObj);
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
            {/* Circular Profile Photo Preview Header */}
            <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-slate-50/50 rounded-2xl border border-gray-200/60 shadow-sm mb-6">
              <div className="shrink-0 relative">
                <img
                  src={previewUrl || "/assets/images/about-us/unknown.jpg"}
                  alt="Profile Preview"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-white shadow-md"
                />
              </div>
              <div className="flex-grow text-center sm:text-left space-y-2">
                <h4 className="text-base font-bold text-ink">Profile Photo</h4>
                <p className="text-xs sm:text-sm text-ink-muted">Choose a square image for best appearance. Recommended formats: JPG, PNG.</p>
                <Form.Item
                  name="avatar"
                  valuePropName="fileList"
                  getValueFromEvent={(e: any) => (Array.isArray(e) ? e : e?.fileList)}
                  extra={<span className="text-xs text-ink-muted block mt-1">* Image should be minimum 2MB</span>}
                  className="mb-0 inline-block"
                >
                  <Upload
                    beforeUpload={() => false}
                    maxCount={1}
                    accept="image/*"
                    showUploadList={false}
                    onChange={(info) => {
                      const file = info.fileList[0]?.originFileObj;
                      if (file) {
                        const url = URL.createObjectURL(file);
                        setPreviewUrl(url);
                      } else {
                        setPreviewUrl(user?.avatarImage ? getImageUrl(user.avatarImage) : "/assets/images/about-us/unknown.jpg");
                      }
                    }}
                  >
                    <Button icon={<UploadOutlined />} className="hover:border-brand hover:text-brand font-medium">Change Avatar</Button>
                  </Upload>
                </Form.Item>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* First Name */}
              <Form.Item
                label={<span>First Name <span className="text-red-500">*</span></span>}
                name="firstName"
                rules={[{ required: true, message: "Please enter your first name" }]}
                className="mb-0"
              >
                <Input size="large" maxLength={50} />
              </Form.Item>

              {/* Last Name */}
              <Form.Item
                label="Last Name"
                name="lastName"
                className="mb-0"
              >
                <Input size="large" maxLength={50} />
              </Form.Item>

              {/* Username */}
              <Form.Item
                label="Username"
                name="username"
                className="mb-0"
              >
                <Input size="large" maxLength={50} />
              </Form.Item>

              {/* Phone */}
              <Form.Item
                label="Phone"
                name="phone"
                className="mb-0"
              >
                <Input size="large" readOnly className="bg-gray-50 cursor-not-allowed" />
              </Form.Item>

              {/* Email */}
              <Form.Item
                label="Email"
                name="email"
                className="mb-0"
              >
                <Input size="large" readOnly className="bg-gray-50 cursor-not-allowed" />
              </Form.Item>

              {/* Company */}
              <Form.Item
                label="Company"
                name="company"
                className="mb-0"
              >
                <Input size="large" maxLength={100} />
              </Form.Item>

              {/* Date of Birth */}
              <Form.Item
                label="Date of Birth"
                name="dob"
                className="mb-0"
              >
                <DatePicker size="large" className="w-full" format="YYYY-MM-DD" />
              </Form.Item>

              {/* State */}
              <Form.Item
                label="State"
                name="state"
                className="mb-0"
              >
                <Input size="large" readOnly className="bg-gray-50 cursor-not-allowed" />
              </Form.Item>

              {/* City */}
              <Form.Item
                label="City"
                name="city"
                className="mb-0"
              >
                <Input size="large" readOnly className="bg-gray-50 cursor-not-allowed" />
              </Form.Item>


            </div>

            {/* Submit */}
            <div className="text-center pt-8">
              <Button
                type="primary"
                htmlType="submit"
                loading={isUpdating}
                size="large"
                className="bg-brand hover:bg-brand/90 font-bold px-8"
              >
                {isUpdating ? "Updating..." : "Update Profile"}
              </Button>
            </div>
          </Form>
        </div>
      )}
    </div>
  );
}
