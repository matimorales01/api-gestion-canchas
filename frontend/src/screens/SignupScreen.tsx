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
      firstName: "",
      lastName: "",
      age: "",
      genre: "",
      zone: "",

    },
    validators: { onChange: SignupSchema },

  onSubmit: async ({ value }) => {
    mutate(value);
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
          <formData.AppField name="firstName" children={(field) => <field.TextField label="Firstname" />} />
          <formData.AppField name="lastName" children={(field) => <field.TextField label="Lastname" />} />
          <formData.AppField name="genre" children={(field) => <field.TextField label="Genre" />} />
          <formData.AppField name="age" children={(field) => <field.TextField label="Age" />} />
          <formData.AppField name="zone" children={(field) => <field.TextField label="Zone" />} />
        </formData.FormContainer>
      </formData.AppForm>
    </CommonLayout>
  );
};


