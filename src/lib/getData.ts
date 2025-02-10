import { getMeasurementUnits } from "@/actions/get-measurement-units"
import { getMunicipalities } from "@/actions/get-municipalities"
import { getRangoNumeracion } from "@/actions/get-rango-numeracion"
import { getTributesProducts } from "@/actions/get-tribute-products"

export const getData = async () => {
  const [rangos, tributos, municipalities, medidas] = await Promise.all([
    getRangoNumeracion(),
    getTributesProducts(),
    getMunicipalities(),
    getMeasurementUnits(),
  ])

  return {
    rangos,
    tributos,
    municipalities,
    medidas,
  }
}
