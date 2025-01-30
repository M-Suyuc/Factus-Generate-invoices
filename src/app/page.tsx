// import { InputWithLabel } from "@/components/InputWithLabel"
import { InputWithLabel } from "@/components/InputWithLabel"
import { SelectMuni } from "@/components/Municipios"
import { SelectTributo } from "@/components/Tributos"

export default async function Home() {
  return (
    <div className="m-10">
      <section className="flex flex-col gap-4">
        <h1 className="font-bold text-2xl text-blue-600 mb-5">Factura</h1>
        <div className="grid grid-cols-3  gap-5">
          <InputWithLabel
            label="Names"
            id="names"
            placeholder="Ingrese su nombre completo"
          />
        </div>
      </section>
      <br />
      <section>
        <h1 className="font-bold text-2xl text-blue-600 mb-5">Client</h1>
        <div className="grid grid-cols-3 gap-5">
          <InputWithLabel
            label="Identificacion"
            id="identificaion"
            placeholder="Ingrese su identificionnnnnnnnnn"
          />
          <InputWithLabel
            label="Names"
            id="names"
            placeholder="Ingrese su nombre completo"
          />
          <InputWithLabel
            label="Direccion"
            id="address"
            placeholder="Ingrese su direccion"
          />
          <InputWithLabel
            label="Correo"
            id="email"
            placeholder="Ingrese su correo electronico"
            type="email"
          />
          <InputWithLabel
            label="Telefono"
            id="names"
            placeholder="Ingrese su numero de telefono"
            type="phone"
          />
        </div>
      </section>
      <section>
        <h1 className="font-bold text-2xl text-blue-600 mb-5">Items</h1>
      </section>
      <SelectMuni />
      <SelectTributo />
    </div>
  )
}
