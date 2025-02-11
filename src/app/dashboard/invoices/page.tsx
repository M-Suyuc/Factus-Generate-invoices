import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getInvoices } from "@/actions/get-invoices"
import clsx from "clsx"
import DownloadPDF from "./DownloadPDF"

export default async function InvoicesPage() {
  const { data } = await getInvoices()
  const { data: invoices } = data

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Invoices</h1>
        <Link href="/dashboard/create-invoice">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        </Link>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Reference_code</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Dowload</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <TableCell>{invoice.names}</TableCell>
              <TableCell>{invoice.email}</TableCell>
              <TableCell>{invoice.number}</TableCell>
              <TableCell>{invoice.reference_code}</TableCell>
              <TableCell>$ {invoice.total}</TableCell>
              <DownloadPDF pdfNumber={invoice.number} />
              <TableCell
                className={clsx(
                  invoice.status === 0 ? "text-red-600" : "text-green-600"
                )}
              >
                {invoice.status === 0 ? "Inactive" : "Active"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
