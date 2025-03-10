"use client"

import { use, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function FormInput({ type, name, placeholder, value, onChange }) {
  return (
    <Input type={type} name={name} placeholder={placeholder} value={value} onChange={onChange} required />
  );
}

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    setLoading(true);

    const response = await fetch(
        `${window.location.origin}/api/auth/register`,
        {
            method: "POST",
            headers: {
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(formData),
        }
    );

    if(response.ok){
        alert("Register Berhasil!");
        setLoading(false);
    } else{
        const errorData = await response.json();
        alert(`Register Error : ${errorData.message}`);
        setError(errorData.message);
        setLoading(false);
        console.log(error);
    }
    console.log("Form submitted", formData);
  };

  return (
    <Card className="max-w-md mx-auto mt-10 p-5 shadow-lg rounded-lg">
      <CardContent>
        <h2 className="text-xl font-semibold mb-4">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormInput type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
          <FormInput type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} />
          <FormInput type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
          <FormInput type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />
          <FormInput type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} />
          <Button type="submit" className="w-full">Register</Button>
        </form>
      </CardContent>
    </Card>
  );
}
