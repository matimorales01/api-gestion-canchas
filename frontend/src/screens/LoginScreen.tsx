import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { LoginRequestSchema } from "@/models/Login";
import { useLogin } from "@/services/UserServices";
import { useLocation } from "wouter";

export const LoginScreen = () => {
  const [, navigate] = useLocation();
  const { mutate, error } = useLogin({
    onSuccess: () => {
      navigate("/"); 
    },
  });

  const formData = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: LoginRequestSchema,
    },
    onSubmit: async ({ value }) => mutate(value),
  });

  return (
    <CommonLayout>
      <h1>Log In</h1>
      <formData.AppForm>
        <formData.FormContainer extraError={error}>
          <formData.AppField name="email" children={(field) => <field.TextField label="email" />} />
          <formData.AppField name="password" children={(field) => <field.PasswordField label="Password" />} />
        </formData.FormContainer>
      </formData.AppForm>
    </CommonLayout>
  );
};
