"use client"

import { DownloadPDF as getPDF } from "@/actions/download-invoice"
import { TableCell } from "@/components/ui/table"
import { useState } from "react"

interface Props {
  pdfNumber: string
}

const DownloadPDF = ({ pdfNumber }: Props) => {
  const [loading, setLoading] = useState(false)

  const handleDownloadPDF = async () => {
    setLoading(true)
    try {
      const pdf = await getPDF(pdfNumber)
      // console.log(pdf)
      // Decodificar Base64 a un Blob
      const byteCharacters = atob(pdf.data.pdf_base_64_encoded)
      const byteNumbers = new Array(byteCharacters.length)
        .fill(0)
        .map((_, i) => byteCharacters.charCodeAt(i))
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: "application/pdf" })

      // Crear una URL para el Blob
      const blobUrl = URL.createObjectURL(blob)

      // Crear un enlace de descarga
      const link = document.createElement("a")
      link.href = blobUrl
      link.download = "documento.pdf"
      document.body.appendChild(link)
      link.click()

      // Limpiar el DOM
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
    } catch {
      console.log("Error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <TableCell
      className="cursor-pointer text-blue-500"
      onClick={handleDownloadPDF}
    >
      {loading ? "Downloading..." : "Download"}
    </TableCell>
  )
}

export default DownloadPDF
