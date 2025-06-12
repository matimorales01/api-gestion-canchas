import { useState } from "react";
import { CommonLayout } from "@/components/CommonLayout/CommonLayout";
import { useAppForm } from "@/config/use-app-form";
import { CrearReservaSchema } from "@/models/Reserva";
import { useCanchas } from "@/services/CanchaService";
import { useCrearReserva } from "@/services/ReservasService";
import { MiComposedChart,CrearPartidoCerradoForm,CrearPartidoAbiertoForm } from "@/components/UnderConstruction/graficos.jsx";

export const CrearReservaScreen = () => {
const { data: canchas, isLoading, isError } = useCanchas();
const [selectedId, setSelectedId] = useState<number | null>(null);
const [errorMsg, setErrorMsg] = useState<string | null>(null);
const [step, setStep] = useState<"reserva" | "partido" | null>("reserva");
const [partidoTipo, setPartidoTipo] = useState<"abierto" | "cerrado" | null>(null);

const { mutate } = useCrearReserva({
    onError: (error) => {
        if (error instanceof Error) {
            setErrorMsg(error.message);
        } else {
            setErrorMsg("Ocurrió un error al crear la reserva.");
        }
    },
    onSuccess: () => {
        setErrorMsg(null); // Limpiar error al tener éxito
        //setStep("partido");
    }
});

const form = useAppForm({
    defaultValues: {
    canchaId: "",
    fecha: "",
    horaFin: "",
    horaInicio: "",
    },
    validators: {
    onChange: CrearReservaSchema,
    },
    onSubmit: async ({ value }) => {
    setErrorMsg(null); // Limpiar error previo
    mutate(value);
    },
});

const { AppForm, FormContainer, AppField } = form;

const handleRowClick = (id: number) => {
    setSelectedId(id);
    form.setFieldValue("canchaId", id.toString());
};

if (isLoading) {
    return (
    <CommonLayout>
        <p>Cargando canchas...</p>
    </CommonLayout>
    );
}

if (isError) {
    return (
    <CommonLayout>
        <p>Error al cargar las canchas.</p>
    </CommonLayout>
    );
}

    if (step === "reserva") {
        return (
            <CommonLayout>
            <AppForm>
                <FormContainer extraError={null}>
                {errorMsg && (<div style={{ color: "red", marginBottom: "1rem" }}>{errorMsg}</div>)}
                <div>
                    <MiComposedChart canchas={canchas} selectedId={selectedId} handleRowClick={handleRowClick} />
                </div>
                <div>
                    <AppField name="fecha" children={(field) => <field.TextField label="Fecha del partido" />} />
                    <AppField name="horaInicio" children={(field) => <field.TextField label="Hora inicio" />} />
                    <AppField name="horaFin" children={(field) => <field.TextField label="Hora fin" />} />
                </div>
                </FormContainer>
            </AppForm>
            </CommonLayout>
        );
    }



};
