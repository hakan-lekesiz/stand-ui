import { HeadCell } from "../../models/HeadCell";

export const headCells: HeadCell[] = [
    {
      id: "created_at",
      label: "Tarih",
      align:"left",
      sort:true
    },
    {
      id: "name",
      label: "Lokasyon Adı",
      align:"left",
      sort:false
    },
    {
      id: "location_definition",
      label: "Lokasyon Tanımı",
      align:"left",
      sort:false
    },
    {
      id: "city_district",
      label: "İl / İlçe",
      align:"left",
      sort:false
    },
    {
      id: "employee_count",//
      label: "Çalışan Sayısı",
      align:"left",
      sort:false
    },
    {
      id: "branch_agent",//
      label: "Şube Temsilcisi",
      align:"left",
      sort:false
    },
    {
      id: "phone_number",//
      label: "Telefon Numarası",
      align:"left",
      sort:false
    },
   
  ];
