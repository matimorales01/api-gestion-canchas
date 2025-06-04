import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { LoginRequestSchema } from "@/models/Login";
import { useLogin } from "@/services/UserServices";
import { useToken } from "@/services/TokenContext";


export const LoginScreen = () => {
  const { mutate, error } = useLogin();
  const { setToken } = useToken();

  const formData = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: LoginRequestSchema,
    },
    onSubmit: async ({ value }) => {
    mutate(value, {
      onSuccess: (data) => {
        if (data?.token) {
          setToken(data.token);
        }
      },
    });
  },
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