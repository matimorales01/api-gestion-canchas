import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { LoginRequestSchema } from "@/models/Login";
import { useSignup } from "@/services/UserServices";
import { useState } from "react";

export const SignupScreen = () => {
  const { mutate, error } = useSignup();

  const [foto, setFoto] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setFoto(file);
  };

  const formData = useAppForm({
    defaultValues: {
      username: "",
      password: "",

      email: "",
      edad: "",
      genero: "",
      zona: "",
    },
    validators: {
      onChange: LoginRequestSchema,
    },
    onSubmit: async ({ value }) => {

      const formDataToSend = new FormData();

      Object.entries(value).forEach(([key, val]) => {
        formDataToSend.append(key, val as string);
      });
      if (foto) {
        formDataToSend.append("foto", foto);
      }

      mutate(formDataToSend);
    },
  });


  return (
    <CommonLayout>
    
      <h1>Sign Up</h1>
      <formData.AppForm>
        <formData.FormContainer extraError={error}>
          <formData.AppField name="username" children={(field) => <field.TextField label="Username" />} />
          <formData.AppField name="password" children={(field) => <field.PasswordField label="Password" />} />
          <formData.AppField name="email" children={(field) => <field.TextField label="Email" />} />
          <formData.AppField name="edad" children={(field) => <field.TextField label="Edad" />} />
          <formData.AppField name="genero" children={(field) => <field.TextField label="Género" />} />
          <formData.AppField name="zona" children={(field) => <field.TextField label="Zona" />} />
          <label>Foto de perfil:</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </formData.FormContainer>
      </formData.AppForm>
    </CommonLayout>
  );
};