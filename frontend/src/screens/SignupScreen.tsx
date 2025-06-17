import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { SignupSchema } from "@/models/Login";
import { useSignup } from "@/services/UserServices";
import styles from "../styles/SignupScreen.module.css";

export const SignupScreen = () => {
  const { mutate, error } = useSignup();

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
        <div className={styles.signupBox}>
          <h1 className={styles.title}>Crear cuenta</h1>
          <p className={styles.subtitle}>Completá los datos para registrarte.</p>
          <formData.AppForm>
            <formData.FormContainer extraError={error}>
              <div className={styles.fieldsGrid}>
                <div className={styles.inputGroup}>
                  <formData.AppField name="username">
                    {(field) => <field.TextField label="Usuario" />}
                  </formData.AppField>
                </div>
                <div className={styles.inputGroup}>
                  <formData.AppField name="password">
                    {(field) => <field.PasswordField label="Contraseña" />}
                  </formData.AppField>
                </div>
                <div className={styles.inputGroup}>
                  <formData.AppField name="email">
                    {(field) => <field.TextField label="Email" />}
                  </formData.AppField>
                </div>
                <div className={styles.inputGroup}>
                  <formData.AppField name="firstName">
                    {(field) => <field.TextField label="Nombre" />}
                  </formData.AppField>
                </div>
                <div className={styles.inputGroup}>
                  <formData.AppField name="lastName">
                    {(field) => <field.TextField label="Apellido" />}
                  </formData.AppField>
                </div>
                <div className={styles.inputGroup}>
                  <formData.AppField name="genre">
                    {(field) => <field.TextField label="Género" />}
                  </formData.AppField>
                </div>
                <div className={styles.inputGroup}>
                  <formData.AppField name="age">
                    {(field) => <field.TextField label="Edad" />}
                  </formData.AppField>
                </div>
                <div className={styles.inputGroup}>
                  <formData.AppField name="zone">
                    {(field) => <field.TextField label="Zona" />}
                  </formData.AppField>
                </div>
              </div>
              <div className={styles.buttonRow}>
                <formData.SubmitButton className={styles.submitButton}>
                  Registrarme
                </formData.SubmitButton>
              </div>
            </formData.FormContainer>
          </formData.AppForm>
        </div>
      </CommonLayout>
  );
};

export default SignupScreen;
