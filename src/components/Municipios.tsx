import { getMunicipalities } from "@/actions/get-municipalities"
import { SelectItem } from "@/components/ui/select"
import { Municipios } from "@/interfaces/municipalities"
import { SelectComponent } from "./SelectComponent"

export async function SelectMuni() {
  const minucipalities: Municipios = await getMunicipalities()

  return (
    <SelectComponent title="Selecciona tu municipio" label="Municipalidades">
      {minucipalities.data.map((municipality) => (
        <SelectItem key={municipality.id} value={municipality.id.toString()}>
          {municipality.name}
        </SelectItem>
      ))}
    </SelectComponent>
  )
}
