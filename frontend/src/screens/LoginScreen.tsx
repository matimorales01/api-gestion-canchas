import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { LoginRequestSchema } from "@/models/Login";
import { useLogin } from "@/services/UserServices";
import styles from "../styles/LoginScreen.module.css";



export const LoginScreen = () => {

  const { mutate, error } = useLogin();

  const formData = useAppForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onChange: LoginRequestSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  return (
      <CommonLayout>
        <div className={styles.loginBox}>
          <h1 className={styles.title}>Iniciar sesión</h1>
          <p className={styles.subtitle}>
            Ingresá tus datos para acceder al sistema.
          </p>
          <formData.AppForm>
            <formData.FormContainer extraError={error}>
              <div className={styles.fieldsGrid}>
                <div className={styles.inputGroup}>
                  <formData.AppField name="email">
                    {(field) => (
                        <field.TextField label="Email"/>
                    )}
                  </formData.AppField>
                </div>
                <div className={styles.inputGroup}>
                  <formData.AppField name="password">
                    {(field) => (
                        <field.PasswordField
                            label="Contraseña"
                        />
                    )}
                  </formData.AppField>
                </div>
              </div>
              <div className={styles.buttonRow}>
                <formData.SubmitButton className={styles.submitButton}>
                  Ingresar
                </formData.SubmitButton>
    
              </div>
            </formData.FormContainer>
          </formData.AppForm>
        </div>
      </CommonLayout>
  );
};

export default LoginScreen;
