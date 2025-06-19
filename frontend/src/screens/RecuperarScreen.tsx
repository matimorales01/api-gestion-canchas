import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { RecuperacionRequestSchema } from "@/models/Login";
import { useRecuperacion } from "@/services/UserServices";

import styles from "../styles/LoginScreen.module.css";

export const RecuperarScreen = () => {

	const { mutate, error } = useRecuperacion();

	const formData = useAppForm({
		defaultValues: { 
			email:"",
			newPassword:"",
		},
	validators: { onChange: RecuperacionRequestSchema },
	onSubmit: async ({ value }) => {
	
		mutate(value);
		console.log("Enviar email para recuperar:", value.email);
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
					<div className={styles.fieldsGrid}>
					<div className={styles.inputGroup}>
					<formData.AppField name="email">{(field) => (<field.TextField label=" Ingrese su Email"/>)}
					</formData.AppField></div>
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