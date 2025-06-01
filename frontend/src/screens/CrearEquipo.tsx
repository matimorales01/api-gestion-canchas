export const CrearEquipo = () => {
    return (
        <form>
            <div>
                <label htmlFor="teamName">Nombre del equipo:</label>
                <input type="text" id="teamName" name="teamName" required />
            </div>

            <div>
                <label htmlFor="category">Categoría:</label>
                <input id="category" name="category" />
            </div>

            <div>
                <label htmlFor="mainColors">Colores Principales:</label>
                <input id="mainColors" name="mainColors" />
            </div>

            <div>
                <label htmlFor="secondaryColors">Colores Secundarios:</label>
                <input id="secondaryColors" name="secondaryColors" />

            </div>

            <button type="submit">Crear Equipo</button>
        </form>
    );
}