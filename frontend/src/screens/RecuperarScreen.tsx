import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { RecuperacionRequestSchema } from "@/models/Login";
import { useCambiarContrasenia } from "@/services/UserServices";
import { useParams } from "react-router-dom"; // usás react-router-dom, no wouter
import styles from "../styles/LoginScreen.module.css";

export const RecuperarScreen = () => {

  const { mutate, error } = useCambiarContrasenia();
  const { token } = useParams();
	console.log("Token:", token);
	
  const formData = useAppForm({
    defaultValues: {
      newPassword: "",
    },
    validators: { onChange: RecuperacionRequestSchema },

    onSubmit: async ({ value }) => {
      if (!token) {
        alert("Token no encontrado en la URL.");
        return;
      }
      console.log("Enviar nueva contraseña con token:", token);
      mutate({ token, newPassword: value.newPassword });
    },
  });

	return (
		<CommonLayout>
			<div className={styles.loginBox}>
			<h1 className={styles.title}>Recupera Contraseña</h1>
			<p className={styles.subtitle}>
				Complete los datos para iniciar la Recuperacion.
			</p>
			<formData.AppForm>
				<formData.FormContainer extraError={error}>
					<div className={styles.inputGroup}>
			
					<div className={styles.inputGroup}>
					<formData.AppField name="newPassword">
						{(field) => (<field.PasswordField label="Nueva Contraseña"/>)}
					</formData.AppField>
					</div>
				</div>
				<div className={styles.buttonRow}>
					<formData.SubmitButton className={styles.submitButton}>
					enviar
					</formData.SubmitButton>
				</div>
				</formData.FormContainer>
			</formData.AppForm>
			</div>
		</CommonLayout>
		);
};
export default RecuperarScreen;