import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { EquipoRequestSchema } from "@/models/Equipo";
import { useLocation } from "wouter";
import { crearEquipo } from "@/services/EquipoService";

export const CrearEquipo = () => {

    const [, navigate] = useLocation();

    const { mutate, error, } = crearEquipo({
        onSuccess: () => {
            alert("Equipo creado con exito!");
            navigate("/");
        },
    });

    const formData = useAppForm({
        defaultValues: {
          teamName: "",
          category: "",
          mainColors: "",
          secondaryColors: "",
        },
        validators: {
          onChange: EquipoRequestSchema,
        },
        onSubmit: async ({ value }) => {
          mutate(value);
        },
    });

    return (
        <CommonLayout>
            <h1 className="text-xl font-bold mb-4">Crear Equipo</h1>
                <formData.AppForm>
                    <formData.FormContainer extraError={error}>
                          <formData.AppField name="teamName">
                            {(field) => <field.TextField label="Nombre" />}
                          </formData.AppField>

                        <formData.AppField name="category">
                            {(field) => <field.TextField label="Categoria" />}
                        </formData.AppField>

                        <formData.AppField name="mainColors">
                            {(field) => <field.TextField label="Color Principal" />}
                        </formData.AppField>

                        <formData.AppField name="secondaryColors">
                            {(field) => <field.TextField label="Color Secundario" />}
                        </formData.AppField>
                    </formData.FormContainer>
                </formData.AppForm>
        </CommonLayout>
    );
}