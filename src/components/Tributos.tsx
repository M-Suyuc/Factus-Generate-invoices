import { SelectItem } from "@/components/ui/select"
import { SelectComponent } from "./SelectComponent"
import { getTributesProducts } from "@/actions/get-tribute-products"
import { Tributos } from "@/interfaces/tributos"

export async function SelectTributo() {
  try {
    const tributos: Tributos = await getTributesProducts()

    return (
      <SelectComponent title="Selecciona tu tributo" label="Tributos">
        {tributos.data?.map((tributo) => (
          <SelectItem key={tributo.id} value={tributo.id.toString()}>
            {tributo.name}
          </SelectItem>
        ))}
      </SelectComponent>
    )
  } catch (error) {
    console.error("Error fetching tributes:", error)
    return (
      <div>
        Error al cargar los tributos. Por favor, inténtelo de nuevo más tarde.
      </div>
    )
  }
}
