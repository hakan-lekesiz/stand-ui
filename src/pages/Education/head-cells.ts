import { HeadCell } from "../../models/HeadCell";

export const headCells: HeadCell[] = [
    {
      id: "created_at",
      label: "Tarih",
      align:"left",
      sort:true
    },
    {
      id: "clientType",
      label: "Müşteri Türü",
      align:"left",
      sort:false
    },
    {
      id: "name",
      label: "İsim",
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
      id: "subjectName",
      label: "Eğitim Konusu",
      align:"left",
      sort:false
    },
    {
      id: "phone",
      label: "Telefon",
      align:"left",
      sort:false
    },
    {
      id: "amount",
      label: "Teklif",
      align:"left",
      sort:false
    },
    {
      id: "educationStatus",
      label: "Durum",
      align:"left",
      sort:false
    },
  ];
