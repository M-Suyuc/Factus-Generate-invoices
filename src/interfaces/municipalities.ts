export interface Municipios {
  status: string
  message: string
  data: Datum[]
}

export interface Datum {
  id: number
  code: string
  name: string
  department: Department
}

export enum Department {
  Amazonas = "Amazonas",
  Antioquia = "Antioquia",
  Arauca = "Arauca",
  ArchipielagoDeSANAndres = "Archipielago De San Andres",
  Atlantico = "Atlantico",
  BogotaDC = "Bogota- D.c.",
  Bolivar = "Bolivar",
  Boyaca = "Boyaca",
  Caldas = "Caldas",
  Caqueta = "Caqueta",
  Casanare = "Casanare",
  Cauca = "Cauca",
  Cesar = "Cesar",
  Choco = "Choco",
  Cordoba = "Cordoba",
  Cundinamarca = "Cundinamarca",
  Guainia = "Guainia",
  Guaviare = "Guaviare",
  Huila = "Huila",
  LaGuajira = "La Guajira",
  Magdalena = "Magdalena",
  Meta = "Meta",
  Nariño = "Nariño",
  NorteDeSantander = "Norte De Santander",
  Putumayo = "Putumayo",
  Quindio = "Quindio",
  Risaralda = "Risaralda",
  Santander = "Santander",
  Sucre = "Sucre",
  Tolima = "Tolima",
  ValleDelCauca = "Valle Del Cauca",
  Vaupes = "Vaupes",
  Vichada = "Vichada",
}
