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
      label: "Müşteri Adı",
      align:"left",
      sort:false
    },
    {
      id: "total_locations",
      label: "Lokasyon Sayısı",
      align:"left",
      sort:false
    },
    {
      id: "authorized_person",//
      label: "Yetkili Kişi",
      align:"left",
      sort:false
    },
    {
      id: "phone",//
      label: "Telefon Numarası",
      align:"left",
      sort:false
    },
    {
      id: "consultantName",//
      label: "Danışman",
      align:"left",
      sort:false
    },
    {
      id: "accountStatus",//
      label: "Hesap Durumu",
      align:"left",
      sort:false
    },
  ];
