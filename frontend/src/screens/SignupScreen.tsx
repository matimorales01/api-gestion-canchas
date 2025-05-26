import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { LoginRequestSchema } from "@/models/Login";
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
      edad: "",
      genero: "",
      zona: "",
      foto: null as File | null,
    },
    validators: { onChange: LoginRequestSchema },
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
          <formData.AppField name="edad" children={(field) => <field.TextField label="Edad" />} />
          <formData.AppField name="genero" children={(field) => <field.TextField label="Género" />} />
          <formData.AppField name="zona" children={(field) => <field.TextField label="Zona" />} />
        </formData.FormContainer>
      </formData.AppForm>
    </CommonLayout>
  );
};


