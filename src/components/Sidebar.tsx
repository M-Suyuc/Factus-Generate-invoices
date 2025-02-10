import Link from "next/link"
import { FileText, Home, PlusCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import Image from "next/image"

export function Sidebar() {
  return (
    <div className="w-64 bg-background h-full border-r border-border">
      <div className="p-6">
        <Link href="/dashboard">
          <Image
            src="/logo.png"
            alt="Logo Factus"
            width={150}
            height={150}
            className="mb-10"
          />
        </Link>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link href="/dashboard">
                <Button variant="ghost" className="w-full justify-start">
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/invoices">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  Invoices
                </Button>
              </Link>
            </li>
            <li>
              <Link href="/dashboard/create-invoice">
                <Button variant="ghost" className="w-full justify-start">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Invoice
                </Button>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
