import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { SignupSchema } from "@/models/Login";
import { useSignup } from "@/services/UserServices";
import { useState } from "react";

export const SignupScreen = () => {
  const { mutate, error } = useSignup();
  const [] = useState<File | null>(null);



  const formData = useAppForm({
    defaultValues: {
      username: "",
      password: "",
      email: "",
      firstname: "",
      lastname: "",
      age: "",
      genre: "",
      zone: "",
      foto: null as File | null,
    },
    validators: { onChange: SignupSchema },
    onSubmit: async ({ value }) => {
    const formDataToSend = new FormData();
    Object.entries(value).forEach(([key, val]) => {
      if (key === "foto" && val) {
        formDataToSend.append("foto", val as File);
      } else {
        formDataToSend.append(key, val as string);
      }
    });
    mutate(formDataToSend);
  },
  });


  return (
    <CommonLayout>
    
      <h1>Sign Up</h1>
      <formData.AppForm>
        <formData.FormContainer extraError={error}>
          
          <label>Foto de perfil:</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              formData.setFieldValue("foto", file);
           //   formData.validateField("foto","change");
              //console.log(file);
            }}
          />
          {formData.getFieldMeta("foto")?.errors && (
            <span style={{ color: "red" }}>{formData.getFieldMeta("foto")?.errors}</span>
          )}
          <formData.AppField name="username" children={(field) => <field.TextField label="Username" />} />
          <formData.AppField name="password" children={(field) => <field.PasswordField label="Password" />} />
          <formData.AppField name="email" children={(field) => <field.TextField label="Email" />} />
          <formData.AppField name="firstname" children={(field) => <field.TextField label="Firstname" />} />
          <formData.AppField name="lastname" children={(field) => <field.TextField label="Lastname" />} />
          <formData.AppField name="genre" children={(field) => <field.TextField label="Genre" />} />
          <formData.AppField name="age" children={(field) => <field.TextField label="Age" />} />
          <formData.AppField name="zone" children={(field) => <field.TextField label="Zone" />} />
        </formData.FormContainer>
      </formData.AppForm>
    </CommonLayout>
  );
};


