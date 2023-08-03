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
      label: "Yetkili Adı",
      align:"left",
      sort:false
    },
    {
      id: "phone", //
      label: "Telefon Numarası",
      align:"left",
      sort:false
    },
    {
      id: "email",
      label: "E-mail",
      align:"left",
      sort:false
    },
    {
      id: "user_type",//
      label: "Yetkili Türü",
      align:"left",
      sort:false
    },
    {
      id: "role",//
      label: "Rolü",
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
