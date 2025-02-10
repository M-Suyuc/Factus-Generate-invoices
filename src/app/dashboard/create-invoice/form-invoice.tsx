"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { string, z } from "zod"
import { useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"

import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { useToast } from "@/hooks/use-toast"

import { RangoNumeracion } from "@/interfaces/rango"
import { Municipios } from "@/interfaces/municipalities"
import { Tributos } from "@/interfaces/tributos"
import { UnidadesMedida } from "@/interfaces/medidas"

import { validateInvoice } from "@/actions/validate-invoice"
import {
  cutomerTributos,
  formaPagos,
  IVAExcluida,
  metodoPagos,
  tiposDocumentosIdentidad,
  tiposOrganizaciones,
} from "@/mocks"

const itemSchema = z.object({
  code_reference: z.string().min(1, "Código requerido"),
  name: z.string().min(1, "Nombre requerido"),
  quantity: z.number().min(1, "Debe ser mayor a 0"),
  discount_rate: z.number().min(0).max(100, "Debe estar entre 0 y 100"),
  price: z.number().min(0, "El precio debe ser mayor o igual a 0"),
  tax_rate: z.string(),
  unit_measure_id: z.number(),
  standard_code_id: z.number(),
  is_excluded: z.number(),
  tribute_id: z.number(),
  withholding_taxes: z.array(z.unknown()),
})

const formSchema = z.object({
  numbering_range_id: z.number(),
  reference_code: z.string(),
  observation: z
    .string()
    .min(10, {
      message: "Bio must be at least 10 characters.",
    })
    .max(160, {
      message: "Bio must not be longer than 30 characters.",
    }),
  payment_method_code: z.string(),
  payment_form: z.string(),
  payment_due_date: z
    .date({
      required_error: "expired of pay is required.",
    })
    .optional(),
  billing_period: z.object({
    start_date: z.date({
      required_error: "initial of pay is required.",
    }),
    start_time: string(),
    end_date: z.date({
      required_error: "end of pay is required.",
    }),
    end_time: z.string(),
  }),

  customer: z.object({
    identification: z.string(),
    names: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string(),
    municipality_id: z.string(),
    tribute_id: z.string(),

    legal_organization_id: z.string(),
    identification_document_id: z.string(),
  }),

  items: z.array(itemSchema),
})

type InvoiceFormValues = z.infer<typeof formSchema>

interface InvoiceFormProps {
  rangos: RangoNumeracion
  municipios: Municipios
  tributos: Tributos
  medidas: UnidadesMedida
}

export const CreateInvoicePage: React.FC<InvoiceFormProps> = ({
  rangos,
  tributos,
  municipios,
  medidas,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()
  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numbering_range_id: 8,
      reference_code: "",
      observation: "Esta es la descripción general de la venta",
      payment_method_code: "10",
      payment_form: "1",
      payment_due_date: undefined,
      billing_period: {
        start_date: undefined,
        start_time: "00:00:00",
        end_date: undefined,
        end_time: "23:59:59",
      },
      customer: {
        identification: "11010010101",
        names: "Marlon Suyuc 16 Oct",
        address: "calle 1 # 2-68",
        email: "suyuc@htmail.com",
        phone: "1234567890",
        municipality_id: "980",
        tribute_id: "21",
        legal_organization_id: "2",
        identification_document_id: "3",
      },
      items: [
        {
          code_reference: "12345",
          name: "Leche",
          quantity: 1,
          discount_rate: 20,
          price: 0,
          tax_rate: "19.00",
          unit_measure_id: 70,
          standard_code_id: 1,
          tribute_id: 1,
          is_excluded: 1,
          withholding_taxes: [],
        },
      ],
    },
  })

  const paymentFormValue = form.watch("payment_form")
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  })

  const onSubmit = async (Values: InvoiceFormValues) => {
    try {
      const start_date = format(Values.billing_period.start_date, "yyyy-MM-dd")
      const end_date = format(Values.billing_period.end_date, "yyyy-MM-dd")
      const payment_due_date = format(
        Values.payment_due_date ?? new Date(),
        "yyyy-MM-dd"
      )

      const data = {
        ...Values,
        billing_period: {
          start_date,
          end_date,
        },
        payment_due_date,
      }

      setIsLoading(true)
      const res = await validateInvoice(data)
      console.log({ res })
      router.refresh()
      toast({
        title: "Invoice created",
        description: "Your invoice has been successfully created.",
      })
      // router.push("/dashboard/invoices")
    } catch (error) {
      if (error instanceof Error) {
        toast({
          variant: "destructive",
          title: "Conflict",
          description: error.message ?? "Something went wrong.",
        })
      } else {
        console.error("Ocurrió un error desconocido:", error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleClick = () => {
    append({
      code_reference: "",
      name: "",
      quantity: 1,
      discount_rate: 0,
      price: 0,
      tax_rate: "0",
      unit_measure_id: 70,
      standard_code_id: 1,
      tribute_id: 1,
      is_excluded: 1,
      withholding_taxes: [],
    })
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Create Invoice</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h1 className="font-bold text-2xl text-blue-600 mb-5">Invoice</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {/* Rango de Referencia */}
            <FormField
              control={form.control}
              name="numbering_range_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Rangos</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? rangos.data.find(
                                (rango) => rango.id === field.value
                              )?.document
                            : "Select rango"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search rango."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No rango found.</CommandEmpty>
                          <CommandGroup>
                            {rangos.data.map((rango) => (
                              <CommandItem
                                value={rango.document}
                                key={rango.id}
                                onSelect={() => {
                                  form.setValue("numbering_range_id", rango.id)
                                }}
                              >
                                {rango.document}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    rango.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* Codigo de Referencia */}
            <FormField
              control={form.control}
              name="reference_code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Codigo de referencia</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese codigo de referencia"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* TextArea */}
            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observacion</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Type your message here."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Mètodo de pago */}
            <FormField
              control={form.control}
              name="payment_method_code"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Mètodo de pago</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? metodoPagos.find(
                                (pago) => pago.id.toString() === field.value
                              )?.name
                            : "Select pago"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search Pago."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No pago found.</CommandEmpty>
                          <CommandGroup>
                            {metodoPagos.map((pago) => (
                              <CommandItem
                                value={pago.name}
                                key={pago.id}
                                onSelect={() => {
                                  form.setValue(
                                    "payment_method_code",
                                    pago.id.toString()
                                  )
                                }}
                              >
                                {pago.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    pago.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* Forma de pago */}
            <FormField
              control={form.control}
              name="payment_form"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Forma de pago</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? formaPagos.find(
                                (pago) => pago.id.toString() === field.value
                              )?.name
                            : "Select pago"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search Pago."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No pago found.</CommandEmpty>
                          <CommandGroup>
                            {formaPagos.map((pago) => (
                              <CommandItem
                                value={pago.name}
                                key={pago.id}
                                onSelect={() => {
                                  form.setValue(
                                    "payment_form",
                                    pago.id.toString()
                                  )
                                }}
                              >
                                {pago.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    pago.id.toString() === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />

            {/* Vencimiento de la factura */}
            {paymentFormValue === "2" && (
              <FormField
                control={form.control}
                name="payment_due_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Vencimiento de la factura</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[240px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "yyyy/MM/dd")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Inicio del periodo de facturación */}
            <FormField
              control={form.control}
              name="billing_period.start_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Inicio del periodo de Factura</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "yyyy-MM-dd")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Fin del periodo de facturación */}
            <FormField
              control={form.control}
              name="billing_period.end_date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fin del periodo de Factura</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(new Date(field.value), "yyyy-MM-dd")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <hr className="my-5" />

          <h1 className="font-bold text-2xl text-blue-600 mb-5">Client</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {/* Identificacion */}
            <FormField
              control={form.control}
              name="customer.identification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Identification</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese identification" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Names */}
            <FormField
              control={form.control}
              name="customer.names"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese identification" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Address */}
            <FormField
              control={form.control}
              name="customer.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Direccion</FormLabel>
                  <FormControl>
                    <Input placeholder="Ingrese direccion" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="customer.email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese correo electronico"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Phone */}
            <FormField
              control={form.control}
              name="customer.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Telefono</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingrese numero de telefono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Municipios */}
            <FormField
              control={form.control}
              name="customer.municipality_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Municipios</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? municipios.data.find(
                                (municipio) =>
                                  municipio.id.toString() === field.value
                              )?.name
                            : "Select municipio"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search rango."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No municipio found.</CommandEmpty>
                          <CommandGroup>
                            {municipios.data.map((rango) => (
                              <CommandItem
                                value={rango.name}
                                key={rango.id}
                                onSelect={() => {
                                  form.setValue(
                                    "customer.municipality_id",
                                    rango.id.toString()
                                  )
                                }}
                              >
                                {rango.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    rango.id.toString() === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            {/* Tributos */}
            <FormField
              control={form.control}
              name="customer.tribute_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Tributos</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? cutomerTributos.find(
                                (tributo) =>
                                  tributo.id.toString() === field.value
                              )?.name
                            : "Select tributo"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search tributo."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No municipio found.</CommandEmpty>
                          <CommandGroup>
                            {cutomerTributos.map((tributo) => (
                              <CommandItem
                                value={tributo.name}
                                key={tributo.id}
                                onSelect={() => {
                                  form.setValue(
                                    "customer.tribute_id",
                                    tributo.id.toString()
                                  )
                                }}
                              >
                                {tributo.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    tributo.id.toString() === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            {/* tiposOrganizaciones */}
            <FormField
              control={form.control}
              name="customer.legal_organization_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Organizaciones</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? tiposOrganizaciones.find(
                                (organizacion) =>
                                  organizacion.id.toString() === field.value
                              )?.name
                            : "Select organizacion"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search organizacion."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No municipio found.</CommandEmpty>
                          <CommandGroup>
                            {tiposOrganizaciones.map((organizacion) => (
                              <CommandItem
                                value={organizacion.name}
                                key={organizacion.id}
                                onSelect={() => {
                                  form.setValue(
                                    "customer.legal_organization_id",
                                    organizacion.id.toString()
                                  )
                                }}
                              >
                                {organizacion.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    organizacion.id.toString() === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            {/* tiposDocumentosIdentidad */}
            <FormField
              control={form.control}
              name="customer.identification_document_id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Documento Identidad</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? tiposDocumentosIdentidad.find(
                                (identidad) =>
                                  identidad.id.toString() === field.value
                              )?.name
                            : "Select Documento Identidad"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search identidad."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No municipio found.</CommandEmpty>
                          <CommandGroup>
                            {tiposDocumentosIdentidad.map((identidad) => (
                              <CommandItem
                                value={identidad.name}
                                key={identidad.id}
                                onSelect={() => {
                                  form.setValue(
                                    "customer.identification_document_id",
                                    identidad.id.toString()
                                  )
                                }}
                              >
                                {identidad.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    identidad.id.toString() === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </div>

          <hr className="my-5" />

          <h1 className="font-bold text-2xl text-blue-600 mb-5">Products</h1>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-1 md:grid-cols-3 gap-7"
            >
              {/* Codigo */}
              <FormField
                control={form.control}
                name={`items.${index}.code_reference`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codigo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese Codigo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name */}
              <FormField
                control={form.control}
                name={`items.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese Identificacion" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* cantidad */}
              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cantidad</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese Cantidad"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* discount */}
              <FormField
                control={form.control}
                name={`items.${index}.discount_rate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> Descuento</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese Descuento"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* price */}
              <FormField
                control={form.control}
                name={`items.${index}.price`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ingrese Precio"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* tax_rate */}
              <FormField
                control={form.control}
                name={`items.${index}.tax_rate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porcentaje del impuesto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese Precio" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* impuesto:valor del descuento aplicado */}
              {/* <FormField
                control={form.control}
                name={`items.${index}.discount_rate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Impuesto</FormLabel>
                    <FormControl>
                      <Input placeholder="Ingrese Impuesto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              /> */}

              {/* Medida */}
              <FormField
                control={form.control}
                name={`items.${index}.unit_measure_id`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Medida</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? medidas.data.find(
                                  (medida) => medida.id === field.value
                                )?.name
                              : "Select medida"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search medida."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No municipio found.</CommandEmpty>
                            <CommandGroup>
                              {medidas.data.map((medida) => (
                                <CommandItem
                                  value={medida.name}
                                  key={medida.id}
                                  onSelect={() => {
                                    form.setValue(
                                      `items.${index}.unit_measure_id`,

                                      medida.id
                                    )
                                  }}
                                >
                                  {medida.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      medida.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              {/* is_excluded */}
              <FormField
                control={form.control}
                name={`items.${index}.is_excluded`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Excluido IVA</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            className={cn(
                              "w-[200px] justify-between",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? IVAExcluida.find(
                                  (iva) => iva.id === field.value
                                )?.name
                              : "Select IVA"}
                            <ChevronsUpDown className="opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput
                            placeholder="Search IVA."
                            className="h-9"
                          />
                          <CommandList>
                            <CommandEmpty>No IVA found.</CommandEmpty>
                            <CommandGroup>
                              {IVAExcluida.map((iva) => (
                                <CommandItem
                                  value={iva.name}
                                  key={iva.id}
                                  onSelect={() => {
                                    form.setValue(
                                      `items.${index}.is_excluded`,
                                      iva.id
                                    )
                                  }}
                                >
                                  {iva.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      iva.id === field.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />

              {/* Tributos */}
              <FormField
                control={form.control}
                name={`items.${index}.tribute_id`}
                render={({ field }) => (
                  <>
                    <FormItem className="flex flex-col">
                      <FormLabel>Tributos</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[200px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? tributos.data.find(
                                    (rango) => rango.id === field.value
                                  )?.name
                                : "Select rango"}
                              <ChevronsUpDown className="opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput
                              placeholder="Search rango."
                              className="h-9"
                            />
                            <CommandList>
                              <CommandEmpty>No municipio found.</CommandEmpty>
                              <CommandGroup>
                                {tributos.data.map((tributo) => (
                                  <CommandItem
                                    value={tributo.name}
                                    key={tributo.id}
                                    onSelect={() => {
                                      form.setValue(
                                        `items.${index}.tribute_id`,
                                        tributo.id
                                      )
                                    }}
                                  >
                                    {tributo.name}
                                    <Check
                                      className={cn(
                                        "ml-auto",
                                        tributo.id === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  </>
                )}
              />

              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => remove(index)}
                >
                  Eliminar Producto
                </Button>
              )}
            </div>
          ))}
          <hr className="my-5" />

          <div className="flex gap-8">
            <Button
              onClick={handleClick}
              className="w-fit bg-blue-600 text-white"
            >
              Add product
            </Button>

            <Button type="submit" className="w-fit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Invoice"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
