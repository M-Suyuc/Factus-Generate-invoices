import { getData } from "@/lib/getData"
import { CreateInvoicePage } from "./form-invoice"

export default async function Home() {
  const { rangos, municipalities, tributos, medidas } = await getData()

  return (
    <CreateInvoicePage
      rangos={rangos}
      tributos={tributos}
      municipios={municipalities}
      medidas={medidas}
    />
  )
}
