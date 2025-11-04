import { AuthContext } from "../auth/AuthContext.jsx";
import { useState, useContext } from "react";

// Componente 'Orders' - formulario para crear un pedido de impresión 3D
// Firma: Orders(AuthProvider)
// Nota: AuthProvider puede ser un objeto/prop que contenga un token o una función getToken().

const Orders = (AuthProvider) => {
  // Campos del pedido
  const [emailContacto, setEmailContacto] = useState("");
  const [clienteNombre, setClienteNombre] = useState("");
  const [titulo, setTitulo] = useState("");
  const [archivo, setArchivo] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const [material, setMaterial] = useState("PLA");
  const [color, setColor] = useState("");
  const [alturaCapa, setAlturaCapa] = useState("0.20");
  const [rellenoPct, setRellenoPct] = useState(15);
  const [estado, setEstado] = useState("nuevo");

  // get auth from context and optional API base from env
  const auth = useContext(AuthContext);
  const API_BASE = import.meta.env.VITE_API_BASE ?? "";

  // UI state
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // añadir/editar handler del input de archivo
  const handleFileChange = (e) => {
    const f = e?.target?.files && e.target.files[0];
    setArchivo(f || null);
  };

  const resetForm = () => {
    setEmailContacto("");
    setClienteNombre("");
    setTitulo("");
    setArchivo(null);
    setCantidad(1);
    setMaterial("PLA");
    setColor("");
    setAlturaCapa("0.20");
    setRellenoPct(15);
    setEstado("nuevo");
  };

  // Lista de campos obligatorios: sacá o poné los que quieras
  const REQUIRED_FIELDS = ["titulo", "archivo", "cantidad", "emailContacto"];

  // valida según el estado actual
  const validate = () => {
    const missing = [];
    if (REQUIRED_FIELDS.includes("titulo") && !titulo?.trim()) missing.push("Título");
    if (REQUIRED_FIELDS.includes("cantidad") && (!cantidad || cantidad < 1)) missing.push("Cantidad");
    if (REQUIRED_FIELDS.includes("emailContacto") && !emailContacto?.trim()) missing.push("Email de contacto");

    if (missing.length) {
      setErrorMsg("Faltan campos: " + missing.join(", "));
      return false;
    }
    return true;
  }



  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    if (!validate()) return; // <-- aquí controlás lo obligatorio

    setLoading(true);

    try {
      const form = new FormData();
      form.append("titulo", titulo);
      form.append("email_contacto", emailContacto);
      form.append("cliente_nombre", clienteNombre);
      form.append("cantidad", cantidad);
      form.append("material", material);
      form.append("color", color);
      form.append("altura_capa", alturaCapa);
      form.append("relleno_pct", rellenoPct);
      form.append("estado", estado);
      if (archivo instanceof File) {
        form.append("archivo", archivo);
      }
      // debug: listar entries de FormData antes de enviar
      for (const [k, v] of form.entries()) {
        console.log("form:", k, v instanceof File ? v.name : v);
      }

      // usar la ruta con slash para evitar redirect 307
      const url = API_BASE ? `${API_BASE}/api/orders/` : "/api/orders/";
      const token = (auth && auth.token) || (auth && auth.getToken && auth.getToken()) || (AuthProvider && AuthProvider.token) || (AuthProvider && AuthProvider.getToken && AuthProvider.getToken());
      const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
      const res = await fetch(url, {
        method: "POST",
        body: form,
        headers,
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("server response:", txt);
        throw new Error(txt || "Error en la creación del pedido");
      }

      const data = await res.json();
      setSuccessMsg("Pedido creado correctamente. ID: " + (data.id || "(sin id retornado)"));
      resetForm();
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || "Ocurrió un error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-semibold">Nuevo pedido de impresión 3D</h2>

        <div>
          <label className="block text-sm font-medium">Email de contacto</label>
          <input
            type="email"
            value={emailContacto}
            onChange={(e) => setEmailContacto(e.target.value)}
            placeholder="cliente@example.com"
            className="mt-1 block w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Nombre del cliente</label>
          <input
            type="text"
            value={clienteNombre}
            onChange={(e) => setClienteNombre(e.target.value)}
            placeholder="Nombre y apellido"
            className="mt-1 block w-full rounded-md border px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Título / descripción</label>
          <input
            type="text"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Soporte para sensor, figura, prototipo..."
            className="mt-1 block w-full rounded-md border px-3 py-2"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Archivo 3D (.stl, .obj)</label>
          <input
            type="file"
            accept=".stl,.obj,.zip"
            onChange={handleFileChange}
            className="mt-1 block w-full"
          />
          {archivo && <p className="mt-1 text-sm">Archivo: {archivo.name}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Cantidad</label>
            <input
              type="number"
              min={1}
              value={cantidad}
              onChange={(e) => setCantidad(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Material</label>
            <select
              value={material}
              onChange={(e) => setMaterial(e.target.value)}
              className="mt-1 block w-full rounded-md border px-3 py-2"
            >
              <option>PLA</option>
              <option>PETG</option>
              <option>ABS</option>
              <option>TPU</option>
              <option>Nylon</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Color</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Rojo, Negro, Natural..."
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Altura de capa (mm)</label>
            <input
              type="text"
              value={alturaCapa}
              onChange={(e) => setAlturaCapa(e.target.value)}
              placeholder="0.20"
              className="mt-1 block w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">Relleno (%)</label>
          <input
            type="range"
            min={0}
            max={100}
            value={rellenoPct}
            onChange={(e) => setRellenoPct(Number(e.target.value))}
            className="w-full"
          />
          <div className="text-sm">{rellenoPct}%</div>
        </div>

        <div>
          <label className="block text-sm font-medium">Estado</label>
          <select
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            className="mt-1 block w-full rounded-md border px-3 py-2"
          >
            <option value="nuevo">Nuevo</option>
            <option value="en_revision">En revisión</option>
            <option value="cotizado">Cotizado</option>
            <option value="aprobado">Aprobado</option>
            <option value="en_cola">En cola</option>
            <option value="imprimiendo">Imprimiendo</option>
            <option value="listo">Listo</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>

        {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}
        {successMsg && <p className="text-sm text-green-600">{successMsg}</p>}
        {loading && <p className="text-sm">Cargando...</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            Crear pedido
          </button>

          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 rounded-md border"
            disabled={loading}
          >
            Limpiar
          </button>
        </div>
      </form>
    </div>
  );
}

export default Orders;