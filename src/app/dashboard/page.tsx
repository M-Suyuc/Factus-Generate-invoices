import { getInvoices } from "@/actions/get-invoices"
import { getToken } from "@/actions/get-token"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  try {
    const access_token = await getToken()

    const { data } = await getInvoices(access_token)
    const { data: invoices, pagination } = data
    const pendiente = invoices
      .map((item) => item.status)
      .filter((item) => item === 0).length
    const total = pagination.total
    const TotalRevenue = invoices.reduce(
      (prev, actual) => (prev += +actual.total),
      0
    )

    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Pending Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{pendiente}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">$ {TotalRevenue.toFixed(2)}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error in DashboardPage:", error)
    return <div>Error loading data. Please try again later.</div>
  }
}
